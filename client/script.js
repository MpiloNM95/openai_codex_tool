import bot from './assets/bot.svg' // import bot svg
import user from './assets/user.svg' // import user svg

const form = document.querySelector('form') // form element
const chatContainer = document.querySelector('#chat_container') // chat container element

let loadInterval // to store the interval for the loading indicator

function loader(element) { // loading indicator
    element.textContent = '' // to clear the text content of the element

    loadInterval = setInterval(() => {
        // Update the text content of the loading indicator
        element.textContent += '.';

        // If the loading indicator has reached three dots, reset it
        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300); // Repeat every 300ms
}

 // typing text effect
function typeText(element, text) { 
    // to keep track of the index of the text
    let index = 0 
    // to type the text
    // if the index is less than the length of the text, add the character at the index to the element, and increment the index, else clear the interval, i.e. stop the typing effect
    // 20ms is the time interval between each character
    let interval = setInterval(() => { 
        if (index < text.length) { 
            element.innerHTML += text.charAt(index) 
            index++ 
        } else { 
            clearInterval(interval) 
        }
    }, 20)
}

// generate unique ID for each message div of bot
// necessary for typing text effect for that specific reply
// without unique ID, typing text will work on every element
function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}

// function chatStripe(isAi, value, uniqueId) means the function takes three parameters
// isAi is a boolean value to check if the chat stripe is from the bot or the user
// value is the text content of the chat stripe
// uniqueId is the unique ID of the message div of the bot
function chatStripe(isAi, value, uniqueId) { 
    return ( 
        `
        <div class="wrapper ${isAi && 'ai'}"> 
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${isAi ? bot : user} 
                      alt="${isAi ? 'bot' : 'user'}" 
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `
    )
}

// handles the form submission
// e is the event object
// async function to handle the asynchronous nature of fetch
// const data = new FormData(form) to get the form data
const handleSubmit = async (e) => { 
    e.preventDefault()

    const data = new FormData(form)

    // user's chatstripe
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'))

    // to clear the textarea input 
    form.reset()

    // bot's chatstripe
    const uniqueId = generateUniqueId()
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId)

    // to focus scroll to the bottom 
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // specific message div 
    const messageDiv = document.getElementById(uniqueId)

    // messageDiv.innerHTML = "..."
    loader(messageDiv)
    
    // fetch request to the server
    // method: POST means we are sending data to the server
    // headers: Content-Type: application/json means we are sending JSON data
    // body: JSON.stringify({ prompt: data.get('prompt') }) means we are sending the prompt value of the form
    const response = await fetch('https://codex-the-dev-tool.onrender.com', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    })

    // clearInterval(loadInterval) to clear the interval
    // messageDiv.innerHTML = " " to clear the loading indicator
    // trims any trailing spaces/'\n' 
    // typeText(messageDiv, parsedData) means to type the text
    // else alert the error
    // to focus scroll to the bottom
    // to clear the textarea input
    // messageDiv.innerHTML = "Something went wrong" means to display the error message
    clearInterval(loadInterval)
    messageDiv.innerHTML = " "

    if (response.ok) {
        const data = await response.json();
        const parsedData = data.bot.trim() // trims any trailing spaces/'\n' 

        typeText(messageDiv, parsedData)
    } else {
        const err = await response.text()

        messageDiv.innerHTML = "Something went wrong"
        alert(err)
    }
}

// form.addEventListener('submit', handleSubmit) means to call the handleSubmit function when the form is submitted
// form.addEventListener('keyup', (e) => { if (e.keyCode === 13) { handleSubmit(e); } }) means to call the handleSubmit function when the enter key is pressed
form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        handleSubmit(e);
    }
})