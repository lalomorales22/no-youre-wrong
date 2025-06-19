import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { RecordArgument } from './components/RecordArgument';
import { WaveformAnimation } from './components/WaveformAnimation';
import { ArgumentResult } from './components/ArgumentResult';
import { ParticipantForm } from './components/ParticipantForm';
import { transcribeAudio, analyzeArgument } from './lib/openai';
import { Participants } from './types';

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'participants' | 'recording' | 'processing' | 'result'>('landing');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [participants, setParticipants] = useState<Participants | null>(null);

  const handleGetStarted = () => {
    setCurrentView('participants');
  };

  const handleRecordingComplete = async (audioBlob: Blob) => {
    try {
      setIsProcessing(true);
      setCurrentView('processing');
      
      // Step 1: Transcribe the audio
      const transcript = await transcribeAudio(audioBlob);
      
      // Step 2: Analyze the argument with participant names
      const analysis = await analyzeArgument(transcript, participants!);
      
      setResult(analysis);
      setCurrentView('result');
    } catch (error) {
      console.error('Error processing argument:', error);
      alert('Sorry, there was an error processing your argument. Please try again.');
      setCurrentView('recording');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleParticipantsSubmit = (participantData: Participants) => {
    setParticipants(participantData);
    setCurrentView('recording');
  };

  const handleStartOver = () => {
    setCurrentView('landing');
    setResult(null);
    setParticipants(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-center text-primary">
            No, You're Wrong!
          </h1>
          <p className="text-center text-muted-foreground mt-2">
            Professional argument analysis and resolution
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {currentView === 'landing' && (
          <LandingPage onGetStarted={handleGetStarted} />
        )}
        
        {currentView === 'participants' && (
          <ParticipantForm onSubmit={handleParticipantsSubmit} />
        )}
        
        {currentView === 'recording' && participants && (
          <RecordArgument onRecordingComplete={handleRecordingComplete} participants={participants} />
        )}
        
        {currentView === 'processing' && (
          <div className="flex flex-col items-center justify-center space-y-4 py-16">
            <WaveformAnimation />
            <p className="text-xl text-muted-foreground">Analyzing your discussion...</p>
          </div>
        )}
        
        {currentView === 'result' && result && participants && (
          <ArgumentResult 
            result={result} 
            participants={participants} 
            onStartOver={handleStartOver}
          />
        )}
      </main>
    </div>
  );
}

export default App;