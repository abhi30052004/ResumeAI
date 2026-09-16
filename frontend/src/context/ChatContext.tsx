import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useWebSocket } from '../hooks/useWebSocket';
import api from '../lib/api';

// ─── Types ─────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface Participant {
  id: string;
  name: string;
  photo_url?: string;
  role?: string;
  online: boolean;
}

export interface Conversation {
  id: string;
  participants: Participant[];
  last_message?: string;
  last_message_time?: string;
  unread_count: number;
}

export type CallStatus = 'idle' | 'calling' | 'ringing' | 'active' | 'ended';
export type CallType = 'audio' | 'video';

export interface ActiveCall {
  conversation_id: string;
  remote_user: Participant;
  type: CallType;
  status: CallStatus;
  isCaller: boolean;
}

// ─── Context Shape ──────────────────────────────────────────

interface ChatContextType {
  conversations: Conversation[];
  messages: Record<string, ChatMessage[]>;
  typingUsers: Record<string, boolean>;
  onlineUsers: Set<string>;
  activeCall: ActiveCall | null;
  loadConversations: () => Promise<void>;
  loadMessages: (conversationId: string) => Promise<void>;
  sendChatMessage: (conversationId: string, recipientId: string, text: string) => void;
  sendTyping: (conversationId: string, recipientId: string, isTyping: boolean) => void;
  startCall: (conv: Conversation, type: CallType) => void;
  acceptCall: () => void;
  rejectCall: () => void;
  endCall: () => void;
  peerConnection: React.MutableRefObject<RTCPeerConnection | null>;
  localStream: React.MutableRefObject<MediaStream | null>;
  remoteStream: MediaStream | null;
  wsConnected: boolean;
}

const ChatContext = createContext<ChatContextType | null>(null);

// ─── Provider ───────────────────────────────────────────────

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const token = localStorage.getItem('token');

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [wsConnected, setWsConnected] = useState(false);

  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const pendingOffer = useRef<any>(null);

  const wsUrl = user && token
    ? `ws://localhost:8000/api/chat/ws/${user.id}?token=${token}`
    : null;

  const { send, on } = useWebSocket(wsUrl, {
    onOpen: () => setWsConnected(true),
    onClose: () => setWsConnected(false),
  });

  // ── Register WS event handlers ─────────────────────────────

  useEffect(() => {
    const offMessage = on('chat_message', (msg: ChatMessage) => {
      setMessages(prev => {
        const existing = prev[msg.conversation_id] || [];
        // Avoid duplicates
        if (existing.some(m => m.id === msg.id)) return prev;
        return { ...prev, [msg.conversation_id]: [...existing, msg] };
      });
      // Update conversation last_message
      setConversations(prev =>
        prev.map(c =>
          c.id === msg.conversation_id
            ? { ...c, last_message: msg.text, last_message_time: msg.timestamp }
            : c
        )
      );
    });

    const offTyping = on('typing', (data: any) => {
      setTypingUsers(prev => ({ ...prev, [data.sender_id]: data.is_typing }));
      if (data.is_typing) {
        setTimeout(() => setTypingUsers(prev => ({ ...prev, [data.sender_id]: false })), 3000);
      }
    });

    const offPresence = on('presence', (data: any) => {
      setOnlineUsers(prev => {
        const next = new Set(prev);
        if (data.online) next.add(data.user_id);
        else next.delete(data.user_id);
        return next;
      });
    });

    // WebRTC signaling events
    const offOffer = on('call_offer', async (data: any) => {
      pendingOffer.current = data;
      const conv = conversations.find(c => c.participants.some(p => p.id === data.sender_id));
      const remoteUser = conv?.participants.find(p => p.id === data.sender_id);
      if (remoteUser) {
        setActiveCall({
          conversation_id: data.conversation_id,
          remote_user: remoteUser,
          type: data.call_type || 'audio',
          status: 'ringing',
          isCaller: false,
        });
      }
    });

    const offAnswer = on('call_answer', async (data: any) => {
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.sdp));
        setActiveCall(prev => prev ? { ...prev, status: 'active' } : null);
      }
    });

    const offIce = on('ice_candidate', async (data: any) => {
      if (peerConnection.current && data.candidate) {
        try {
          await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (e) { /* ignore stale candidates */ }
      }
    });

    const offReject = on('call_reject', () => {
      cleanupCall();
      setActiveCall(prev => prev ? { ...prev, status: 'ended' } : null);
      setTimeout(() => setActiveCall(null), 2000);
    });

    const offEnd = on('call_end', () => {
      cleanupCall();
      setActiveCall(null);
    });

    return () => {
      offMessage(); offTyping(); offPresence();
      offOffer(); offAnswer(); offIce(); offReject(); offEnd();
    };
  }, [on, conversations]);

  // ── Chat actions ────────────────────────────────────────────

  const loadConversations = useCallback(async () => {
    try {
      const res = await api.get('/api/chat/conversations');
      setConversations(res.data);
    } catch (e) {
      console.error('[Chat] Failed to load conversations', e);
    }
  }, []);

  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      const res = await api.get(`/api/chat/conversations/${conversationId}/messages`);
      setMessages(prev => ({ ...prev, [conversationId]: res.data }));
    } catch (e) {
      console.error('[Chat] Failed to load messages', e);
    }
  }, []);

  const sendChatMessage = useCallback((conversationId: string, recipientId: string, text: string) => {
    send({ type: 'chat_message', conversation_id: conversationId, recipient_id: recipientId, text });
  }, [send]);

  const sendTyping = useCallback((conversationId: string, recipientId: string, isTyping: boolean) => {
    send({ type: 'typing', conversation_id: conversationId, recipient_id: recipientId, is_typing: isTyping });
  }, [send]);

  // ── WebRTC helpers ──────────────────────────────────────────

  const createPeerConnection = useCallback((recipientId: string, conversationId: string) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);
    peerConnection.current = pc;

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        send({ type: 'ice_candidate', recipient_id: recipientId, conversation_id: conversationId, candidate: event.candidate });
      }
    };

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    return pc;
  }, [send]);

  const cleanupCall = useCallback(() => {
    peerConnection.current?.close();
    peerConnection.current = null;
    localStream.current?.getTracks().forEach(t => t.stop());
    localStream.current = null;
    setRemoteStream(null);
  }, []);

  const startCall = useCallback(async (conv: Conversation, type: CallType) => {
    if (!user) return;
    const remoteUser = conv.participants.find(p => p.id !== user.id);
    if (!remoteUser) return;

    setActiveCall({ conversation_id: conv.id, remote_user: remoteUser, type, status: 'calling', isCaller: true });

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: type === 'video'
      });
      localStream.current = stream;

      const pc = createPeerConnection(remoteUser.id, conv.id);
      stream.getTracks().forEach(t => pc.addTrack(t, stream));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      send({ type: 'call_offer', recipient_id: remoteUser.id, conversation_id: conv.id, sdp: offer, call_type: type });
    } catch (e) {
      console.error('[WebRTC] Failed to start call', e);
      cleanupCall();
      setActiveCall(null);
    }
  }, [user, createPeerConnection, send, cleanupCall]);

  const acceptCall = useCallback(async () => {
    if (!pendingOffer.current || !activeCall) return;
    const offer = pendingOffer.current;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: activeCall.type === 'video'
      });
      localStream.current = stream;

      const pc = createPeerConnection(offer.sender_id, activeCall.conversation_id);
      stream.getTracks().forEach(t => pc.addTrack(t, stream));

      await pc.setRemoteDescription(new RTCSessionDescription(offer.sdp));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      send({ type: 'call_answer', recipient_id: offer.sender_id, conversation_id: activeCall.conversation_id, sdp: answer });
      setActiveCall(prev => prev ? { ...prev, status: 'active' } : null);
      pendingOffer.current = null;
    } catch (e) {
      console.error('[WebRTC] Failed to accept call', e);
      cleanupCall();
      setActiveCall(null);
    }
  }, [activeCall, createPeerConnection, send, cleanupCall]);

  const rejectCall = useCallback(() => {
    if (!pendingOffer.current || !activeCall) return;
    send({ type: 'call_reject', recipient_id: pendingOffer.current.sender_id });
    pendingOffer.current = null;
    cleanupCall();
    setActiveCall(null);
  }, [activeCall, send, cleanupCall]);

  const endCall = useCallback(() => {
    if (!activeCall) return;
    send({ type: 'call_end', recipient_id: activeCall.remote_user.id });
    cleanupCall();
    setActiveCall(null);
  }, [activeCall, send, cleanupCall]);

  return (
    <ChatContext.Provider value={{
      conversations, messages, typingUsers, onlineUsers,
      activeCall, loadConversations, loadMessages,
      sendChatMessage, sendTyping,
      startCall, acceptCall, rejectCall, endCall,
      peerConnection, localStream, remoteStream,
      wsConnected,
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
}
