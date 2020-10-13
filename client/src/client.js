// global var
let name = [];

// functions
const canvas = () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'green';
    ctx.fillRect(100, 25, 100, 100);

    // console.log(canvas);
}

// TODO: animate things
const animate = (element, animType, animLength) => {
    const elementType = element.getAttribute('type');
    const elemText = element.childNodes[element.childNodes.length - 1];
    const initialWidth = `${element.offsetWidth - 5}px`;

    
    // Animations
    const openLeft = () => { 
        elemText.style.position = `absolute`;
        elemText.style.width = initialWidth;

        // set opacity
        element.animate([
            {opacity: '0'},
            {opacity: '1'}
        ], animLength * 0.25)

        // draw out effect
        element.animate([
            {width: '0'},
            {width: `${initialWidth}`}
        ], animLength * 0.7);
        element.style.width = initialWidth;

        // ! spin
        elemText.childNodes[element.childNodes.length - 1].animate([
            {transform: 'rotate(-180deg)'},
            {transform: 'rotate(-360deg)'}
        ], animLength);
        elemText.childNodes[element.childNodes.length - 1].animate([
            {marginRight: '10px'},
            {marginRight: '8px'},
            {marginRight: '5px'},
            {marginRight: '0'},
        ], animLength);
    };

    const closeRight = () => {
        // ! spin
        elemText.childNodes[element.childNodes.length - 1].animate([
            {transform: 'rotate(0deg)'},
            {transform: 'rotate(180deg)'}
        ], animLength);
        elemText.childNodes[element.childNodes.length - 1].animate([
            {marginRight: '0'},
            {marginRight: '5px'},
            {marginRight: '8px'},
            {marginRight: '10px'}
        ], animLength);

        // draw out effect
        element.animate([
            {width: `${initialWidth}`},
            {width: '0'}
        ], animLength * 0.7);
        element.style.width = initialWidth;

        // set opacity
        setTimeout(() => {
            element.animate([
                {opacity: '1'},
                {opacity: '0'}
            ], animLength * 0.25)
        }, animLength - (animLength * 0.25));
        
    };

    if( animType === 'openLeft' )  {
        openLeft();
    } else if( animType === 'closeRight' ) {
        closeRight();
    }
}

const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const createError = (element, functionality, errorText) => {
    const create = () => {
        let parent = element.parentElement;

        if( element.nodeName === 'INPUT' ) { // input elem
            element.style.border = '1px solid #DA3838';

            let errorCheck = document.getElementById(`${element.id}--error`);
        
            // Do not proceed if error is already created
            if( !errorCheck ) {
                // create error message element
                const errorElement = document.createElement('span');

                
                // styling error element
                const elementType = element.nodeName.toLowerCase();
                // console.log(elementType);
                errorElement.setAttribute('class', `error ${element.id}-error`);
                errorElement.setAttribute('type', `${elementType}`);
                errorElement.setAttribute('id', `${element.id}--error`);
                
                errorElement.innerHTML = `<span class='error--text'><i class='fas fa-exclamation'></i> ${capitalize(element.id)} ${errorText}</span>`;

                
                // append to element below input
                errorElement.style.right = `${(parent.offsetWidth - element.offsetWidth) + 5}px`
                parent.style.position = 'relative';
                parent.insertBefore(errorElement, element.nextSibling);

                // animate
                animate(errorElement, 'openLeft', 450)
            }
        }
    };

    const remove = () => {
        // only proceed if error is already created
        // TODO: make it so text is called in at the bottom where functionality cals remove
        //       instead of calling it from the original function here
        let error = document.getElementById(`${element.id}--error`);
        
        if( error ) {
            animate(error, 'closeRight', 350);
            // error.remove();

            setTimeout(() => {
                console.log('remove');
                error.remove();
            }, 220);

            // setTimeout(() => {
            // }, 3500);

            if( element.nodeName === 'INPUT' ) {
                element.style.border = '1px solid #c2c4c6';
            };
        }
    };

    if( functionality === 'create') {
        create();
    } else if( functionality === 'remove' || functionality === 'close' ) {
        remove();
    }
}

const username = (setting) => {
    const nameInput = document.getElementById('name');
    let success = false;
    
    const setName = ()  => {
        if( nameInput.value === '' ) {
            // if name is blank
            createError(nameInput, 'create', 'cannot be blank')
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
    if( text === '' ) {
        createError(input, 'create', 'cannot be blank');
    } else {
        input.value = '';
        
        // socketio
        sock.emit('message', text);
    }
    
    // console.log(name);
};

const popup = (name, functionality) => {
    // create popup function
    const createPopup = () => {
        const body = document.body;

        // popup wrapper
        const popupWrapper = document.createElement('div');
        popupWrapper.setAttribute('class', 'popup-wrapper');
        popupWrapper.setAttribute('id', 'popup--wrapper');

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
            inputNameWrapper = document.createElement('div'),
            inputName = document.createElement('input');

        input.setAttribute('class', 'popup-input');
        inputWrapper.setAttribute('class', 'input-wrapper');
        inputForm.setAttribute('id', 'input-form');
        inputLabel.setAttribute('class', 'input-label');
        inputLabel.innerHTML = 'Choose a username:';
        inputNameWrapper.setAttribute('class', 'input-name--wrapper');
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
        inputForm.appendChild(inputNameWrapper)
        inputNameWrapper.appendChild(inputName);

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

    // console.log(name);
    if( !name ) {
        // User has not set name
        // TODO: Make it obvious which button to press when it tells you to set your name here
        
        // changing name button to say Change
        nameButton.innerHTML = 'SET NAME';
        
        // set log welcome message
        log(`<p class='${classes}'>Welcome,<br>Set your username.</p>`);

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
            // log(`<p class='${classes}'>Welcome, ${name}.<br>You are connected.</p>`);
        }
    }
};

function track(sock) {
    document.body.addEventListener('click', function(e) {
        const clickedTargetID = e.target.id;
        const clickedTargetClass = e.target.classList;
        const clickedType = e.target.nodeName;

        // if you click on an error, remove it
        if( clickedTargetClass.contains('error') === true ) {
            // console.log('clickedTargetClass');
            // console.log(clickedTargetClass.contains('error'));
            e.target.previousSibling.focus();
            createError(e.target.previousSibling, 'remove');
        } else if( clickedTargetClass.contains('error--text') ) {
            console.log('true');
            console.log(e.target.parentElement.previousSibling);
            e.target.parentElement.previousSibling.focus();
            createError(e.target.parentElement.previousSibling, 'remove');
        }

        switch (clickedType) {
            case 'INPUT':
                createError(e.target, 'remove');

                break;
        
            default:
                break;
        }
        switch (clickedTargetID) {
            case 'chat':
                const chatInput = document.getElementById('chat');
                createError(chatInput, 'close');

                break;
            case 'popup--close':
                popup('', 'close');

                break;
            case 'popup--wrapper':
                popup('', 'close');

                break;
            case 'name--cancel':
                popup('', 'close');

                break;
            case 'name--accept':
                username('set');
                // console.log(`username: ${username()}`);
                sock.emit('name', name);

                break;
            case 'name--button':
                popup('', 'open');

                break;
            case 'name':
                const nameInput = document.getElementById('name');
                createError(nameInput, 'close');

                break;
            default:
                break;
        }
    });
}

(() => {
    welcome();

    canvas();

    const sock = io();

    sock.on('newUser', log);
    sock.on('message', log);

    document.querySelector('#chat-form');
    document.addEventListener('submit', onChatSubmitted(sock));
    document.addEventListener('click', track(sock));
})();