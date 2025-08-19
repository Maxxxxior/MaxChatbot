const chat = document.getElementById("chat");
const sessionEl = document.getElementById("session");
const fileEl = document.getElementById("file");
const msgEl = document.getElementById("message");
const sendBtn = document.getElementById("sendBtn");
const uploadBtn = document.getElementById("uploadBtn");
const startSessionBtn = document.getElementById("startSessionBtn");

// Change in future for "https://maxxxxior-maxchatbotbackend.hf.space"
const BACKEND = "http://127.0.0.1:8000";

let currentSession = null;

function addBubble(text, who) {
    const div = document.createElement("div");
    div.className = "bubble " + who;
    div.textContent = text;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

window.onload = () => {
    addBubble("Hello! Please enter a session name and click 'Start session' to begin.", "bot");
};

startSessionBtn.onclick = async () => {
    const session = sessionEl.value.trim();
    if (!session) return;

    chat.innerHTML = "";

    try {
        const res = await fetch(BACKEND + "/start_session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session_id: session })
        });
        const data = await res.json();

        // pokaż intro jeśli jest
        if (data.intro) addBubble(data.intro, "bot");

        // pokaż historię
        if (data.history && data.history.length > 0) {
            data.history.forEach(msg => {
                const who = msg.role === "user" ? "me" : "bot";
                addBubble(msg.text, who);
            });
        }

        currentSession = session;
        const h1 = document.querySelector("h1");
        h1.textContent = `MaxChatbot - Chat about your files! - ${currentSession}`;
    } catch (e) {
        addBubble("Could not start session.", "bot");
    }
};

sendBtn.onclick = async () => {
    if (!currentSession) {
        addBubble("Please start a session first!", "bot");
        return;
    }

    const msg = msgEl.value.trim();
    if (!msg) return;

    addBubble(msg, "me");
    msgEl.value = "";

    try {
        const res = await fetch(BACKEND + "/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: msg, session_id: currentSession })
        });
        const data = await res.json();
        addBubble(data.reply || "No response.", "bot");
    } catch (e) {
        addBubble("Backend connection error", "bot");
    }
};

uploadBtn.onclick = async () => {
    if (!currentSession) {
        addBubble("Please start a session first!", "bot");
        return;
    }

    const file = fileEl.files?.[0];
    if (!file) {
        addBubble("Please select a file.", "bot");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("session_id", currentSession);

    try {
        const res = await fetch(BACKEND + "/upload", { method: "POST", body: formData });
        const data = await res.json();
        addBubble(`File ${data.filename || file.name} has been uploaded.`, "bot");
    } catch (e) {
        addBubble("File upload error", "bot");
    }
};

msgEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendBtn.click();
});