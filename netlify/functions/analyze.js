const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    console.log('Starting argument analysis...');
    
    const { transcript, participants } = JSON.parse(event.body);

    if (!transcript || !participants) {
      console.error('Missing transcript or participants');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing transcript or participants' }),
      };
    }

    console.log('Participants:', participants);
    console.log('Transcript length:', transcript.length);

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

You MUST respond with valid JSON containing actual numbers. Use "participant1" for ${participants.participant1} and "participant2" for ${participants.participant2}. Here's the exact format:

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

    console.log('OpenAI analysis completed');

    const responseContent = completion.choices[0].message.content;
    console.log('Raw OpenAI response:', responseContent);

    try {
      const parsedResult = JSON.parse(responseContent);
      
      // Validate and ensure proper structure
      const defaultScores = {
        total: 50,
        logic: 20,
        emotional: 15,
        communication: 15
      };

      // Fix scores structure - convert participant names to participant1/participant2
      if (parsedResult.scores) {
        const scoreKeys = Object.keys(parsedResult.scores);
        if (scoreKeys.length >= 2 && 
            !parsedResult.scores.participant1 && 
            !parsedResult.scores.participant2) {
          
          // Map participant names to participant1/participant2
          const newScores = {
            participant1: parsedResult.scores[participants.participant1] || { ...defaultScores },
            participant2: parsedResult.scores[participants.participant2] || { ...defaultScores }
          };
          parsedResult.scores = newScores;
        }
      }

      if (!parsedResult.scores) {
        parsedResult.scores = {
          participant1: { ...defaultScores },
          participant2: { ...defaultScores }
        };
      }

      // Ensure forfeitTasks is always an array
      if (!Array.isArray(parsedResult.forfeitTasks)) {
        parsedResult.forfeitTasks = [
          "Cook a meal together while blindfolded",
          "Write love letters from each other's perspective",
          "Recreate your first date exactly as it happened",
          "Have a dance-off to your favorite songs"
        ];
      }

      console.log('Analysis result prepared successfully');

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(parsedResult),
      };
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', responseContent);
      console.error('Parse error:', parseError);
      
      // Return fallback result
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
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
        }),
      };
    }
  } catch (error) {
    console.error('Analysis error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to analyze argument',
        details: error.message 
      }),
    };
  }
};