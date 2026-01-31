import React, { useState, useRef, useEffect } from 'react';
import { Mic, X, Send, ChevronRight, Play, Pause, Trash2 } from 'lucide-react';

const AudioRecorder = ({ onSendAudio, onCancel }) => {
  const [isRecording, setIsRecording] = useState(true);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    startRecording();
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Erro ao acessar microfone:', error);
      alert('Não foi possível acessar o microfone.');
      onCancel();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setIsPlaying(false);
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSend = () => {
    if (isRecording) {
      stopRecording();
      setTimeout(() => {
        if (audioChunksRef.current.length > 0) {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          onSendAudio(blob, recordingTime);
        }
      }, 100);
    } else if (audioBlob) {
      onSendAudio(audioBlob, recordingTime);
    }
  };

  const handleCancel = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) clearInterval(timerRef.current);
    if (audioRef.current) audioRef.current.pause();
    onCancel();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3">
      {/* Cancel Button */}
      <button
        onClick={handleCancel}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        title="Cancelar"
      >
        <X size={20} className="text-gray-600 dark:text-gray-400" />
      </button>

      {/* Recording State */}
      {isRecording && (
        <>
          {/* Recording Indicator */}
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse flex-shrink-0"></div>

          {/* Timer */}
          <span className="text-sm sm:text-base font-mono text-gray-700 dark:text-gray-300 flex-shrink-0">
            {formatTime(recordingTime)}
          </span>

          {/* Waveform Visual */}
          <div className="flex-1 flex items-center justify-center gap-0.5 h-8">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="w-0.5 bg-gray-400 dark:bg-gray-600 rounded-full"
                style={{
                  height: `${Math.random() * 60 + 20}%`,
                  animation: `pulse ${Math.random() * 0.5 + 0.5}s ease-in-out infinite`,
                  animationDelay: `${i * 0.05}s`
                }}
              />
            ))}
          </div>
1
          {/* Stop & Preview Button */}
          <button
            onClick={stopRecording}
            className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors flex-shrink-0"
            title="Parar e visualizar"
          >
            <Mic size={18} className="text-gray-600 dark:text-gray-400" />
          </button>
        </>
      )}

      {/* Preview State */}
      {!isRecording && audioBlob && (
        <>
          {/* Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full transition-all shadow-lg shadow-blue-500/50 flex-shrink-0"
            title={isPlaying ? "Pausar" : "Ouvir"}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
          </button>

          {/* Timer */}
          <span className="text-sm sm:text-base font-mono text-gray-700 dark:text-gray-300 flex-shrink-0">
            {formatTime(recordingTime)}
          </span>

          {/* Static Waveform */}
          <div className="flex-1 flex items-center justify-center gap-0.5 h-8">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="w-0.5 bg-gradient-to-t from-blue-400 to-purple-500 dark:from-blue-600 dark:to-purple-700 rounded-full transition-all"
                style={{
                  height: `${Math.random() * 60 + 20}%`
                }}
              />
            ))}
          </div>

          {/* Delete Button */}
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors flex-shrink-0"
            title="Descartar"
          >
            <Trash2 size={18} className="text-red-500" />
          </button>
        </>
      )}

      {/* Send Button */}
      <button
        onClick={handleSend}
        className="p-2.5 sm:p-3 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 hover:from-blue-600 hover:via-blue-700 hover:to-purple-700 text-white rounded-full transition-all shadow-lg shadow-blue-500/50 flex-shrink-0"
        title={isRecording ? "Parar e enviar" : "Enviar áudio"}
      >
        <Send size={18} className="sm:w-5 sm:h-5" />
      </button>
    </div>
  );
};

export default AudioRecorder;