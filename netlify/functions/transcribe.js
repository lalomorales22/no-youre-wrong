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
    console.log('Starting transcription process...');
    
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not found');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'OpenAI API key not configured' }),
      };
    }
    
    // Parse the multipart form data
    const boundary = event.headers['content-type']?.split('boundary=')[1];
    if (!boundary) {
      console.error('No boundary found in content-type header');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid content-type header' }),
      };
    }

    const body = Buffer.from(event.body, 'base64');
    
    // Extract the audio file from the form data
    const parts = body.toString('binary').split(`--${boundary}`);
    let audioData = null;
    
    for (const part of parts) {
      if (part.includes('filename=')) {
        const dataStart = part.indexOf('\r\n\r\n') + 4;
        const dataEnd = part.lastIndexOf('\r\n');
        audioData = Buffer.from(part.slice(dataStart, dataEnd), 'binary');
        break;
      }
    }

    if (!audioData || audioData.length === 0) {
      console.error('No audio file found in form data');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No audio file found or file is empty' }),
      };
    }

    console.log('Audio data extracted, size:', audioData.length);

    // Create a File object directly from the audio data instead of using temporary files
    const audioFile = new File([audioData], 'audio.webm', { type: 'audio/webm' });
    
    console.log('Starting OpenAI transcription...');
    const transcript = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'en'
    });

    console.log('Transcription completed:', transcript.text);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ transcript: transcript.text }),
    };
  } catch (error) {
    console.error('Transcription error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to transcribe audio',
        details: error.message 
      }),
    };
  }
};