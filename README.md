<p align="center">
    <a href="https://github.com/Maxxxxior/MaxChatbot" rel="noopener">
        <img width=200px height=200px src="images\maxchatbot_logo.png" style="border-radius: 20%;" alt="MaxChatbot project logo">
    </a>
</p>

<h3 align="center">MaxChatbot</h3>

<div align="center">

  [![Frontend Version](https://img.shields.io/badge/frontend-v1.1.1-red)](https://github.com/Maxxxxior/MaxChatbot/releases/tag/v1.1.1)
  [![Backend Version](https://img.shields.io/badge/backend-v1.1.0-green)](https://huggingface.co/spaces/Maxxxxior/MaxChatbotBackend/tree/main)
  [![License](https://img.shields.io/badge/license-MIT-blue)](/LICENSE)

</div>

---

<p align="center"> Web Chatbot with document analysis and CMS.
    <br> 
</p>

## 📝 Table of Contents
- [About](#about)
- [Getting Started](#getting_started)
    - [Prerequisites](#prerequisites)
    - [Backend Setup](#backend_setup)
    - [Frontend Setup](#frontend_setup)
- [Running the tests](#tests)
- [Usage](#usage)
- [Deployment](#deployment)
- [Built Using](#built_using)
- [i18n / Translation](#i18n_translation)
- [Author](#author)

## 🧐 About <a name = "about"></a>
MaxChatbot project was made for internship purposes.

Its goal was to create a chatbot that can be integrated into a website and answer questions based on uploaded files (CSV, DOCX, PDF) and CMS content, using a vector database.

## 🏁 Getting Started <a name = "getting_started"></a>
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [deployment](#deployment) for notes on how to deploy the project on a live system.

### Prerequisites <a name = "prerequisites"></a>
You need the following installed on your machine:

- A modern web browser (Chrome, Firefox, Edge, etc.)
- [Live Server VSCode extension]("https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer") (optional, only if using VSCode and you want Live-Server preview)
- A running instance of the MaxChatbot backend (see [Backend Setup](#backend_setup))

### Backend Setup <a name = "backend_setup"></a>
The frontend requires a working MaxChatbot backend API. You can use either the hosted version on Hugging Face Spaces or run it locally.

#### Hosted backend:
```
https://maxxxxior-maxchatbotbackend.hf.space
```

#### Local backend:
1. Clone or download the backend repository.
2. Open a terminal in the backend folder (where `app.py` is located).
3. Create and activate a virtual environment:
```powershell
python -m venv venv
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
.\venv\Scripts\Activate
```

4. Install dependencies:
```powershell
pip install -r requirements.txt
```

5. Set your environment variables or edit app.py for testing purposes:
```python
HF_TOKEN = "hf_your_token_here"
QDRANT_API_KEY = "your_qdrant_api_key_here"
QDRANT_HOST = "https://your-qdrant-host-url"
```

6. Run the backend:
```powershell
uvicorn app:app --reload
```

7. The backend will now be accessible at:
```
http://127.0.0.1:8000
```

### Frontend Setup <a name = "frontend_setup"></a>
1. Open `script.js` and set the correct backend URL:
```javascript
const BACKEND = "http://127.0.0.1:8000"; // for local testing
// or
const BACKEND = "https://maxxxxior-maxchatbotbackend.hf.space"; // for hosted backend
```
> Make sure there is no trailing slash `/` at the end of the URL.

2. Open `index.html` in a browser.
    - For live reloading of CSS/JS, use [Live Server VS Code extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer).
    - To **customize translations**, edit `i18n.js`. You can modify existing strings or add new variables/languages.
3. Check the live demo frontend here: [MaxChatbot Live Demo](https://maxxxxior.github.io/MaxChatbot/index.html)
4. Hosted backend: [MaxChatbotBackend on Hugging Face](https://huggingface.co/spaces/Maxxxxior/MaxChatbotBackend)

## 🔧 Running the tests <a name = "tests"></a>
There are no automated tests for the frontend. Manual testing is recommended by:
- Starting a session
- Uploading sample files (TXT, PDF, CSV, DOCX, JSON)
- Asking the chatbot questions about uploaded files
- Deleting files and observing system bubbles and UI updates

## 🎈 Usage <a name="usage"></a>
1. Enter a session name and click **Start session**.
2. Upload files (up to 3, max 1 MiB each).
3. Chat with the bot to query file content.
4. Use the **Show files** panel to view or delete uploaded files.
5. Switch languages at any time to see translations of system messages.

## 🚀 Deployment <a name = "deployment"></a>
You can deploy the frontend simply by hosting `index.html` and the assets on any static web server. For example:
- [GitHub Pages](https://docs.github.com/en/pages)
> Ensure the backend is accessible from your frontend (hosted on Hugging Face Spaces or another server) and update `script.js` with the correct backend URL.

## ⛏️ Built Using <a name = "built_using"></a>
### Frontend
- [HTML](https://developer.mozilla.org/docs/Web/HTML) - Markup language for structure
- [CSS](https://developer.mozilla.org/docs/Web/CSS) - Styling
- [JavaScript](https://developer.mozilla.org/docs/Web/JavaScript) - Frontend logic

### Backend
- [FastAPI](https://fastapi.tiangolo.com/) - Backend API (separate repository)
- [Hugging Face Transformers](https://huggingface.co/google/gemma-2-2b-it) - NLP model for file analysis
- [Qdrant](https://qdrant.tech/) - Vector database for storing embeddings
- [SentenceTransformers](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2) - Embeddings

## 🌐 i18n / Translation <a name="i18n_translation"></a>
All system messages, buttons, copyright and placeholders are translated via `i18n.js`.  
- You can **change existing translations** by editing the `pl` or `en` objects in `i18n.js`.  
- To **add a new language**, create a new key (e.g., `es` for Spanish) and provide translations for all existing variables.  
- Make sure to also update `window.lang` in `script.js` or add a language switcher to use the new language.  
- Examples of system messages: `fileDeleted`, `startSessionFirst`, `selectFile`, `fileTooLarge`, `fileUploaded`, etc.

## ✍️ Author <a name = "author"></a>
- [@Maxxxxior](https://github.com/Maxxxxior) - Idea & Full Implementation