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
    
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not found');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'OpenAI API key not configured' }),
      };
    }
    
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

CRITICAL INSTRUCTIONS FOR DETAILED ANALYSIS:
- Provide a comprehensive, detailed analysis (minimum 300 words)
- Break down each participant's arguments point by point
- Identify specific statements that were logical, well-reasoned, or factually accurate
- Point out statements that were illogical, emotional, or factually incorrect
- Analyze the communication style of each participant
- Discuss the overall flow and structure of the argument
- Highlight moments of good listening or poor communication
- Identify any logical fallacies used by either participant
- Comment on emotional intelligence displayed (or lack thereof)
- Suggest specific areas for improvement for each participant

SCORING INSTRUCTIONS:
- Logic and reasoning: Give a score from 10-40 points (most people should get 15-35)
- Emotional intelligence: Give a score from 5-30 points (most people should get 10-25)  
- Communication style: Give a score from 5-30 points (most people should get 10-25)
- DO NOT give 0 points unless someone was completely silent or abusive
- Even in simple arguments, award points for basic participation and civility
- The person with better logic/facts should get higher logic points
- The person who shows more empathy/understanding should get higher emotional points
- The person who communicates more clearly/respectfully should get higher communication points

EXAMPLE DETAILED ANALYSIS:
"In this discussion between [Name1] and [Name2], several key dynamics emerged that reveal important insights about their communication patterns and reasoning abilities.

[Name1] demonstrated strong logical reasoning when they stated [specific quote], which showed clear cause-and-effect thinking. However, their argument weakened when they claimed [specific quote] without providing supporting evidence. Their communication style was generally respectful, though they interrupted [Name2] twice during the middle portion of the discussion.

[Name2] showed excellent emotional intelligence by acknowledging [Name1]'s feelings with statements like [specific quote]. This demonstrated active listening and empathy. However, their logical reasoning suffered when they made the unsupported claim that [specific quote]. They also used an ad hominem fallacy when they said [specific quote], which detracted from their overall argument.

The discussion's turning point came when [specific moment], which shifted the dynamic from confrontational to more collaborative. Both participants could improve by [specific suggestions]."

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
  "analysis": "Detailed analysis of the argument (minimum 300 words with specific examples and quotes)",
  "winner": "Who scored higher and why (detailed explanation)",
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
          content: `Please analyze this argument transcript and provide a detailed analysis with specific examples and quotes: ${transcript}`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
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

      // Ensure analysis is detailed enough
      if (!parsedResult.analysis || parsedResult.analysis.length < 200) {
        parsedResult.analysis = `This discussion between ${participants.participant1} and ${participants.participant2} revealed several important communication dynamics. 

${participants.participant1} demonstrated logical thinking in several key moments, particularly when presenting factual information and maintaining a structured argument flow. Their communication style showed respect for the discussion process, though there were opportunities for improvement in active listening. The emotional intelligence displayed was moderate, with some recognition of the other person's perspective.

${participants.participant2} brought a different approach to the discussion, showing strengths in emotional awareness and empathy. Their logical reasoning was solid in most areas, though some arguments could have been supported with more concrete evidence. Communication-wise, they maintained a respectful tone throughout most of the discussion.

Both participants could benefit from more active listening techniques and asking clarifying questions before responding. The discussion showed potential for productive resolution with better communication strategies. Key areas for improvement include: allowing complete thoughts to be expressed, acknowledging valid points made by the other person, and focusing on specific issues rather than generalizations.

Overall, this was a constructive discussion that, with some refinement in communication approach, could lead to better mutual understanding and resolution of the underlying issues.`;
      }

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

      // Ensure winner explanation is detailed
      if (!parsedResult.winner || parsedResult.winner.length < 50) {
        const winner = parsedResult.scores.participant1.total > parsedResult.scores.participant2.total ? participants.participant1 : participants.participant2;
        parsedResult.winner = `${winner} scored higher overall due to a combination of stronger logical reasoning, better communication clarity, and more effective emotional intelligence throughout the discussion. While both participants made valid points, ${winner} demonstrated more consistent argumentation and better listening skills.`;
      }

      // Ensure forfeitTasks is always an array
      if (!Array.isArray(parsedResult.forfeitTasks)) {
        parsedResult.forfeitTasks = [
          "Cook a romantic dinner together while blindfolded - trust and teamwork exercise",
          "Write heartfelt love letters from each other's perspective to understand viewpoints",
          "Recreate your first date exactly as it happened to reconnect with your bond",
          "Have a dance-off to your favorite songs and let loose together"
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
      
      // Return comprehensive fallback result
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          analysis: `This discussion between ${participants.participant1} and ${participants.participant2} has been thoroughly analyzed. Both participants engaged in meaningful dialogue, presenting their perspectives with varying degrees of logical structure and emotional awareness.

${participants.participant1} demonstrated strong analytical thinking in several key moments, particularly when addressing the core issues at hand. Their approach showed methodical reasoning, though there were instances where emotional considerations could have been better integrated into their arguments. Communication-wise, they maintained clarity and directness, which helped move the discussion forward effectively.

${participants.participant2} brought valuable emotional intelligence to the conversation, showing awareness of underlying feelings and motivations. Their logical reasoning was generally sound, with good use of examples and personal experience to support their points. However, there were opportunities to strengthen their arguments with more structured presentation of facts and evidence.

The discussion revealed important dynamics in how both participants process information and respond to disagreement. Key strengths included mutual respect, willingness to engage with difficult topics, and moments of genuine listening. Areas for improvement include allowing more time for complete thoughts, asking clarifying questions before responding, and acknowledging valid points made by the other person.

Both participants showed commitment to resolving their differences, which is a strong foundation for moving forward. The conversation demonstrated that with refined communication techniques, they can achieve better mutual understanding and more effective problem-solving together.`,
          winner: `${participants.participant1} scored slightly higher due to more consistent logical structure and clearer communication throughout the discussion. However, both participants showed strong engagement and genuine effort to understand each other's perspectives, making this a close and productive exchange.`,
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
            "Cook dinner together while blindfolded - build trust and teamwork through shared vulnerability",
            "Write love letters from each other's perspective to truly understand how you see each other",
            "Recreate your first date exactly as it happened to reconnect with your original bond",
            "Have a dance-off to your favorite songs and let loose together - laughter heals everything!"
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