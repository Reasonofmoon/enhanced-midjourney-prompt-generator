# Enhanced Midjourney Prompt Generator

This project provides an Enhanced Midjourney Prompt Generator that helps users create detailed, creative prompts using various language models like OpenAI, Anthropic, and Google's Gemini. This tool is designed for use both in local environments and GitHub Pages (note: API requests will not work on GitHub Pages for security reasons).

## Live Demo

You can try out the live demo of this project here: [Enhanced Midjourney Prompt Generator](https://reasonofmoon.github.io/enhanced-midjourney-prompt-generator/)

## Features

- Multiple LLM provider support (OpenAI, Anthropic, Gemini)
- Secure API key management
- Customizable Midjourney parameters
- Responsive design
- Easy-to-use interface

## Prerequisites
- **Node.js** (version 14 or higher)
- **npm** (Node Package Manager)

## Installation Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/enhanced-midjourney-prompt-generator.git
   cd enhanced-midjourney-prompt-generator
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Development Server**
   To run the project locally and develop further, start the Vite development server:
   ```bash
   npm run dev
   ```
   Once the server is running, open your browser and navigate to `http://localhost:5173/enhanced-midjourney-prompt-generator/` to access the application.

## API Key Setup
To generate prompts, you need to provide API keys for the supported language models. Follow these steps:

1. Enter your API key in the input field for the selected model (e.g., OpenAI, Anthropic, Gemini).
2. Click **"Save API Key"** to store the key in your local storage.

### Note on GitHub Pages
The current version of this project is designed to **work locally** for API requests. GitHub Pages does **not support API requests** involving API keys for security reasons. If you attempt to run the API on GitHub Pages, you will receive an alert stating that this functionality is not supported.

## How to Use

1. **Select Language Model**: Choose a language model from the drop-down (`OpenAI`, `Anthropic`, or `Gemini`).
2. **Enter Main Idea**: Input the core idea for your prompt generation.
3. **Set Parameters**: Customize aspect ratio, version, quality, stylize, and chaos settings.
4. **Generate Prompts**: Click on **"Generate Prompts"** to fetch creative outputs.
5. **Copy Prompts**: Use **"Copy Prompts"** to copy generated prompts to your clipboard.
6. **Clear All**: Click **"Clear All"** to reset all fields.

## Deployment

### Deploying to GitHub Pages

This project is deployed using GitHub Pages. To deploy updates:

1. Make your changes and commit them to the main branch
2. Run `npm run deploy` to build and push to the gh-pages branch
3. GitHub Actions will automatically deploy the updated site

### Deploying to Netlify
Netlify supports server-side functions, which can be used to store API keys securely.

1. **Connect Repository to Netlify**
   - Go to [Netlify](https://www.netlify.com/), create an account, and connect your GitHub repository.

2. **Environment Variables Setup**
   - In Netlify's **"Site settings"** -> **"Build & deploy"** -> **"Environment"**, add your API keys as environment variables (e.g., `OPENAI_API_KEY`).

3. **Move API Request Code to Serverless Functions**
   - Create a `netlify/functions` folder and move the API request logic into serverless functions to handle API keys securely.

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Vite
- Tippy.js for tooltips

## Contributing
Contributions are welcome! Feel free to fork this repository and create a pull request for new features or bug fixes.

## License
This project is licensed under the MIT License.