import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Search, Send, Phone, Video, MoreVertical, Image as ImageIcon, Paperclip, Smile, Plus, Wifi, WifiOff, PhoneOff, PhoneCall } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useChat, Conversation, ChatMessage } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

export function Messages() {
  const { user } = useAuth();
  const {
    conversations, messages, typingUsers, onlineUsers,
    loadConversations, loadMessages,
    sendChatMessage, sendTyping,
    startCall, acceptCall, rejectCall, endCall,
    activeCall, localStream, remoteStream, wsConnected,
  } = useChat();

  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [allUsers, setAllUsers] = useState<{id: string, name: string, photo_url?: string}[]>([]);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find(c => c.id === activeConvId);
  const activeMessages: ChatMessage[] = activeConvId ? messages[activeConvId] || [] : [];
  const remoteParticipant = activeConv?.participants.find(p => p.id !== user?.id);

  useEffect(() => {
    loadConversations();
    api.get('/api/users').then(res => setAllUsers(res.data)).catch(console.error);
  }, [loadConversations]);

  useEffect(() => {
    if (activeConvId) {
      loadMessages(activeConvId);
    }
  }, [activeConvId, loadMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  const handleSelectConv = (conv: Conversation) => {
    setActiveConvId(conv.id);
  };

  const handleSend = () => {
    if (!inputText.trim() || !activeConvId || !remoteParticipant) return;
    sendChatMessage(activeConvId, remoteParticipant.id, inputText.trim());
    setInputText('');
    // Stop typing indicator
    if (remoteParticipant) sendTyping(activeConvId, remoteParticipant.id, false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    if (!activeConvId || !remoteParticipant) return;

    if (!isTyping) {
      setIsTyping(true);
      sendTyping(activeConvId, remoteParticipant.id, true);
    }
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      setIsTyping(false);
      sendTyping(activeConvId!, remoteParticipant.id, false);
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleStartConversation = async (userId: string) => {
    try {
      const res = await api.post('/api/chat/conversations', { participant_id: userId });
      await loadConversations();
      setActiveConvId(res.data.id);
      setSearchQuery('');
    } catch (error) {
      console.error('Failed to start conversation', error);
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const other = conv.participants.find(p => p.id !== user?.id);
    return other?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const existingParticipantIds = new Set(
    conversations.flatMap(c => c.participants.map(p => p.id))
  );

  const filteredOtherUsers = searchQuery.trim() === '' ? [] : allUsers.filter(u => 
    !existingParticipantIds.has(u.id) && 
    u.id !== user?.id && 
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleActionClick = (action: string) => {
    alert(`${action} feature will be available in the next update!`);
  };

  return (
    <div className="flex-1 bg-dash-bg p-4 sm:p-6 lg:p-8 h-[calc(100vh-64px)] flex flex-col relative">
      <div className="max-w-6xl mx-auto w-full h-full flex flex-col">
        
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Messages</h1>
            <p className="text-gray-500 mt-1">Real-time communication with your team.</p>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium">
            {wsConnected ? (
              <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                <Wifi className="w-4 h-4" /> Live
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200 animate-pulse">
                <WifiOff className="w-4 h-4" /> Connecting...
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 bg-white border border-dash-border rounded-3xl shadow-sm overflow-hidden flex h-0">
          
          {/* ── Sidebar ── */}
          <div className="w-80 shrink-0 border-r border-dash-border flex flex-col bg-gray-50/40">
            <div className="p-4 border-b border-dash-border">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Search messages..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF]"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="p-6 text-center text-gray-500 text-sm">
                  <p className="font-medium">No conversations yet.</p>
                  <p className="mt-1 text-xs">Start one from the Team or Directory pages.</p>
                </div>
              ) : filteredConversations.map(conv => {
                const other = conv.participants.find(p => p.id !== user?.id);
                const isOnline = other ? onlineUsers.has(other.id) : false;
                const isActive = conv.id === activeConvId;
                return (
                  <div 
                    key={conv.id} 
                    onClick={() => handleSelectConv(conv)}
                    className={`p-4 border-b border-gray-100 flex items-start gap-3 cursor-pointer transition-colors ${isActive ? 'bg-indigo-50/60 border-l-2 border-l-[#635BFF]' : 'hover:bg-gray-50'}`}
                  >
                    <div className="relative shrink-0">
                      <img 
                        src={other?.photo_url || `https://api.dicebear.com/7.x/notionists/svg?seed=${other?.name}&backgroundColor=F0F0EA`} 
                        alt={other?.name} 
                        className="w-10 h-10 rounded-full border border-gray-200 bg-white" 
                      />
                      {isOnline && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h4 className="text-sm font-bold text-gray-900 truncate">{other?.name ?? 'Unknown'}</h4>
                        <span className="text-xs text-gray-400 shrink-0 ml-2">
                          {conv.last_message_time ? formatTime(conv.last_message_time) : ''}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-500 truncate pr-2">{conv.last_message || 'No messages yet'}</p>
                        {conv.unread_count > 0 && (
                          <span className="w-5 h-5 bg-[#635BFF] text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                            {conv.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredOtherUsers.length > 0 && (
                <div className="mt-4">
                  <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Other People
                  </div>
                  {filteredOtherUsers.map(u => {
                    const isOnline = onlineUsers.has(u.id);
                    return (
                      <div 
                        key={u.id} 
                        onClick={() => handleStartConversation(u.id)}
                        className="p-4 border-b border-gray-100 flex items-center gap-3 cursor-pointer transition-colors hover:bg-gray-50"
                      >
                        <div className="relative shrink-0">
                          <img 
                            src={u.photo_url || `https://api.dicebear.com/7.x/notionists/svg?seed=${u.name}&backgroundColor=F0F0EA`} 
                            alt={u.name} 
                            className="w-10 h-10 rounded-full border border-gray-200 bg-white" 
                          />
                          {isOnline && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-gray-900 truncate">{u.name}</h4>
                          <p className="text-xs text-gray-500 truncate">Start a conversation</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ── Chat Area ── */}
          {activeConv && remoteParticipant ? (
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <div className="h-16 border-b border-dash-border px-6 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src={remoteParticipant.photo_url || `https://api.dicebear.com/7.x/notionists/svg?seed=${remoteParticipant.name}&backgroundColor=F0F0EA`} 
                      alt={remoteParticipant.name} 
                      className="w-9 h-9 rounded-full border border-gray-200"
                    />
                    {onlineUsers.has(remoteParticipant.id) && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{remoteParticipant.name}</h3>
                    <p className="text-xs font-medium">
                      {typingUsers[remoteParticipant.id] ? (
                        <span className="text-[#635BFF] animate-pulse">typing...</span>
                      ) : onlineUsers.has(remoteParticipant.id) ? (
                        <span className="text-emerald-600">Online</span>
                      ) : (
                        <span className="text-gray-400">Offline</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <button 
                    onClick={() => startCall(activeConv, 'audio')}
                    className="p-2 hover:text-[#635BFF] hover:bg-indigo-50 rounded-lg transition-colors" 
                    title="Audio Call"
                  >
                    <Phone className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => startCall(activeConv, 'video')}
                    className="p-2 hover:text-[#635BFF] hover:bg-indigo-50 rounded-lg transition-colors" 
                    title="Video Call"
                  >
                    <Video className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleActionClick('Options')} className="p-2 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-6 overflow-y-auto bg-slate-50/40 flex flex-col gap-3">
                {activeMessages.length === 0 && (
                  <div className="text-center my-auto text-gray-400">
                    <p className="text-sm font-medium">No messages yet. Say hello! 👋</p>
                  </div>
                )}

                {activeMessages.map((msg, i) => {
                  const isMine = msg.sender_id === user?.id;
                  const showDate = i === 0 || new Date(msg.timestamp).toDateString() !== new Date(activeMessages[i-1].timestamp).toDateString();
                  return (
                    <React.Fragment key={msg.id}>
                      {showDate && (
                        <div className="text-center my-2">
                          <span className="text-xs font-medium text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-200">
                            {new Date(msg.timestamp).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      )}
                      <div className={`flex gap-2 ${isMine ? 'flex-row-reverse' : 'flex-row'} max-w-[80%] ${isMine ? 'ml-auto' : 'mr-auto'}`}>
                        {!isMine && (
                          <img src={remoteParticipant.photo_url || `https://api.dicebear.com/7.x/notionists/svg?seed=${remoteParticipant.name}&backgroundColor=F0F0EA`} className="w-8 h-8 rounded-full border border-gray-200 self-end shrink-0" />
                        )}
                        <div>
                          <div className={`p-3 rounded-2xl text-sm ${isMine ? 'bg-[#635BFF] text-white rounded-br-sm shadow-sm' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm'}`}>
                            {msg.text}
                          </div>
                          <p className={`text-[10px] text-gray-400 mt-1 ${isMine ? 'text-right' : 'text-left'}`}>
                            {formatTime(msg.timestamp)}
                          </p>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-dash-border bg-white">
                <div className="flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-[#635BFF]/20 focus-within:border-[#635BFF] transition-all">
                  <div className="flex gap-1 pb-1 px-1">
                    <button onClick={() => handleActionClick('Image Upload')} className="text-gray-400 hover:text-gray-600 p-1.5"><ImageIcon className="w-5 h-5" /></button>
                    <button onClick={() => handleActionClick('File Attachment')} className="text-gray-400 hover:text-gray-600 p-1.5"><Paperclip className="w-5 h-5" /></button>
                  </div>
                  <textarea 
                    placeholder="Write a message..." 
                    className="flex-1 bg-transparent border-none focus:outline-none resize-none py-2 text-sm text-gray-900 max-h-32"
                    rows={1}
                    value={inputText}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                  />
                  <div className="flex gap-2 pb-1 pr-1">
                    <button onClick={() => handleActionClick('Emojis')} className="text-gray-400 hover:text-gray-600 p-1.5"><Smile className="w-5 h-5" /></button>
                    <Button 
                      onClick={handleSend}
                      disabled={!inputText.trim()}
                      className="h-10 w-10 p-0 rounded-xl bg-[#635BFF] hover:bg-[#5046e5] disabled:opacity-40"
                    >
                      <Send className="w-4 h-4 ml-0.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center flex-col gap-4 text-gray-400 bg-gray-50/30">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                <Send className="w-8 h-8 text-gray-300" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-600">Select a conversation</p>
                <p className="text-sm mt-1">Choose from the left to start messaging</p>
              </div>
            </div>
          )}
        </div>

        {/* ── Active Call Overlay ── */}
        {activeCall && (
          <div className="absolute inset-0 bg-gray-900/95 z-50 flex flex-col items-center justify-center text-white backdrop-blur-sm rounded-3xl m-4 sm:m-6 lg:m-8">
            <div className="text-center mb-8">
              <img 
                src={activeCall.remote_user.photo_url || `https://api.dicebear.com/7.x/notionists/svg?seed=${activeCall.remote_user.name}&backgroundColor=F0F0EA`} 
                className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-gray-700 shadow-xl" 
              />
              <h2 className="text-3xl font-bold mb-2">{activeCall.remote_user.name}</h2>
              <p className="text-gray-400 text-lg capitalize flex items-center justify-center gap-2">
                {activeCall.status === 'active' ? (
                  <span className="text-emerald-400 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Call in progress</span>
                ) : (
                  <span className="animate-pulse">{activeCall.status}...</span>
                )}
              </p>
            </div>
            
            {activeCall.type === 'video' && activeCall.status === 'active' && (
              <div className="flex gap-4 mb-8">
                <video autoPlay playsInline muted ref={video => { if (video && localStream.current) video.srcObject = localStream.current }} className="w-48 h-36 bg-gray-800 rounded-2xl object-cover transform scale-x-[-1] shadow-lg border border-gray-700" />
                <video autoPlay playsInline ref={video => { if (video && remoteStream) video.srcObject = remoteStream }} className="w-96 h-72 bg-gray-800 rounded-2xl object-cover shadow-lg border border-gray-700" />
              </div>
            )}

            <div className="flex gap-6 mt-4">
              {activeCall.status === 'ringing' && !activeCall.isCaller && (
                <button onClick={acceptCall} className="bg-emerald-500 hover:bg-emerald-600 rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:scale-105 transition-all">
                  <PhoneCall className="w-7 h-7" />
                </button>
              )}
              <button 
                onClick={activeCall.status === 'ringing' && !activeCall.isCaller ? rejectCall : endCall} 
                className="bg-red-500 hover:bg-red-600 rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:scale-105 transition-all"
              >
                <PhoneOff className="w-7 h-7" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
