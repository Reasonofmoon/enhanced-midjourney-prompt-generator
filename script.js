// netlify/functions/generatePrompts.js
const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { prompt, llmProvider, parameters, userApiKey } = JSON.parse(event.body);
  
  // Use user's API key if provided, otherwise fallback to environment variable
  const apiKey = userApiKey || process.env[`${llmProvider.toUpperCase()}_API_KEY`];

  if (!apiKey) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'API key is missing. Please provide a valid API key.' })
    };
  }

  let apiUrl = '';
  let headers = {
    'Content-Type': 'application/json',
  };
  let body = {};

  // Include the parameters in the prompt
  const enhancedPrompt = `${prompt} ${parameters}`;

  switch (llmProvider) {
    case 'openai':
      apiUrl = 'https://api.openai.com/v1/completions';
      headers['Authorization'] = `Bearer ${apiKey}`;
      body = {
        model: 'text-davinci-003',
        prompt: enhancedPrompt,
        max_tokens: 300,
        temperature: 0.7,
      };
      break;
    case 'anthropic':
      apiUrl = 'https://api.anthropic.com/v1/complete';
      headers['X-API-Key'] = apiKey;
      body = {
        prompt: enhancedPrompt,
        max_tokens_to_sample: 300,
        model: 'claude-v1',
        temperature: 0.7,
      };
      break;
    case 'gemini':
      apiUrl = 'https://generativelanguage.googleapis.com/v1beta2/models/gemini-pro:generateText';
      headers['Authorization'] = `Bearer ${apiKey}`;
      body = {
        prompt: {
          text: enhancedPrompt
        },
        temperature: 0.7,
        candidateCount: 5,
        maxOutputTokens: 300
      };
      break;
    default:
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Unsupported LLM provider' })
      };
  }

  try {
    // Log request details
    console.log('API Request:', { apiUrl, headers, body });

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API Response:', data);

    let generatedPrompts = '';

    // Extract the appropriate prompt format for each LLM
    if (llmProvider === 'openai') {
      generatedPrompts = data.choices.map(choice => choice.text.trim()).join('\n');
    } else if (llmProvider === 'anthropic') {
      generatedPrompts = data.completion.trim();
    } else if (llmProvider === 'gemini') {
      generatedPrompts = data.candidates.map(candidate => candidate.output.trim()).join('\n');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ prompts: generatedPrompts }),
    };
  } catch (error) {
    console.error('Error during API call:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
