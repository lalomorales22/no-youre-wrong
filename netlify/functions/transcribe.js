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
    // Parse the multipart form data
    const boundary = event.headers['content-type'].split('boundary=')[1];
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
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No audio file found' }),
      };
    }

    // Create a temporary file for the audio
    const fs = require('fs');
    const path = require('path');
    const os = require('os');
    
    const tempDir = os.tmpdir();
    const tempFile = path.join(tempDir, `audio-${Date.now()}.webm`);
    
    fs.writeFileSync(tempFile, audioData);

    // Transcribe the audio using OpenAI v4 syntax
    const transcript = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempFile),
      model: 'whisper-1'
    });

    // Clean up the temporary file
    fs.unlinkSync(tempFile);

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
      body: JSON.stringify({ error: 'Failed to transcribe audio' }),
    };
  }
};