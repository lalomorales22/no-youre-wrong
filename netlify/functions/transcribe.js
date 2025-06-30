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

    if (!audioData) {
      console.error('No audio file found in form data');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No audio file found' }),
      };
    }

    console.log('Audio data extracted, size:', audioData.length);

    // Create a temporary file for the audio
    const fs = require('fs');
    const path = require('path');
    const os = require('os');
    
    const tempDir = os.tmpdir();
    const tempFile = path.join(tempDir, `audio-${Date.now()}.webm`);
    
    fs.writeFileSync(tempFile, audioData);
    console.log('Temporary file created:', tempFile);

    // Transcribe the audio using OpenAI v4 syntax
    console.log('Starting OpenAI transcription...');
    const transcript = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempFile),
      model: 'whisper-1'
    });

    console.log('Transcription completed:', transcript.text);

    // Clean up the temporary file
    fs.unlinkSync(tempFile);
    console.log('Temporary file cleaned up');

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