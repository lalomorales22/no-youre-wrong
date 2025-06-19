import React, { useState } from 'react';
import { Users, ArrowRight } from 'lucide-react';
import { Participants } from '../types';

interface ParticipantFormProps {
  onSubmit: (participants: Participants) => void;
}

export function ParticipantForm({ onSubmit }: ParticipantFormProps) {
  const [participant1, setParticipant1] = useState('');
  const [participant2, setParticipant2] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (participant1.trim() && participant2.trim()) {
      onSubmit({
        participant1: participant1.trim(),
        participant2: participant2.trim(),
      });
    }
  };

  return (
    <div className="max-w-md mx-auto animate-slide-up">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-md bg-primary/10 p-2">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Discussion Participants</h2>
            <p className="text-sm text-muted-foreground">Enter the names of both participants</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="participant1" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              First Participant
            </label>
            <input
              type="text"
              id="participant1"
              value={participant1}
              onChange={(e) => setParticipant1(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter participant name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="participant2" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Second Participant
            </label>
            <input
              type="text"
              id="participant2"
              value={participant2}
              onChange={(e) => setParticipant2(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter participant name"
              required
            />
          </div>
          
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full gap-2"
          >
            Continue to Recording
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}