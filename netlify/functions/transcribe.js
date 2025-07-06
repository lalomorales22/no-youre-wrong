const fetch = require('node-fetch');
const FormData = require('form-data');

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
    console.log('Transcribe function called');
    
    // Parse the multipart form data
    const boundary = event.headers['content-type'].split('boundary=')[1];
    if (!boundary) {
      throw new Error('No boundary found in content-type header');
    }

    // Extract audio file from the request body
    const body = Buffer.from(event.body, event.isBase64Encoded ? 'base64' : 'utf8');
    
    // For now, return a mock transcription since we don't have OpenAI API key setup
    // In production, you would integrate with OpenAI Whisper API here
    const mockTranscript = "This is a mock transcription. The audio transcription service is not fully configured yet.";

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transcript: mockTranscript,
      }),
    };
  } catch (error) {
    console.error('Transcription error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Failed to transcribe audio: ' + error.message,
      }),
    };
  }
};