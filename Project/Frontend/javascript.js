document.addEventListener('DOMContentLoaded', function() {
    var chatContainer = document.getElementById('chat-container');
    var userInput = document.getElementById('user-input');
    var sendButton = document.getElementById('send-button');
    var fileInput = document.getElementById('file-input');

    // Funkcja wysyłania wiadomości
    function sendMessage() {
        var message = userInput.value.trim();
        if (message) {
            var userBubble = document.createElement('div');
            userBubble.className = 'chat-bubble chat-bubble-right';
            // userBubble.textContent = message;
            userBubble.innerHTML = message.replace(/\n/g, '<br>');
            chatContainer.appendChild(userBubble);
            chatContainer.scrollTop = chatContainer.scrollHeight;
            userInput.value = '';
        }
    }

    // Obsługa kliknięcia przycisku "Send"
    sendButton.addEventListener('click', function() {
        sendMessage();
    });

    // Obsługa Enter/Shift+Enter w textarea
    userInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            if (event.shiftKey) {
                // Nowa linia
                return;
            } else {
                // Wyślij wiadomość
                sendMessage();
                event.preventDefault();
            }
        }
    });

    // Obsługa załączania plików
    fileInput.addEventListener('change', function(event) {
        var files = event.target.files;
        if (files.length > 0) {
            var fileName = files[0].name;
            var fileBubble = document.createElement('div');
            fileBubble.className = 'chat-bubble chat-bubble-right';
            fileBubble.textContent = 'Załączono plik: ' + fileName;
            chatContainer.appendChild(fileBubble);
            chatContainer.scrollTop = chatContainer.scrollHeight;
            fileInput.value = '';
        }
    });
});

async function sendBotMessageFromAPI(message) {
    try {
        const response = await fetch('http://localhost:8000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });
        const data = await response.json();
        sendBotMessage(data.reply);
    } catch (err) {
        sendBotMessage('Bot: Wystąpił błąd połączenia z serwerem.');
    }
}

function sendMessage() {
    var message = userInput.value.trim();
    if (message) {
        var userBubble = document.createElement('div');
        userBubble.className = 'chat-bubble chat-bubble-right';
        userBubble.innerHTML = message.replace(/\n/g, '<br>');
        chatContainer.appendChild(userBubble);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        userInput.value = '';

        // Odpowiedź z backendu
        sendBotMessageFromAPI(message);
    }
}