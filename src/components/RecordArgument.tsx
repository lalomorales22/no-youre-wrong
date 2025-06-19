import React, { useState, useRef } from 'react';
import { Mic, Square, Users } from 'lucide-react';
import { Participants } from '../types';

interface RecordArgumentProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  participants: Participants;
}

export function RecordArgument({ onRecordingComplete, participants }: RecordArgumentProps) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        onRecordingComplete(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Unable to access microphone. Please ensure you have granted permission.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-slide-up">
      {/* Participants Display */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-md bg-primary/10 p-2">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">Discussion Participants</h3>
        </div>
        <div className="flex items-center justify-center gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
              <span className="text-lg font-semibold text-primary">
                {participants.participant1.charAt(0).toUpperCase()}
              </span>
            </div>
            <p className="font-medium">{participants.participant1}</p>
          </div>
          
          <div className="text-muted-foreground font-medium">vs</div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
              <span className="text-lg font-semibold text-primary">
                {participants.participant2.charAt(0).toUpperCase()}
              </span>
            </div>
            <p className="font-medium">{participants.participant2}</p>
          </div>
        </div>
      </div>

      {/* Recording Interface */}
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-primary">Record Your Discussion</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Present your arguments clearly and respectfully. The AI will analyze the content, 
            logic, and communication style of both participants.
          </p>
        </div>

        <div className="flex flex-col items-center space-y-6">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-32 h-32 rounded-full transition-all duration-300 flex items-center justify-center ${
              isRecording 
                ? 'bg-destructive/10 hover:bg-destructive/20 border-2 border-destructive animate-pulse' 
                : 'bg-primary/10 hover:bg-primary/20 border-2 border-primary'
            }`}
          >
            {isRecording ? (
              <Square className="w-12 h-12 text-destructive" />
            ) : (
              <Mic className="w-12 h-12 text-primary" />
            )}
          </button>
          
          <div className="space-y-2 text-center">
            <p className="text-lg font-medium">
              {isRecording ? 'Recording in progress...' : 'Ready to record'}
            </p>
            <p className="text-sm text-muted-foreground">
              {isRecording ? 'Click the button to stop recording' : 'Click the microphone to start recording'}
            </p>
          </div>
        </div>

        {/* Guidelines */}
        <div className="rounded-lg border bg-muted/50 p-6 text-left">
          <h4 className="font-semibold mb-3">Recording Guidelines</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Speak clearly and at a moderate pace</li>
            <li>• Allow each participant to present their full argument</li>
            <li>• Avoid interrupting or speaking over each other</li>
            <li>• Focus on facts, reasoning, and respectful communication</li>
            <li>• Keep the discussion focused on the specific topic</li>
          </ul>
        </div>
      </div>
    </div>
  );
}