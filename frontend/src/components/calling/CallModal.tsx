import React, { useEffect, useRef, useState } from 'react';
import { useChat, ActiveCall } from '../../context/ChatContext';
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff, X } from 'lucide-react';

// ── Incoming call ringing overlay ──────────────────────────────────
function IncomingCallBanner({ call }: { call: ActiveCall }) {
  const { acceptCall, rejectCall } = useChat();

  return (
    <div className="fixed bottom-6 right-6 z-[9999] w-80 bg-white rounded-3xl shadow-2xl border border-gray-200 p-5 animate-bounce-in">
      <div className="flex items-center gap-4 mb-4">
        <img
          src={call.remote_user.photo_url || `https://api.dicebear.com/7.x/notionists/svg?seed=${call.remote_user.name}&backgroundColor=F0F0EA`}
          className="w-14 h-14 rounded-full border-2 border-[#635BFF] shadow"
        />
        <div>
          <p className="text-xs font-semibold text-[#635BFF] uppercase tracking-wider">
            Incoming {call.type === 'video' ? 'Video' : 'Audio'} Call
          </p>
          <h3 className="text-lg font-bold text-gray-900">{call.remote_user.name}</h3>
        </div>
      </div>
      <div className="flex gap-3">
        <button
          onClick={rejectCall}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 font-semibold transition-colors"
        >
          <PhoneOff className="w-5 h-5" /> Decline
        </button>
        <button
          onClick={acceptCall}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-500 text-white hover:bg-emerald-600 font-semibold transition-colors"
        >
          <Phone className="w-5 h-5" /> Accept
        </button>
      </div>
    </div>
  );
}

// ── Active call modal ───────────────────────────────────────────────
function ActiveCallModal({ call }: { call: ActiveCall }) {
  const { endCall, localStream, remoteStream } = useChat();
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localVideoRef.current && localStream.current) {
      localVideoRef.current.srcObject = localStream.current;
    }
  }, [localStream.current]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const toggleMute = () => {
    if (localStream.current) {
      localStream.current.getAudioTracks().forEach(t => { t.enabled = muted; });
      setMuted(!muted);
    }
  };

  const toggleVideo = () => {
    if (localStream.current) {
      localStream.current.getVideoTracks().forEach(t => { t.enabled = videoOff; });
      setVideoOff(!videoOff);
    }
  };

  return (
    <div className="fixed inset-0 z-[9998] bg-gray-900 flex flex-col">
      {/* Remote video / avatar */}
      <div className="flex-1 relative flex items-center justify-center">
        {call.type === 'video' ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-4">
            <img
              src={call.remote_user.photo_url || `https://api.dicebear.com/7.x/notionists/svg?seed=${call.remote_user.name}&backgroundColor=F0F0EA`}
              className="w-36 h-36 rounded-full border-4 border-[#635BFF] shadow-2xl"
            />
            <h2 className="text-3xl font-bold text-white">{call.remote_user.name}</h2>
            <p className="text-gray-400 text-lg">
              {call.status === 'calling' ? 'Calling...' : call.status === 'ringing' ? 'Connecting...' : 'In call'}
            </p>
          </div>
        )}

        {/* Local PiP */}
        {call.type === 'video' && (
          <div className="absolute bottom-4 right-4 w-40 h-28 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20">
            <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          </div>
        )}

        {/* Call name overlay for video */}
        {call.type === 'video' && (
          <div className="absolute top-6 left-6">
            <h2 className="text-2xl font-bold text-white drop-shadow">{call.remote_user.name}</h2>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="h-32 flex items-center justify-center gap-6 bg-gray-900/80 backdrop-blur-md">
        <button
          onClick={toggleMute}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${muted ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
        >
          {muted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>

        {call.type === 'video' && (
          <button
            onClick={toggleVideo}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${videoOff ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
          >
            {videoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
          </button>
        )}

        <button
          onClick={endCall}
          className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all shadow-xl"
        >
          <PhoneOff className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
}

// ── Main export: renders the right overlay based on call state ──────
export function CallModal() {
  const { activeCall } = useChat();
  if (!activeCall) return null;
  if (activeCall.status === 'ringing' && !activeCall.isCaller) return <IncomingCallBanner call={activeCall} />;
  return <ActiveCallModal call={activeCall} />;
}
