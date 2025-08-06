// Pobieranie elementów HTML
var chat2Area = document.querySelector('.chat2_area');
var chat2TextArea = document.querySelector('.chat2_area');
var alert2 = document.querySelector('.alert2');
var send2 = document.querySelector('#send2');

// Ukrywanie spanów z alertami na początku
alert2.style.display = 'none';

// Dodawanie nasłuchiwacza na zmianę zawartości textarea chat2_area
chat2Area.addEventListener('input', function() {
    if (chat2Area.value !== '' && send2.clicked) {
        alert2.style.display = 'none';
        chat2TextArea.style.borderColor = 'rgb(0, 174, 255)'; // Resetowanie koloru ramki
    }
});

// Dodawanie nasłuchiwacza na kliknięcie przycisku send2
send2.addEventListener('click', function() {
    send2.clicked = true;
    if (chat2Area.value === '') {
        alert2.style.display = 'block';
        chat2TextArea.style.borderColor = 'red'; // Zmiana koloru ramki na czerwony
    } else {
        alert2.style.display = 'none';
        chat2TextArea.style.borderColor = 'rgb(0, 174, 255)'; // Resetowanie koloru ramki
    }
});

// Pobranie referencji do textarea i przycisków
var person2TextArea = document.getElementById('person2');
var send2Button = document.getElementById('send2');
var chatContainer = document.getElementById('chat-container');

// Obsługa zdarzenia kliknięcia przycisku "WYŚLIJ" dla osoby 2
send2Button.addEventListener('click', function() {
    var message = person2TextArea.value; // Pobranie tekstu z textarea
    if (message !== '') { // Sprawdzenie, czy wiadomość nie jest pusta
        var chatBubbleRight = document.createElement('div'); // Tworzenie nowego diva
        chatBubbleRight.className = 'chat-bubble chat-bubble-right'; // Dodanie klasy chat-bubble-right
        chatBubbleRight.textContent = message; // Ustawienie tekstu wiadomości jako zawartość diva
        chatContainer.appendChild(chatBubbleRight); // Dodanie diva do kontenera na wiadomości
        chatContainer.scrollTop = chatContainer.scrollHeight; // Przewijanie na dół
        person2TextArea.value = ''; // Wyczyszczenie textarea
    }
});

$(".emoji").on("click", function() {
    var textarea = $(this).siblings("textarea");
    var currentVal = textarea.val();
    var emoticon = $(this).html();
    textarea.val(currentVal + "" + emoticon);
});