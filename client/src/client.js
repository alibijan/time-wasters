const log = (text) => {
    const parent = document.querySelector('#events');
    const el = document.createElement('li');
    el.innerHTML = text;
    // console.log(text);

    parent.appendChild(el);
    parent.scrollTop = parent.scrollHeight;
};

const onChatSubmitted = (sock) => (e) => {
    e.preventDefault();

    const input = document.querySelector('#chat');
    const text = input.value;
    input.value = '';
    
    // log(text);
    
    // socketio
    sock.emit('message', text);
    // console.log(text);
};

(() => {
    log('<p style="text-align:center; margin:0;">Welcome,<br>You are now connected.</p>');

    const sock = io();

    sock.on('message', log);
    // sock.on('message', log(text));

    // socketio.emit('sentMessage', 'hello nnnnn');


    document.querySelector('#chat-form');
    document.addEventListener('submit', onChatSubmitted(sock));
})();