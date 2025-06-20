// Secure API functions that call Netlify Functions instead of OpenAI directly
import { Participants } from '../types';

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'argument.webm');

  const response = await fetch('/.netlify/functions/transcribe', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to transcribe audio');
  }

  const result = await response.json();
  return result.transcript;
}

export async function analyzeArgument(transcript: string, participants: Participants) {
  const response = await fetch('/.netlify/functions/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      transcript,
      participants,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to analyze argument');
  }

  return await response.json();
}