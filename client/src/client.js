// global var
let name = [];

// functions
const username = (setting) => {
    // goal:
    // - take info from box
    // - - if empty
    // - - - do not close popup, tell them to set valid name.
    // - - if valid
    // - - - update name variable,
    // - - - close popup,
    // maybe ???
    // - rerun welcome
    // alert that name was changed in chat

    // const popupWrapper = 
    const nameInput = document.getElementById('name');
    // console.log('username ran');
    let success = false;
    // name = 'renly';
    
    const setName = ()  => {
        console.log(`input value: ${nameInput.value}`);
        console.log(`name: ${name}`);
        if( nameInput.value === '' ) {
            // if name is blank
            // TODO: create error
            console.log('ERROR: name is blank!!');
            success = false;
        } else if( nameInput.value === name ) {
            console.log('ERROR: name is the same!!');
            success = false;
        } else {
            name.push(nameInput.value);
            success = true;
        }
    };

    if( setting === 'set' || setting === 'setName' ) {
        setName();
    }

    if( success === true ) {
        // console.log(name);
        popup('', 'close');
        log(`You have changed your name to: ${name[name.length - 1]}`);
        welcome(name);
        return name;
    }
};

const log = (text) => {
    const parent = document.querySelector('#events');
    const el = document.createElement('li');
    el.innerHTML = text;

    parent.appendChild(el);
    parent.scrollTop = parent.scrollHeight;
};

const onChatSubmitted = (sock) => (e) => {
    e.preventDefault();

    const input = document.querySelector('#chat');
    const text = input.value;
    input.value = '';
    
    // socketio
    sock.emit('message', text);
};

const popup = (name, functionality) => {
    // create popup function
    const createPopup = () => {
        const body = document.body;

        // popup wrapper
        const popupWrapper = document.createElement('div');
        popupWrapper.setAttribute('class', 'popup-wrapper');

        // popup container
        const popupContainer = document.createElement('div');
        popupContainer.setAttribute('class', 'popup-container');

        // popup close
        const popupClose = document.createElement('div');
        popupClose.setAttribute('class', 'popup-close');
        popupClose.innerHTML = '<i id="popup--close" class="fas fa-times"></i>';

        // popup 
        const popup = document.createElement('div');
        popup.setAttribute('class', 'popup');

        // popup input
        const input = document.createElement('div'),
            inputWrapper = document.createElement('div'),
            inputForm = document.createElement('form'),
            inputLabel = document.createElement('p'),
            inputName = document.createElement('input');

        input.setAttribute('class', 'popup-input');
        inputWrapper.setAttribute('class', 'input-wrapper');
        inputForm.setAttribute('id', 'input-form');
        inputLabel.setAttribute('class', 'input-label');
        inputLabel.innerHTML = 'Choose a username:';
        inputName.setAttribute('id', 'name');
        inputName.setAttribute('autocomplete', 'off');

        // popout action
        const action = document.createElement('div'),
            actionWrapper = document.createElement('div'),
            agree = document.createElement('button'),
            cancel = document.createElement('button');

        action.setAttribute('class', 'popup-action');
        actionWrapper.setAttribute('class', 'action-wrapper');
        agree.setAttribute('id', 'name--accept');
        agree.innerHTML = 'OK';
        cancel.setAttribute('id', 'name--cancel');
        cancel.innerHTML = 'Cancel';

        // append elements
        body.appendChild(popupWrapper);
        popupWrapper.appendChild(popupContainer);
        popupContainer.appendChild(popup);
        popupContainer.appendChild(popupClose);

        popup.appendChild(input);
        input.appendChild(inputWrapper);
        inputWrapper.appendChild(inputForm);
        inputForm.appendChild(inputLabel);
        inputForm.appendChild(inputName);

        popup.appendChild(action);

        action.appendChild(actionWrapper);
        actionWrapper.appendChild(cancel);
        actionWrapper.appendChild(agree);
    };

    // close popup
    const closePopup = () => {
        const body = document.body;
        const popup = document.querySelector('.popup-wrapper');

        body.removeChild(popup);
    };

    if( functionality === 'create' || functionality === 'add' || functionality === 'open' ) {
        createPopup();
    } else if( functionality === 'close' || functionality === 'remove' ) {
        closePopup();
    }
};

const welcome = (name) => {
    // Welcome message variations

    // // TODO: Make classes into array and easier to expand upon and use in the future.
    // classes = ['welcome-message','welcome-message--disabled'];
    const nameButton = document.getElementById('name--button');
    let classes = 'welcome-message welcome-message--disabled';
    // let username = username();

    // console.log(username());

    console.log(name);
    if( !name ) {
        // User has not set name
        // TODO: Make it obvious which button to press when it tells you to set your name here
        
        // changing name button to say Change
        nameButton.innerHTML = 'SET NAME';
        
        // set log welcome message
        log(`<p class="${classes}">Welcome,<br>Set your username.</p>`);

        // TODO: On first login, make popup page automatically open
        setTimeout(() => {
            // popup('', 'open');
        }, 750);

    } else if( name ) {
        // username is set

        // changing name button to say Change
        const nameButton = document.getElementById('name--button');
        nameButton.innerHTML = 'CHANGE NAME';

        // Logging welcome
        const welcomeMessage = document.querySelector('.welcome-message');
        
        // check if already exists
        if( welcomeMessage ) {
            welcomeMessage.innerHTML = `Welcome, ${name[name.length - 1]}.<br>You are connected.`;
        } else if( !welcomeMessage ) {
            // log(`<p class="${classes}">Welcome, ${name}.<br>You are connected.</p>`);
        }
    }
};

function track(sock) {
    document.body.addEventListener('click', function(e) {
        const clickedTarget = e.target.id;
        // console.log(clickedTarget);

        switch (clickedTarget) {
            case 'popup--close':
                popup('', 'close');

                break;
            case 'name--cancel':
                popup('', 'close');

                break;
            case 'name--accept':
                // console.log(`pre-set: ${username()}`);
                username('set');
                sock.emit('name', name);

                break;
            case 'name--button':
                popup('', 'open');

                break;
            default:
                break;
        }
    });
}

(() => {
    welcome();
    // log('<p style="text-align:center; margin:0;">Welcome,<br>You are now connected.</p>');

    const sock = io();

    sock.on('newUser', log);
    sock.on('message', log);

    document.querySelector('#chat-form');
    document.addEventListener('submit', onChatSubmitted(sock));
    document.addEventListener('click', track(sock));
})();