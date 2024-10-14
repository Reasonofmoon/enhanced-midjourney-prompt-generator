// Import necessary modules
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

// Initialize variables
const apiKeyInput = document.getElementById('apiKey');
const saveApiKeyButton = document.getElementById('saveApiKey');
const toggleApiVisibilityButton = document.getElementById('toggleApiVisibility');
const generatePromptsButton = document.getElementById('generatePrompts');
const copyPromptsButton = document.getElementById('copyPrompts');
const clearAllButton = document.getElementById('clearAll');
const clearApiCacheButton = document.getElementById('clearApiCache');
const mainIdeaTextarea = document.getElementById('mainIdea');
const generatedPromptsDiv = document.getElementById('generatedPrompts');
const profileEmojiSpan = document.getElementById('profileEmoji');
const llmSelect = document.getElementById('llmSelect');

// Parameter elements
const aspectRatioSelect = document.getElementById('aspectRatio');
const versionSelect = document.getElementById('version');
const qualitySelect = document.getElementById('quality');
const stylizeInput = document.getElementById('stylize');
const chaosInput = document.getElementById('chaos');

// Function to save API key
function saveApiKey() {
    const apiKey = apiKeyInput.value.trim();
    const selectedLLM = llmSelect.value;
    if (apiKey) {
        localStorage.setItem(`${selectedLLM}ApiKey`, apiKey);
        alert(`${selectedLLM} API key saved successfully!`);
    } else {
        alert('Please enter a valid API key.');
    }
}

// Function to toggle API key visibility
function toggleApiVisibility() {
    apiKeyInput.type = apiKeyInput.type === 'password' ? 'text' : 'password';
}

// Function to clear API cache
function clearApiCache() {
    const selectedLLM = llmSelect.value;
    localStorage.removeItem(`${selectedLLM}ApiKey`);
    apiKeyInput.value = '';
    alert(`${selectedLLM} API cache cleared successfully!`);
}

// Function to generate prompts
async function generatePrompts() {
    const mainIdea = mainIdeaTextarea.value.trim();
    if (!mainIdea) {
        alert('Please enter a main idea.');
        return;
    }

    const selectedLLM = llmSelect.value;
    const apiKey = localStorage.getItem(`${selectedLLM}ApiKey`);
    if (!apiKey) {
        alert(`Please save your ${selectedLLM} API key first.`);
        return;
    }

    const parameters = getParameters();
    const prompt = `Generate 5 creative Midjourney prompts based on the following idea: ${mainIdea}. Each prompt should be a single sentence, focusing on visual elements and mood. Include these parameters at the end of each prompt: ${parameters}`;

    try {
        let response;
        switch (selectedLLM) {
            case 'openai':
                response = await fetchOpenAIResponse(apiKey, prompt);
                break;
            case 'anthropic':
                response = await fetchAnthropicResponse(apiKey, prompt);
                break;
            case 'gemini':
                response = await fetchGeminiResponse(apiKey, prompt);
                break;
            default:
                throw new Error('Unsupported LLM selected');
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`API Error: ${data.error?.message || JSON.stringify(data)}`);
        }

        const generatedPrompts = extractPromptsFromResponse(data, selectedLLM);
        displayPrompts(generatedPrompts);
    } catch (error) {
        console.error('Error generating prompts:', error);
        alert(`An error occurred while generating prompts: ${error.message}`);
        generatedPromptsDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    }
}

// Function to fetch response from OpenAI
async function fetchOpenAIResponse(apiKey, prompt) {
    return fetch('/api/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "gpt-4-0125-preview",  // Updated to GPT-4 (mini)
            messages: [{ role: "user", content: prompt }],
            max_tokens: 200,
            n: 1,
            temperature: 0.8,
        })
    });
}

// Function to fetch response from Anthropic
async function fetchAnthropicResponse(apiKey, prompt) {
    return fetch('/api/anthropic/v1/complete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey
        },
        body: JSON.stringify({
            prompt: prompt,
            max_tokens_to_sample: 200,
            model: "claude-2.0",
        })
    });
}

// Function to fetch response from Gemini
async function fetchGeminiResponse(apiKey, prompt) {
    return fetch('/api/gemini/v1beta/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.8,
                maxOutputTokens: 200,
            },
        })
    });
}

// Function to extract prompts from response based on LLM
function extractPromptsFromResponse(data, llm) {
    switch (llm) {
        case 'openai':
            return data.choices[0].message.content.split('\n').filter(prompt => prompt.trim() !== '');
        case 'anthropic':
            return data.completion.split('\n').filter(prompt => prompt.trim() !== '');
        case 'gemini':
            return data.candidates[0].content.parts[0].text.split('\n').filter(prompt => prompt.trim() !== '');
        default:
            throw new Error('Unsupported LLM selected');
    }
}

// Function to get parameters
function getParameters() {
    return `--ar ${aspectRatioSelect.value} --v ${versionSelect.value} --q ${qualitySelect.value} --s ${stylizeInput.value} --chaos ${chaosInput.value}`;
}

// Function to display prompts
function displayPrompts(prompts) {
    generatedPromptsDiv.innerHTML = prompts.map(prompt => `<p>${prompt}</p>`).join('');
}

// Function to copy prompts
function copyPrompts() {
    const promptText = generatedPromptsDiv.innerText;
    if (promptText) {
        navigator.clipboard.writeText(promptText).then(() => {
            alert('Prompts copied to clipboard!');
        }).catch(err => {
            console.error('Error copying prompts:', err);
            alert('Failed to copy prompts. Please try again.');
        });
    } else {
        alert('No prompts to copy.');
    }
}

// Function to clear all inputs and outputs
function clearAll() {
    mainIdeaTextarea.value = '';
    generatedPromptsDiv.innerHTML = '';
    aspectRatioSelect.value = '1:1';
    versionSelect.value = '6.1';
    qualitySelect.value = '1';
    stylizeInput.value = '100';
    chaosInput.value = '0';
    llmSelect.value = 'openai';
    apiKeyInput.value = '';
}

// Function to set random profile emoji
function setRandomProfileEmoji() {
    const emojis = ['😊', '🚀', '🎨', '🌈', '🦄', '🔮', '🌟', '🤖'];
    profileEmojiSpan.textContent = emojis[Math.floor(Math.random() * emojis.length)];
}

// Event listeners
saveApiKeyButton.addEventListener('click', saveApiKey);
toggleApiVisibilityButton.addEventListener('click', toggleApiVisibility);
generatePromptsButton.addEventListener('click', generatePrompts);
copyPromptsButton.addEventListener('click', copyPrompts);
clearAllButton.addEventListener('click', clearAll);
clearApiCacheButton.addEventListener('click', clearApiCache);
llmSelect.addEventListener('change', () => {
    const selectedLLM = llmSelect.value;
    const savedApiKey = localStorage.getItem(`${selectedLLM}ApiKey`);
    apiKeyInput.value = savedApiKey || '';
});

// Initialize tooltips
tippy('[data-tippy-content]', {
    theme: 'custom',
    placement: 'top',
});

// Load saved API key and set random profile emoji on page load
document.addEventListener('DOMContentLoaded', () => {
    const selectedLLM = llmSelect.value;
    const savedApiKey = localStorage.getItem(`${selectedLLM}ApiKey`);
    if (savedApiKey) {
        apiKeyInput.value = savedApiKey;
    }
    setRandomProfileEmoji();
});

console.log('Script loaded successfully');