const chatBody = document.querySelector(".chat-body") 
// Selects the chat body element from the DOM.
// This is where the messages will be displayed.
// It uses the class "chat-body" to find the correct element.

const messageInput = document.querySelector(".message-input") 
// Selects the input field where users can type their messages.
// This input is specifically for user messages.
// It uses the class "message-input" to access it.

const sendMessageButton = document.querySelector("#send-message") 
// Selects the button that sends the user's message.
// This button triggers the sending of the typed message when clicked.
// It uses the ID "send-message" to find the correct button.

const fileInput = document.querySelector("#file-input") 
// Selects the file input element allowing users to upload files.
// Users can attach files to their messages using this input.
// It uses the ID "file-input" to reference the correct element.

const fileUploadWrapper = document.querySelector(".file-upload-wrapper") 
// Selects the wrapper that holds the file upload elements.
// This element is used to display the file once uploaded.
// It uses the class "file-upload-wrapper" for selection.

const fileCancelButton = document.querySelector("#file-cancel")
// Selects the cancel button for uploaded files.
// This button removes the uploaded file from the chat.
// It uses the ID "file-cancel" to locate the specific button.

const chatbotToggler = document.querySelector("#chatbot-toggler") 
// Selects the button that toggles the chatbot visibility.
// This allows users to open or close the chatbot interface.
// It uses the ID "chatbot-toggler" to access the correct button.

const closeChatbot = document.querySelector("#close-chatbot") 
// Selects the close button for the chatbot interface.
// This button directly closes the chatbot when clicked.
// It uses the ID "close-chatbot" to find the button.

const API_KEY = ""; 
// Stores the API key needed to access the chatbot API.
// This key is essential for making authorized requests to the server.
// Currently, it is left empty and needs to be filled with a valid key.

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}` 
// Constructs the API endpoint URL using the API key.
// This URL will be used for sending requests to the chatbot model.
// It specifies the model to be utilized for generating content.

const userData = { 
    message: null, 
    // Initializes a message field that will hold the user's message.
    // Initially set to null until a user types a message.
    // This will be populated when the user sends a message.

    file: { 
        data: null, 
        mime_type: null 
    } 
    // Initializes a file object to hold uploaded file data.
    // Holds both the file's base64 data and MIME type for uploads.
    // Initially set to null values until a file is uploaded.
}

const createMessageElement = (content, ...classes) => { 
    // Defines a function to create a message element in the chat.
    // Accepts content and any number of CSS classes to style the message.
    // Returns a div element that represents the message.

    const div = document.createElement("div") 
    // Creates a new div element to hold the message content.
    // This will be used as the main container for each message.
    // The element type is 'div' because it allows for flexible styling.

    div.classList.add("message", ...classes) 
    // Adds the "message" class and any additional classes passed as arguments.
    // This will style the message appropriately within the chat interface.
    // Using classList.add allows for multiple classes to be added at once.

    div.innerHTML = content 
    // Sets the inner HTML of the div to the provided content.
    // This is where the actual content of the message is inserted.
    // It can include text, images, or other HTML elements.

    return div 
    // Returns the constructed message div element.
    // This element will be added to the chat body later.
    // Enables the dynamic creation of chat messages.
}

const generateBotResponse = async (incomingMessageDiv) => { 
    // Defines an asynchronous function to generate a response from the chatbot.
    // Takes the incoming message div as a parameter to update it with a response.
    // Uses async/await for smoother handling of asynchronous operations.

    const messageElement = incomingMessageDiv.querySelector(".message-text") 
    // Selects the message text element within the incoming message div.
    // This is where the bot's response will be displayed.
    // Uses the class "message-text" to find the correct child element.

    const requestOptions = { 
        method: "POST", 
        // Specifies that this will be a POST request to send data to the API.
        // POST is commonly used for creating or updating resources.
        // This sets the expected method for the upcoming fetch call.

        headers: {"Content-Type": "application/json"}, 
        // Sets the headers for the request, specifically the content type.
        // This indicates that the server should expect JSON data in the request body.
        // Proper headers are necessary for correct interpretation of the request.

        body: JSON.stringify({ 
            contents: [{ 
                parts: [{ text: userData.message }, ...(userData.file.data ? [{inline_data: userData.file }]: 
                [])] 
                }] 
        }) 
        // Constructs the body of the request, including the user's message and any uploaded file data.
        // The file data is included only if it exists, using a ternary operator for conditional inclusion.
        // The entire structure is stringified, as the body must be a string for the fetch.

    }

    try { 
        // Begins a try block to handle potential errors during the fetch call.
        // This allows the code to attempt the fetch and handle errors gracefully.
        // Useful for catching issues like network errors or invalid responses from the API.

        const response = await fetch(API_URL, requestOptions) 
        // Sends the request to the API URL with the specified options.
        // Uses await to pause execution until the response is received.
        // This allows for easy handling of the response and errors immediately after.

        const data = await response.json() 
        // Parses the JSON response from the fetch call into a JavaScript object.
        // This makes it easier to access properties directly in the subsequent code.
        // Await ensures that the function will wait for the response to finish processing.

        if(!response.ok) throw new Error(data.error.message); 
        // Checks if the response indicates an error (non-200 status).
        // Throws a new error with the message from the API if the response is not OK.
        // This will jump to the catch block, allowing for error handling.

        const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim() 
        // Extracts the text response from the API's JSON data.
        // It removes any markdown formatting (double asterisks) and trims whitespace.
        // The resulting text is what will be displayed as the bot's response.

        messageElement.innerText = apiResponseText 
        // Updates the message element with the bot's response text.
        // This allows the user to see the reply within the chat interface.
        // Setting `innerText` ensures that the response is treated as plain text.

    } catch(error) { 
        // Begins a catch block to handle any errors that occurred in the try block.
        // This will catch both fetch errors and any errors thrown manually.
        // Enables graceful error reporting instead of crashing the application.

        console.log(error) 
        // Logs the caught error to the console for debugging purposes.
        // This is useful for developers to understand what went wrong.
        // It allows checking of network issues or API errors during development.

        messageElement.innerText = error.message 
        // Displays the error message in the designated message element.
        // This informs the user that something went wrong.
        // Ensures that the chat application remains informative even in error cases.

        messageElement.style.color = "#ff0000" 
        // Sets the text color of the message element to red, indicating an error.
        // This visually distinguishes the error message from normal messages.
        // Helps users to quickly identify issues within the chat interface.

    } finally { 
        // Begins a finally block that executes after try/catch regardless of outcome.
        // This is used for cleanup operations after attempting to get a response.
        // Ensures that certain code will run, even if there was an error.

        userData.file = {} 
        // Resets the userData file object to an empty state after processing.
        // This clears any file references used for the current message.
        // Ensures that previous files do not carry over to future messages.

        incomingMessageDiv.classList.remove("thinking") 
        // Removes the "thinking" indicator class from the incoming message div.
        // This visually indicates that the bot has finished processing the input.
        // Allows the chat interface to update dynamically to user actions.

        chatBody.scrollTo({top: chatBody.scrollHeight, behavior: "smooth"}) 
        // Automatically scrolls to the bottom of the chat body after sending a message.
        // This keeps the most recent messages visible to the user.
        // It uses a smooth scroll behavior for better user experience.

    }
}

const handleOutgoingMessage = (e) => { 
    // Defines a function to handle sending outgoing messages from the user.
    // Takes the event object as a parameter for event handling.
    // It triggers on message send actions, such as button clicks or hits of the Enter key.

    e.preventDefault() 
    // Prevents the default action of the event (e.g., form submission).
    // This ensures the page does not reload when sending a message.
    // Keeps the user interface responsive to input actions.

    userData.message = messageInput.value.trim() 
    // Retrieves and stores the user's message from the input field.
    // The trim function removes unnecessary whitespace from the input.
    // This stores the message in the userData object for further processing.

    messageInput.value = "" 
    // Clears the message input field after sending the message.
    // This makes it ready for the next message without manual clearing.
    // Enhances the user experience by providing a clean input interface.

    fileUploadWrapper.classList.remove("file-uploaded") 
    // Removes the visual indicators of a file being uploaded from the UI.
    // This resets the state of the file upload wrapper.
    // Ensures that the UI reflects the current state of the message being sent.

    const messageContent = ` <div class="message-text"></div>
        ${userData.file.data ? `<img src="data:${userData.file.mime_type};base64,
          ${userData.file.data}" class="attachment" />` : "" }`; 
    // Constructs the HTML for the outgoing message element.
    // It includes a conditional to display the uploaded image if it exists.
    // This message content will later be displayed in the chat.

    const outgoingMessageDiv = createMessageElement(messageContent, "user-message") 
    // Creates a new message element for the user's outgoing message.
    // Uses the previously defined function to create a styled message div.
    // This div is specifically tagged as a "user-message" for styling purposes.

    outgoingMessageDiv.querySelector(".message-text").textContent =  userData.message 
    // Sets the text content of the message text element to the user's message.
    // This ensures that the user's input is displayed correctly in the chat.
    // The content is sanitized to prevent XSS (Cross-Site Scripting) attacks.

    chatBody.appendChild(outgoingMessageDiv) 
    // Appends the newly created outgoing message div to the chat body.
    // This makes the message visible in the chat interface.
    // Each message is added sequentially to maintain order.

    chatBody.scrollTo({top: chatBody.scrollHeight, behavior: "smooth"}) 
    // Scrolls the chat to the bottom after adding a new message.
    // This keeps the latest conversation piece actively visible.
    // Provides a smooth experience for users to follow the chat flow.

    setTimeout(() => { 
        // Sets a timeout to create a delay before showing the bot's response.
        // This simulates a delay for the bot's thinking or processing time.
        // It adds realism to the interaction, making it feel more human-like.

        const messageContent = ` <svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
            <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
        </svg>
        <div class="message-text"> 
            <div class="thinking-indicator">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
        </div>`;
        // Constructs the SVG markup for the bot's avatar and a thinking indicator.
        // This represents the bot's activity while processing the user's message.
        // It includes animated dots to show that the bot is "thinking."

        const incomingMessageDiv = createMessageElement(messageContent, "bot-message", "thinking") 
        // Creates a new div element for the bot's response with a "thinking" state.
        // This uses the previously defined function to ensure proper styling.
        // This div prepares to present the bot's answer to the user.

        chatBody.appendChild(incomingMessageDiv) 
        // Appends the newly created bot response div to the chat body.
        // This makes the bot's presence and activity visible in the conversation.
        // Keeps the chat flowing logically from the user's message to the bot's actions.

        chatBody.scrollTo({top: chatBody.scrollHeight, behavior: "smooth"}) 
        // Scrolls to the bottom of the chat again after adding the bot's message.
        // Maintains user visibility on the latest bot activity.
        // Encourages a smooth visual transition within the chat interface.

        generateBotResponse(incomingMessageDiv) 
        // Calls the function to generate and display the bot's response based on the user's input.
        // This triggers the HTTP request to the chatbot API with the user message.
        // Starts the process of obtaining the bot’s reply.

    }, 600) 
    // Sets a delay of 600 milliseconds before executing the inside function.
    // This gives the appearance of a delayed response from the bot, simulating thinking time.
    // This timing can be adjusted for responsiveness and user experience.

}

messageInput.addEventListener("keydown", (e) => { 
    // Adds an event listener for keydown events on the message input field.
    // This allows the application to react when the user types and presses keys.
    // The callback function will determine if the Enter key is pressed.

    const userMessage = e.target.value.trim() 
    // Retrieves the trimmed value from the message input.
    // This stores the contents that the user has typed for evaluation.
    // Ensures that only meaningful content is processed.

    if(e.key === "Enter" && userMessage) { 
        // Checks if the pressed key is Enter and that the user message is not empty.
        // This means the user intends to send a message.
        // It prevents sending just whitespace or empty messages.

        handleOutgoingMessage(e) 
        // Calls the function to handle sending the outgoing message.
        // This initiates the whole sending process by executing all necessary steps.
        // Allows for smooth user interaction while sending a message to the chatbot.
    }
})

fileInput.addEventListener("change", () => { 
    // Adds an event listener for changes to the file input field.
    // This detects when a user selects or uploads a file.
    // The callback function will process the selected file.

    const file = fileInput.files[0] 
    // Retrieves the first file selected in the file input (if any).
    // The first file is assumed to be the only file the user intends to send.
    // If no file is selected, the variable will be undefined.

    if(!file) return 
    // Checks if a file was selected; if not, exits the function early.
    // This prevents further processing of non-existent files.
    // Ensures that no errors occur due to attempting to read a null object.

    const reader = new FileReader() 
    // Creates a new FileReader object for reading the file data.
    // FileReader allows for reading file contents asynchronously.
    // This will be used to convert the file to a base64 string for easy handling.

    reader.onload = (e) => { 
        // Sets up an onload event handler to process the file once it's read.
        // This function is automatically called when the file read completes.
        // Provides access to the file content.

        fileUploadWrapper.querySelector("img").src = e.target.result 
        // Sets the src attribute of the image in the file upload wrapper to display the preview.
        // This allows the user to see the uploaded file visually in the chat interface.
        // The result contains the file data in base64 encoded format.

        fileUploadWrapper.classList.add("file-uploaded") 
        // Updates the file upload wrapper to indicate that a file has been uploaded.
        // This triggers any associated CSS styles to show the file attachment.
        // It enhances the user experience by providing feedback on the upload action.

        const base64String = e.target.result.split(",")[1] 
        // Extracts the base64 string from the data URL read by the FileReader.
        // The result is split to separate the base64 data from its prefix.
        // The actual data can now be processed and stored for sending.

        userData.file = { 
            data: base64String, 
            // Stores the base64 encoded file data for future use.
            // This allows the file to be included when sending a message.
            // It references the file content directly in memory.

            mime_type: file.type 
        } 
        // Stores the MIME type of the uploaded file for proper handling.
        // This info is crucial for correctly managing files in the chat.
        // Allows for the correct display and interpretation of the uploaded file type.

        fileInput.value = "" 
        // Resets the value of the file input field for future uploads.
        // This makes the file input ready for another selection without manual intervention.
        // Ensures a clean state after processing the uploaded file.
    }

    reader.readAsDataURL(file) 
    // Begins reading the contents of the selected file as a data URL.
    // The FileReader will convert it to a format suitable for use as an <img> source.
    // This allows for quick visual representation of the file within the chat interface.
})

fileCancelButton.addEventListener("click", () => { 
    // Adds an event listener to the cancel button for file uploads.
    // This triggers when the user clicks to cancel an uploaded file.
    // The callback function removes any references to the uploaded file.

    userData.file = {} 
    // Resets the userData file object to an empty state.
    // This clears any previously set file data from the upload.
    // Prepares the application to handle subsequent interactions without leftover data.

    fileUploadWrapper.classList.remove("file-uploaded") 
    // Updates the file upload wrapper to remove file-uploaded visual indicators.
    // This signifies that no files are currently attached to the message.
    // Keeps the UI consistent according to the user's actions.
})

const picker = new EmojiMart.Picker({ 
    // Instantiates a new EmojiMart Picker for selecting emojis.
    // This provides an interface for users to insert emojis into their messages.
    // It enhances user interactions by adding a visual emoji selection.

    theme	: "light", 
    // Sets the theme of the emoji picker to light.
    // This can be changed to dark for different aesthetics.
    // Enhances accessibility and visibility based on user preferences.

    skinTonePosition: "none", 
    // Configures the skin tone selector to be hidden.
    // This allows for a simpler emoji selection process without skin tone options.
    // Facilitates quick access to emojis without extra selections.

    previewPosition: "none", 
    // Hides the preview area for emoji selection.
    // Keeps the UI simpler without unnecessary visual clutter.
    // Enhancements can be made based on user testing.

    onEmojiSelect: (emoji) =>  { 
        // Callback function triggered when an emoji is selected.
        // Allows the selected emoji to be inserted into the message input.
        // Receives the selected emoji as a parameter for processing.

        const { selectionStart: start, selectionEnd: end } = messageInput; 
        // Destructures the selectionStart and selectionEnd properties from the message input.
        // These properties indicate where to insert the selected emoji.
        // Allows for maintaining the cursor position context.

        messageInput.setRangeText(emoji.native, start, end, "end") 
        // Inserts the selected emoji into the input field at the cursor position.
        // The "end" option moves the cursor to the end of the inserted text.
        // This ensures a smooth user experience when adding emojis.

        messageInput.focus() 
        // Sets focus back to the message input field after selecting an emoji.
        // This allows users to continue typing without needing extra clicks.
        // Enhances interaction fluency within the UI.
    },

    onClickOutside: (e) => { 
        // Event handler for clicks outside the emoji picker.
        // This determines whether to show or hide the emoji picker.
        // Provides a logical closure system for interaction management.

        if(e.target.id === "emoji-picker") { 
            // Checks if the clicked element corresponds to the emoji picker.
            // This allows toggling the emoji picker visibility based on interactions.
            // Prevents dismissing the picker when interacting with it directly.

            document.body.classList.toggle("show-emoji-picker") 
            // Toggles the visibility of the emoji picker based on the click.
            // This controls whether the emoji picker is displayed or hidden.
            // Creates a responsive interface for emoji selection.

        } else { 
            // In case the click is outside the emoji picker.

            document.body.classList.remove("show-emoji-picker") 
            // Removes the class that shows the emoji picker.
            // This hides the emoji picker if the user clicks elsewhere.
            // Maintains cleanliness of the UI by avoiding unnecessary openness.
        }
    }
})

document.querySelector(".chat-form").appendChild(picker) 
// Appends the emoji picker to the chat form for user interaction.
// This integrates the picker into the existing chat interface.
// Users can now access the emoji selection directly while sending messages.

sendMessageButton.addEventListener("click", (e) => handleOutgoingMessage(e)) 
// Adds a click event listener to the send message button.
// This allows users to send messages when they click the button.
// Calls the handleOutgoingMessage function to process the message.

document.querySelector("#file-upload").addEventListener("click", () => fileInput.click()) 
// Adds a click event listener to the file upload button.
// This triggers the file input to open when users click the button.
// Facilitates easier file selection by mimicking a click on the hidden input.

chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot")) 
// Adds an event listener to the chatbot toggler button.
// When clicked, it toggles the visibility of the chatbot interface.
// This provides users with an easy way to show or hide the chatbot.

closeChatbot.addEventListener("click", () => document.body.classList.remove("show-chatbot")) 
// Adds a click event listener to the close chatbot button.
// This removes the visible class from the chatbot, closing it when clicked.
// It allows users to exit the chatbot view cleanly, improving navigation.