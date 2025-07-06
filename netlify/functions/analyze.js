exports.handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    console.log('Analyze function called');
    
    const { transcript, participants } = JSON.parse(event.body);
    
    if (!transcript || !participants) {
      throw new Error('Missing transcript or participants data');
    }

    // Mock analysis result since we don't have OpenAI API key setup
    // In production, you would integrate with OpenAI GPT API here
    const mockAnalysis = {
      winner: participants.participant1,
      reasoning: "This is a mock analysis. The argument analysis service is not fully configured yet. In a real implementation, this would use AI to analyze the argument quality, logic, and persuasiveness.",
      scores: {
        [participants.participant1]: {
          logic: 8,
          evidence: 7,
          persuasiveness: 9,
          clarity: 8
        },
        [participants.participant2]: {
          logic: 6,
          evidence: 5,
          persuasiveness: 7,
          clarity: 7
        }
      },
      summary: "Mock summary of the argument analysis.",
      keyPoints: [
        "This is a mock key point from the analysis",
        "Another mock insight about the argument",
        "A third mock observation"
      ]
    };

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mockAnalysis),
    };
  } catch (error) {
    console.error('Analysis error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Failed to analyze argument: ' + error.message,
      }),
    };
  }
};