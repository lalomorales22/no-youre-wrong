import React from 'react';
import { Trophy, BarChart3, CheckSquare, RotateCcw, User } from 'lucide-react';
import { Participants } from '../types';

interface ArgumentResultProps {
  result: {
    analysis: string;
    winner: string;
    scores: {
      participant1: {
        total: number;
        logic: number;
        emotional: number;
        communication: number;
      };
      participant2: {
        total: number;
        logic: number;
        emotional: number;
        communication: number;
      };
    };
    forfeitTasks: string[];
  };
  participants: Participants;
  onStartOver: () => void;
}

export function ArgumentResult({ result, participants, onStartOver }: ArgumentResultProps) {
  const participantData = [
    { name: participants.participant1, scores: result.scores.participant1 },
    { name: participants.participant2, scores: result.scores.participant2 }
  ];

  const winner = participantData.find(p => p.scores.total === Math.max(...participantData.map(p => p.scores.total)));

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Analysis Summary */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-md bg-primary/10 p-2">
            <Trophy className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">Analysis Results</h2>
        </div>
        <div className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">{result.analysis}</p>
          <div className="p-4 bg-muted/50 rounded-md">
            <p className="font-medium">{result.winner}</p>
          </div>
        </div>
      </div>

      {/* Participant Scores */}
      <div className="grid md:grid-cols-2 gap-6">
        {participantData.map((participant, index) => (
          <div key={index} className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`rounded-md p-2 ${winner?.name === participant.name ? 'bg-primary/10' : 'bg-muted/50'}`}>
                <User className={`w-5 h-5 ${winner?.name === participant.name ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{participant.name}</h3>
                {winner?.name === participant.name && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Winner</span>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Score</span>
                <span className="text-2xl font-bold">{participant.scores.total}/100</span>
              </div>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Logic & Reasoning</span>
                    <span>{participant.scores.logic}/40</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${(participant.scores.logic / 40) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Emotional Intelligence</span>
                    <span>{participant.scores.emotional}/30</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${(participant.scores.emotional / 30) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Communication Style</span>
                    <span>{participant.scores.communication}/30</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${(participant.scores.communication / 30) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Resolution Tasks */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-md bg-primary/10 p-2">
            <CheckSquare className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">Resolution Tasks</h2>
        </div>
        <p className="text-muted-foreground mb-4">
          Complete these tasks to facilitate understanding and strengthen your relationship:
        </p>
        <div className="space-y-3">
          {result.forfeitTasks.map((task, index) => (
            <div 
              key={index}
              className="flex items-start gap-4 p-4 rounded-md border bg-muted/20 hover:bg-muted/30 transition-colors"
            >
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-primary">{index + 1}</span>
              </div>
              <p className="text-sm leading-relaxed">{task}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center pt-6 border-t border-border">
        <button
          onClick={onStartOver}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          New Analysis
        </button>
      </div>
    </div>
  );
}