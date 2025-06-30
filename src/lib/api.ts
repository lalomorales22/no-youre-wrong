// Secure API functions that call Netlify Functions instead of OpenAI directly
import { Participants } from '../types';

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  console.log('transcribeAudio called with blob size:', audioBlob.size);
  const formData = new FormData();
  formData.append('audio', audioBlob, 'argument.webm');

  console.log('Making request to /.netlify/functions/transcribe');
  const response = await fetch('/.netlify/functions/transcribe', {
    method: 'POST',
    body: formData,
  });

  console.log('Transcribe response:', response.status, response.statusText);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Transcribe error response:', errorText);
    try {
      const error = JSON.parse(errorText);
      throw new Error(error.error || 'Failed to transcribe audio');
    } catch {
      throw new Error(`Failed to transcribe audio: ${response.status} ${response.statusText}`);
    }
  }

  const result = await response.json();
  console.log('Transcribe result:', result);
  return result.transcript;
}

export async function analyzeArgument(transcript: string, participants: Participants) {
  console.log('analyzeArgument called with:', { transcriptLength: transcript.length, participants });
  
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

  console.log('Analyze response:', response.status, response.statusText);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Analyze error response:', errorText);
    try {
      const error = JSON.parse(errorText);
      throw new Error(error.error || 'Failed to analyze argument');
    } catch {
      throw new Error(`Failed to analyze argument: ${response.status} ${response.statusText}`);
    }
  }

  const result = await response.json();
  console.log('Analyze result:', result);
  return result;
}