// Initialization
const burgerBtn = document.getElementById("burgerBtn");
const actions = document.querySelector(".actionsWrapper .actions");
const chat = document.getElementById("chat");
const scrollDownButton = document.getElementById("scrollDown");
const sessionEl = document.getElementById("session");
const fileEl = document.getElementById("file");
const msgEl = document.getElementById("message");
const sendBtn = document.getElementById("sendBtn");
const uploadBtn = document.getElementById("uploadBtn");
const fileUploadBtn = document.getElementById("custom-file-upload");
const startSessionBtn = document.getElementById("startSessionBtn");
const showFilesBtn = document.getElementById("showFilesBtn");
const sessionDisplay = document.getElementById("sessionDisplay");
const files = document.querySelector(".files");
const yearSpan = document.getElementById('year');
yearSpan.textContent = new Date().getFullYear();

const BACKEND = "https://maxxxxior-maxchatbotbackend.hf.space";

let currentSession = null;

// Config these 2
MAX_FILES = 3
MAX_FILE_SIZE_IN_MB = 1

// Max file size in MiB
MAX_FILE_SIZE = MAX_FILE_SIZE_IN_MB * 1024 * 1024

function addBubble(text, who) {
    const div = document.createElement("div");
    div.className = "bubble " + who;
    div.textContent = text;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

function formatText(text, vars = {}) {
    return text.replace(/\{(\w+)\}/g, (_, key) => {
        if (vars[key] === undefined) {
            console.warn(`Brak wartości dla placeholdera {${key}}, vars:`, vars);
            return "";
        }
        return vars[key];
    });
}

// System Bubbles 1/2
function addSystemBubble(key, vars = {}) {
    const template = I18N[window.lang][key] || key;
    const text = formatText(template, vars);

    const div = document.createElement("div");
    div.className = "bubble system";
    div.dataset.key = key;
    div.dataset.vars = JSON.stringify(vars);
    div.textContent = text;

    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

window.onload = () => {

};

function updateScrollButton() {
    const atBottom = chat.scrollHeight - chat.scrollTop <= chat.clientHeight + 1;
    scrollDownButton.style.display = atBottom ? "none" : "block";
}

updateScrollButton();

chat.addEventListener("scroll", updateScrollButton);

function scrollDown() {
    chat.scrollTop = chat.scrollHeight;
    updateScrollButton();
}

startSessionBtn.onclick = async () => {
    const session = sessionEl.value.trim();
    if (!session) {
        sessionEl.classList.add("border-blink");
        setTimeout(() => sessionEl.classList.remove("border-blink"), 2000);
        addSystemBubble("enterSession");
        return;
    }

    chat.innerHTML = "";

    try {
        const res = await fetch(BACKEND + "/start_session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session_id: session })
        });
        const data = await res.json();

        addSystemBubble("introMsg");

        if (data.history && data.history.length > 0) {
            data.history.forEach(msg => {
                const who = msg.role === "user" ? "me" : "bot";
                addBubble(msg.text, who);
            });
        }

        currentSession = session;
        updateChatTitle();
        showFilesBtn.style.display = "block";
        loadFiles();
    } catch (e) {
        addSystemBubble("sessionStartError");
    }
};

sendBtn.onclick = async () => {
    if (!currentSession) {
        startSessionBtn.classList.add("border-blink");
        setTimeout(() => startSessionBtn.classList.remove("border-blink"), 2000);
        addSystemBubble("startSessionFirst");
        return;
    }

    const msg = msgEl.value.trim();

    if (!msg) {
        msgEl.classList.add("border-blink");
        setTimeout(() => msgEl.classList.remove("border-blink"), 2000);
        return
    }

    addBubble(msg, "me");
    msgEl.value = "";

    try {
        const res = await fetch(BACKEND + "/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: msg, session_id: currentSession })
        });
        const data = await res.json();
        addBubble(data.reply) || addSystemBubble("noResponse");
    } catch (e) {
        addSystemBubble("backendConnectionError");
    }
};

uploadBtn.onclick = async () => {
    if (!currentSession) {
        startSessionBtn.classList.add("border-blink");
        setTimeout(() => startSessionBtn.classList.remove("border-blink"), 2000);
        addSystemBubble("startSessionFirst");
        return;
    }

    const file = fileEl.files?.[0];
    if (!file) {
        fileUploadBtn.classList.add("background-blink");
        setTimeout(() => fileUploadBtn.classList.remove("background-blink"), 2000);
        addSystemBubble("selectFile");
        return;
    }

    if (file.size > MAX_FILE_SIZE) {
        addSystemBubble("fileTooLarge");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("session_id", currentSession);

    try {
        const res = await fetch(BACKEND + "/upload", { method: "POST", body: formData });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));

            if (err.detail === "LIMIT_EXCEEDED") {
                addSystemBubble("maxFilesReached");
                files.classList.add("active");
                await loadFiles();
                files.scrollIntoView({ behavior: "smooth", block: "nearest" });
                return;
            }

            if (err.detail === "FILE_TOO_LARGE") {
                addSystemBubble("fileTooLarge");
                return;
            }

            if (err.detail === "FILE_EXISTS") {
                const replace = confirm(formatText(I18N[window.lang]["fileExistsReplace"], { filename: file.name }));
                if (replace) {
                    formData.append("replace", "true");
                    const res2 = await fetch(BACKEND + "/upload", { method: "POST", body: formData });
                    const data = await res2.json();
                    const filenameToShow = data.filename || file.name;
                    addSystemBubble("fileUploaded", {filename: filenameToShow});
                    if (files.classList.contains("active")) await loadFiles();
                }
                return;
            }

            addSystemBubble("uploadError");
            return;
        }

        const data = await res.json();
        const filenameToShow = data.filename || file.name;
        addSystemBubble("fileUploaded", {filename: filenameToShow});
        if (files.classList.contains("active")) await loadFiles();

    } catch (e) {
        addSystemBubble("uploadError");
    }
};

msgEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendBtn.click();
});

$('#file').bind('change', function() {
    let fileName = $(this).val().split('\\').pop();
    $('#file-selected').html(fileName);
});

showFilesBtn.addEventListener("click", () => {
    files.classList.toggle("active");
    if (files.classList.contains("active")) {
        loadFiles();
    }
});

async function deleteFile(filename) {
    if (!currentSession) return;
    try {
        const res = await fetch(`${BACKEND}/files?session_id=${currentSession}&filename=${encodeURIComponent(filename)}`, {
            method: "DELETE"
        });
        const data = await res.json();
        if (data.deleted > 0) {
            loadFiles();
        }
    } catch (e) {
        console.error("Error deleting file:", e);
    }
}

async function uploadFile(sessionId, file) {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const res = await fetch(`/upload?session_id=${sessionId}`, {
            method: "POST",
            body: formData
        });

    if (!res.ok) {
        const err = await res.json();
        if (err.detail === "LIMIT_EXCEEDED") {
            document.querySelector(".files").scrollIntoView({ behavior: "smooth" });
            alert("Masz już 3 pliki! Usuń jakiś, żeby dodać nowy.");
        } else if (err.detail === "FILE_TOO_LARGE") {
            alert("Plik jest za duży (max 1 MiB).");
        }
        return;
    }

    const data = await res.json();

    const filesDiv = document.querySelector(".files");
    const fileItem = document.createElement("div");
    fileItem.className = "file-item flex justify-between items-center p-2 border-b";
    fileItem.innerHTML = `
        <span>${data.filename} <small class="text-gray-500">(${data.timestamp})</small></span>
        <button onclick="deleteFile('${sessionId}', '${data.filename}')" 
                class="text-red-500 hover:text-red-700" data-i18n="deleteFileBtn"></button>
    `;
    row.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translation = I18N[window.lang][key];
        if (translation) el.textContent = translation;
    });
    filesDiv.appendChild(fileItem);

    } catch (err) {
        console.error("Upload failed:", err);
    }
}

function formatTs(ts) {
    if (!ts) return "";
    const d = new Date(ts);
    if (isNaN(d)) return ts;

    return d.toLocaleString(undefined, {
        year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit"
    });
}

async function loadFiles() {
    if (!currentSession) return;

    try {
        const res = await fetch(`${BACKEND}/files?session_id=${encodeURIComponent(currentSession)}`);
        const data = await res.json();

        files.innerHTML = "";

        const list = data.files || [];
        if (list.length === 0) {
            files.innerHTML = '<p data-i18n="noFiles"></p>';
            return;
        }

        list.forEach(item => {
            const row = document.createElement("div");
            row.className = "file-entry";
            row.style.display = "flex";
            row.style.justifyContent = "space-between";
            row.style.alignItems = "center";
            row.style.gap = "8px";
            row.style.padding = "6px 0";

            row.innerHTML = `
                <div class="file-info">
                    <span class="filename" title="${item.filename}">
                        📄 ${item.filename}
                    </span>
                    <small class="file-meta">
                        ${formatTs(item.last_upload)}
                    </small>
                </div>
                <button class="delete-file-btn" data-filename="${item.filename}" data-i18n="deleteFileBtn"></button>
            `;

            row.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                const translation = I18N[window.lang][key];
                if (translation) el.textContent = translation;
            });
            files.appendChild(row);
        });

        files.querySelectorAll(".delete-file-btn").forEach(btn => {
            btn.addEventListener("click", async () => {
                const filename = btn.getAttribute("data-filename");
                btn.disabled = true;
                btn.textContent = "Usuwanie…";
                try {
                    const res = await fetch(`${BACKEND}/files?session_id=${encodeURIComponent(currentSession)}&filename=${encodeURIComponent(filename)}`, {
                        method: "DELETE"
                    });
                    const out = await res.json();
                    if (out.deleted > 0) {
                        btn.closest(".file-entry").remove();
                        addSystemBubble("fileDeleted", {filename});
                        if (!files.querySelector(".file-entry")) {
                            files.innerHTML = '<p data-i18n="noFiles"></p>';
                        }
                    } else {
                        btn.disabled = false;
                        btn.textContent = "Usuń";
                        addSystemBubble("fileNotFound");
                    }
                } catch (err) {
                    btn.disabled = false;
                    btn.textContent = "Usuń";
                    addSystemBubble("fileDeleteError");
                    console.error(err);
                }
            });
        });
    } catch (e) {
        console.error("Error loading files:", e);
        files.innerHTML = '<p data-i18n="fileLoadingError"></p>';
    }
}

// System Bubbles 2/2
function updateSystemBubbles() {
    document.querySelectorAll(".bubble.system").forEach(bubble => {
        const key = bubble.dataset.key;
        const varsJson = bubble.dataset.vars;
        let vars = {};
        if (varsJson) {
            try {
                vars = JSON.parse(varsJson);
            } catch {}
        }
        const template = I18N[window.lang][key] || key;
        bubble.textContent = formatText(template, vars);
    });
}

window.addEventListener("DOMContentLoaded", () => {
    addSystemBubble("welcomeMsg");
});

burgerBtn.addEventListener('click', (e) => {
    actions.classList.toggle('active');
    burgerBtn.textContent = actions.classList.contains('active') ? "✕" : "☰";
});

document.addEventListener('click', (e) => {
    if (!actions.contains(e.target) && !burgerBtn.contains(e.target)) {
        if (actions.classList.contains('active')) {
            actions.classList.remove('active');
            burgerBtn.textContent = "☰";
        }
    }
});