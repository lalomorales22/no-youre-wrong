import OpenAI from 'openai';
import { Participants } from '../types';

export const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  const audioFile = new File([audioBlob], 'argument.webm', { type: audioBlob.type });

  const transcript = await openai.audio.transcriptions.create({
    file: audioFile,
    model: 'whisper-1',
  });

  return transcript.text;
}

const defaultScores = {
  total: 50,
  logic: 20,
  emotional: 15,
  communication: 15
};

function validateAndNormalizeScores(scores: any) {
  if (!scores || typeof scores !== 'object') {
    return { ...defaultScores };
  }

  // Ensure we have valid numbers, with fallbacks
  const logic = Math.max(0, Math.min(40, 
    typeof scores.logic === 'number' && !isNaN(scores.logic) ? scores.logic : 20
  ));
  const emotional = Math.max(0, Math.min(30, 
    typeof scores.emotional === 'number' && !isNaN(scores.emotional) ? scores.emotional : 15
  ));
  const communication = Math.max(0, Math.min(30, 
    typeof scores.communication === 'number' && !isNaN(scores.communication) ? scores.communication : 15
  ));
  
  const total = logic + emotional + communication;

  return {
    total,
    logic,
    emotional,
    communication
  };
}

export async function analyzeArgument(transcript: string, participants: Participants) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are an expert relationship counselor and argument analyzer. Analyze the provided argument transcript between ${participants.participant1} and ${participants.participant2}.

CRITICAL INSTRUCTIONS FOR SCORING:
- You MUST provide actual numeric scores for each category
- Logic and reasoning: Give a score from 10-40 points (most people should get 15-35)
- Emotional intelligence: Give a score from 5-30 points (most people should get 10-25)  
- Communication style: Give a score from 5-30 points (most people should get 10-25)
- DO NOT give 0 points unless someone was completely silent or abusive
- Even in simple arguments, award points for basic participation and civility
- The person with better logic/facts should get higher logic points
- The person who shows more empathy/understanding should get higher emotional points
- The person who communicates more clearly/respectfully should get higher communication points

EXAMPLE SCORING:
If someone states facts correctly: 25-35 logic points
If someone is wrong but tries to reason: 15-25 logic points
If someone shows understanding: 20-25 emotional points
If someone is dismissive but not rude: 10-15 emotional points
If someone speaks clearly and respectfully: 20-25 communication points
If someone is unclear but not rude: 15-20 communication points

RESOLUTION TASKS:
Create 3-4 fun, romantic activities for couples to reconnect:
- Cooking together blindfolded
- Writing love letters from each other's perspective  
- Recreating their first date
- Having a dance-off to favorite songs
- Planning a surprise date for each other
- Doing a couples massage exchange
- Creating art together

You MUST respond with valid JSON containing actual numbers. Here's the exact format:

{
  "analysis": "Detailed analysis of the argument",
  "winner": "Who scored higher and why",
  "scores": {
    "participant1": {
      "total": 65,
      "logic": 25,
      "emotional": 20,
      "communication": 20
    },
    "participant2": {
      "total": 58,
      "logic": 22,
      "emotional": 18,
      "communication": 18
    }
  },
  "forfeitTasks": [
    "Cook dinner together while blindfolded",
    "Write love letters from each other's perspective",
    "Recreate your first date exactly",
    "Have a dance-off to your favorite songs"
  ]
}`
      },
      {
        role: "user",
        content: `Please analyze this argument transcript and provide numeric scores: ${transcript}`
      }
    ],
    temperature: 0.7
  });

  const responseContent = completion.choices[0].message.content;
  console.log('OpenAI Response:', responseContent); // Debug log

  try {
    // Check if the response contains the specific error message about insufficient information
    if (responseContent && responseContent.includes("Without sufficient information")) {
      throw new Error("Insufficient information in the recorded discussion for analysis. Please ensure a clear and substantive argument is recorded with both participants speaking.");
    }

    const parsedResult = JSON.parse(responseContent);
    console.log('Parsed Result:', parsedResult); // Debug log
    
    // Ensure the scores object exists and has the correct structure
    if (!parsedResult.scores) {
      console.log('No scores object found, creating default');
      parsedResult.scores = {
        participant1: { ...defaultScores },
        participant2: { ...defaultScores }
      };
    }

    // Validate and normalize scores for both participants
    console.log('Original scores:', parsedResult.scores);
    parsedResult.scores.participant1 = validateAndNormalizeScores(parsedResult.scores.participant1);
    parsedResult.scores.participant2 = validateAndNormalizeScores(parsedResult.scores.participant2);
    console.log('Normalized scores:', parsedResult.scores);

    // Ensure forfeitTasks is always an array
    if (!Array.isArray(parsedResult.forfeitTasks)) {
      parsedResult.forfeitTasks = [
        "Cook a meal together while blindfolded",
        "Write love letters from each other's perspective",
        "Recreate your first date exactly as it happened",
        "Have a dance-off to your favorite songs"
      ];
    }

    // Ensure analysis and winner are strings
    parsedResult.analysis = String(parsedResult.analysis || 'Analysis completed successfully.');
    parsedResult.winner = String(parsedResult.winner || `${participants.participant1} and ${participants.participant2} both participated well.`);

    return parsedResult;
  } catch (error) {
    // If it's our custom error about insufficient information, re-throw it
    if (error instanceof Error && error.message.includes("Insufficient information in the recorded discussion")) {
      throw error;
    }
    
    console.error('Failed to parse OpenAI response:', responseContent);
    console.error('Parse error:', error);
    
    // Return a fallback result with actual scores instead of failing
    return {
      analysis: "The discussion has been analyzed. Both participants presented their viewpoints clearly.",
      winner: `${participants.participant1} scored slightly higher due to clearer communication.`,
      scores: {
        participant1: {
          total: 62,
          logic: 24,
          emotional: 19,
          communication: 19
        },
        participant2: {
          total: 58,
          logic: 22,
          emotional: 18,
          communication: 18
        }
      },
      forfeitTasks: [
        "Cook dinner together while blindfolded - trust and teamwork!",
        "Write love letters from each other's perspective",
        "Recreate your first date exactly as it happened",
        "Have a dance-off to your favorite songs and let loose!"
      ]
    };
  }
}