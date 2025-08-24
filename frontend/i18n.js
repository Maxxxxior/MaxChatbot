// I18N
const I18N = {
    pl: {
        changeTheme: 'Zmień motyw',
        chatBot: 'MaxChatbot - porozmawiaj o swoich plikach!',
        session: 'Wpisz nazwę sesji (nową lub istniejącą):',
        sessionInput: 'np. test123',
        startSessionBtn: 'Rozpocznij sesje',
        showFilesBtn: 'Pokaż pliki',
        chooseFile: 'Wybierz plik',
        loadFile: 'Wyślij plik',
        messageBox: 'Tutaj wpisz swoją wiadomość...',
        sendBtn: 'Wyślij',
        createdBy: 'Stworzone przez',
        deleteFileBtn: "Usuń",

        // System
        welcomeMsg: "Cześć! Podaj nazwę sesji i kliknij 'Rozpocznij sesję', aby zacząć.",
        enterSession: "Wpisz nazwę sesji.",
        startSessionFirst: "Najpierw rozpocznij sesję!",
        selectFile: "Wybierz plik.",
        fileTooLarge: "Plik jest zbyt duży (max 1 MiB).",
        fileDeleted: "Plik {filename} został usunięty z bazy.",
        fileUploaded: "Plik {filename} został wysłany.",
        fileExistsReplace: 'Plik o nazwie "{filename}" już istnieje. Zastąpić go?',
        fileNotFound: "Nie znaleziono pliku {filename}.",
        fileDeleteError: "Błąd podczas usuwania pliku.",
        fileLoadingError: "Błąd ładowania plików.",
        noFiles: "Brak plików w tej sesji.",
        introMsg: `Cześć! Jestem MaxChatbot. 😋🖐 Mogę Ci pomóc z Twoimi plikami.
- Możesz wysyłać pliki TXT, DOCX, PDF, CSV, JSON.
- Maksymalnie 3 pliki, max 1 MiB każdy.
- Odpowiadam tylko na temat zawartości Twoich plików.
- Autor: Maksymilian Podlecki | Maxxxxior

Wybierz plik i załaduj go do bazy, abyśmy mogli o nim porozmawiać! 😊`,
        sessionStartError: "Nie można rozpocząć sesji.",
        noResponse: "Brak odpowiedzi.",
        backendConnectionError: "Błąd połączenia z backendem.",
        maxFilesReached: "Masz już maksymalnie 3 pliki w tej sesji. Usuń jakiś, aby dodać nowy.",
        uploadError: "Błąd uploadu pliku."
    },
    en: {
        changeTheme: 'Change theme',
        chatBot: 'MaxChatbot - Chat about your files!',
        session: 'Enter session name (new or existing):',
        sessionInput: 'e.g. test123',
        startSessionBtn: 'Start session',
        showFilesBtn: 'Show files',
        chooseFile: 'Choose file',
        loadFile: 'Load file',
        messageBox: 'Write your message here...',
        sendBtn: 'Send',
        createdBy: 'Created by',
        deleteFileBtn: "Delete",

        // System
        welcomeMsg: "Hello! Please enter a session name and click 'Start session' to begin.",
        enterSession: "Enter a session name.",
        startSessionFirst: "Please start a session first!",
        selectFile: "Please select a file.",
        fileTooLarge: "File is too large (max 1 MiB).",
        fileDeleted: "File {filename} has been deleted from the database.",
        fileUploaded: "File {filename} has been uploaded.",
        fileExistsReplace: 'File "{filename}" already exists. Replace it?',
        fileNotFound: "File {filename} not found.",
        fileDeleteError: "Error deleting file.",
        fileLoadingError: "Error loading files.",
        noFiles: "No files in this session.",
        introMsg: `Hello! I am MaxChatbot. 😋🖐 I can help you with your uploaded files.
- You can upload TXT, DOCX, PDF, CSV, JSON files.
- Max 3 files, max 1 MiB each.
- I will answer only about the content of your files.
- Author: Maksymilian Podlecki | Maxxxxior

Please choose a file and load it to database so we can talk about it! 😊`,
        sessionStartError: "Could not start session.",
        noResponse: "No response.",
        backendConnectionError: "Backend connection error.",
        maxFilesReached: "You already have 3 files in this session. Delete one to add a new.",
        uploadError: "File upload error."
    }
}

// Initialization
const langBtn = document.getElementById('langBtn');

window.lang = localStorage.getItem('lang') || 'pl';

function setLang(newLang) {
    if (!I18N[newLang]) return;

    window.lang = newLang;
    localStorage.setItem('lang', newLang);

    if (langBtn) langBtn.textContent = newLang === 'pl' ? 'EN' : 'PL';

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translation = I18N[newLang][key];
        if (!translation) return;
        
        const attr = el.getAttribute('data-i18n-attr');
        if (attr) {
            el.setAttribute(attr, translation);
        } else {
            el.textContent = translation;
        }
    });

    if (typeof updateSystemBubbles === 'function') {
        updateSystemBubbles();
    }

    updateChatTitle();
}

function updateChatTitle() {
    const h1 = document.querySelector("h1");
    const sessionText = currentSession ? " - " + currentSession : "";
    h1.innerHTML = `${I18N[window.lang].chatBot}<span id="sessionDisplay">${sessionText}</span>`;
}

document.addEventListener('DOMContentLoaded', () => {
    setLang(window.lang);
});

// Language
if (langBtn) {
    langBtn.addEventListener('click', () => {
        const next = window.lang === 'pl' ? 'en' : 'pl';
        setLang(next);
    });
}