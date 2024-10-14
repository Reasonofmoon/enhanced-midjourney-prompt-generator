// Import necessary modules
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

// Initialize variables
document.addEventListener('DOMContentLoaded', () => {
    const apiKeyInput = document.getElementById('apiKey');
    const saveApiKeyButton = document.getElementById('saveApiKey');
    const toggleApiVisibilityButton = document.getElementById('toggleApiVisibility');
    const clearApiCacheButton = document.getElementById('clearApiCache');
    const llmSelect = document.getElementById('llmSelect');
    const generatePromptsButton = document.getElementById('generatePrompts');
    const copyPromptsButton = document.getElementById('copyPrompts');
    const clearAllButton = document.getElementById('clearAll');
    const mainIdeaTextarea = document.getElementById('mainIdea');
    const generatedPromptsDiv = document.getElementById('generatedPrompts');
    const aspectRatioSelect = document.getElementById('aspectRatio');
    const versionSelect = document.getElementById('version');
    const qualitySelect = document.getElementById('quality');
    const stylizeInput = document.getElementById('stylize');
    const chaosInput = document.getElementById('chaos');

    // Load saved API key when the page loads
    loadApiKey();

    // Event listeners
    saveApiKeyButton.addEventListener('click', saveApiKey);
    toggleApiVisibilityButton.addEventListener('click', toggleApiVisibility);
    clearApiCacheButton.addEventListener('click', clearApiCache);
    generatePromptsButton.addEventListener('click', generatePrompts);
    copyPromptsButton.addEventListener('click', copyPrompts);
    clearAllButton.addEventListener('click', clearAll);

    llmSelect.addEventListener('change', loadApiKey);

    // Function to load saved API key
    function loadApiKey() {
        const selectedLLM = llmSelect.value;
        const savedApiKey = localStorage.getItem(`${selectedLLM}ApiKey`);
        apiKeyInput.value = savedApiKey || '';
        console.log(`로드된 ${selectedLLM} API 키:`, savedApiKey);
    }

    // Function to save API key
    function saveApiKey() {
        const apiKey = apiKeyInput.value.trim();
        const selectedLLM = llmSelect.value;

        if (apiKey) {
            try {
                // Save API key to localStorage
                localStorage.setItem(`${selectedLLM}ApiKey`, apiKey);
                alert(`${selectedLLM} API 키가 성공적으로 저장되었습니다!`);
                console.log(`${selectedLLM} API 키 저장:`, apiKey);
            } catch (error) {
                console.error('API 키 저장 중 오류 발생:', error);
                alert('API 키 저장 중 문제가 발생했습니다. 브라우저 설정을 확인하세요.');
            }
        } else {
            alert('유효한 API 키를 입력해 주세요.');
        }
    }

    // Function to toggle API key visibility
    function toggleApiVisibility() {
        if (apiKeyInput.type === 'password') {
            apiKeyInput.type = 'text';
        } else {
            apiKeyInput.type = 'password';
        }
    }

    // Function to clear API key from localStorage
    function clearApiCache() {
        const selectedLLM = llmSelect.value;
        localStorage.removeItem(`${selectedLLM}ApiKey`);
        apiKeyInput.value = '';
        alert(`${selectedLLM} API 키 캐시가 성공적으로 삭제되었습니다!`);
        console.log(`${selectedLLM} API 키 캐시 삭제됨`);
    }

    // Function to generate prompts
    async function generatePrompts() {
        const mainIdea = mainIdeaTextarea.value.trim();
        const selectedLLM = llmSelect.value;
        const apiKey = localStorage.getItem(`${selectedLLM}ApiKey`);

        if (!mainIdea) {
            alert('프롬프트 생성에 사용할 아이디어를 입력해 주세요.');
            return;
        }

        if (!apiKey) {
            alert('API 키를 입력하고 저장해 주세요.');
            return;
        }

        // 기본 메시지 설정 및 파라미터 추가
        const parameters = `--ar ${aspectRatioSelect.value} --v ${versionSelect.value} --q ${qualitySelect.value} --stylize ${stylizeInput.value} --chaos ${chaosInput.value}`;
        const prompt = `Generate 5 creative prompts for the following idea: "${mainIdea}". Provide detailed imagery and vivid descriptions. ${parameters}`;

        try {
            let apiUrl = '';
            let headers = {
                'Content-Type': 'application/json',
            };
            let body = {};

            switch (selectedLLM) {
                case 'openai':
                    apiUrl = 'https://api.openai.com/v1/chat/completions'; // 최신 엔드포인트로 변경
                    headers['Authorization'] = `Bearer ${apiKey}`;
                    body = {
                        model: 'gpt-3.5-turbo', // 최신 지원 모델 사용
                        messages: [{ role: 'user', content: prompt }],
                        max_tokens: 300,
                        temperature: 0.7,
                    };
                    break;
                case 'anthropic':
                    apiUrl = 'https://api.anthropic.com/v1/complete';
                    headers['X-API-Key'] = apiKey;
                    body = {
                        prompt: prompt,
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
                            text: prompt
                        },
                        temperature: 0.7,
                        candidateCount: 5,
                        maxOutputTokens: 300
                    };
                    break;
                default:
                    alert('지원하지 않는 LLM입니다.');
                    return;
            }

            console.log('API 요청 URL:', apiUrl);
            console.log('API 요청 본문:', body);

            // API 요청 보내기 및 여러 모델에 대해 향상된 프롬프트 생성
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error(`API 요청에 실패했습니다: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('API 응답 데이터:', data);

            let generatedText = '';

            if (selectedLLM === 'openai') {
                generatedText = data.choices.map(choice => choice.message.content).join('\n');
            } else if (selectedLLM === 'anthropic') {
                generatedText = data.completion;
            } else if (selectedLLM === 'gemini') {
                generatedText = data.candidates.map(candidate => candidate.output).join('\n');
            }

            // 결과 출력
            generatedPromptsDiv.innerHTML = `<p>${generatedText.replace(/\n/g, '<br>')}</p>`;
        } catch (error) {
            console.error('프롬프트 생성 중 오류 발생:', error);
            alert('프롬프트 생성 중 오류가 발생했습니다. 다시 시도해 주세요.');
        }
    }

    // Function to copy prompts
    function copyPrompts() {
        const promptText = generatedPromptsDiv.innerText;
        if (promptText) {
            navigator.clipboard.writeText(promptText).then(() => {
                alert('Prompts copied to clipboard!');
            }).catch(err => {
                console.error('Prompts copy failed:', err);
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

    // Initialize tooltips
    tippy('[data-tippy-content]', {
        theme: 'custom',
        placement: 'top',
    });
});
