document.addEventListener('DOMContentLoaded', () => {
    // Initialize variables
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
    const selectedLLM = llmSelect.value;
    const savedApiKey = localStorage.getItem(`${selectedLLM}ApiKey`);
    if (savedApiKey) {
        apiKeyInput.value = savedApiKey;
        console.log('로드된 API 키:', savedApiKey);
    }

    // Event listeners
    saveApiKeyButton.addEventListener('click', saveApiKey);
    toggleApiVisibilityButton.addEventListener('click', toggleApiVisibility);
    clearApiCacheButton.addEventListener('click', clearApiCache);
    generatePromptsButton.addEventListener('click', generatePrompts);
    copyPromptsButton.addEventListener('click', copyPrompts);
    clearAllButton.addEventListener('click', clearAll);

    llmSelect.addEventListener('change', () => {
        const selectedLLM = llmSelect.value;
        const savedApiKey = localStorage.getItem(`${selectedLLM}ApiKey`);
        apiKeyInput.value = savedApiKey || '';
    });

    // Function to save API key
    function saveApiKey() {
        const apiKey = apiKeyInput.value.trim();
        const selectedLLM = llmSelect.value;

        if (apiKey) {
            try {
                // Save API key to localStorage
                localStorage.setItem(`${selectedLLM}ApiKey`, apiKey);
                alert(`${selectedLLM} API 키가 성공적으로 저장되었습니다!`);
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
    }

    // Placeholder functions for generating prompts, copying prompts, and clearing inputs
    function generatePrompts() {
        alert('Prompts are being generated... (기능 구현 필요)');
    }

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
