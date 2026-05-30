// netlify/functions/chat-ai.js
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { messages } = JSON.parse(event.body);
    if (!messages || messages.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No messages provided' }),
      };
    }

    // Last user message nikaalein
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content;
    if (!lastUserMessage) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No user message found' }),
      };
    }

    // OpenRouter API call (free model)
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1:free', // ya apni pasand ka model
        messages: messages.map(m => ({
          role: m.role === 'agent' ? 'assistant' : m.role,
          content: m.content,
        })),
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'No reply from AI';

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // CORS for local testing (optional)
      },
      body: JSON.stringify({ reply }),
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};