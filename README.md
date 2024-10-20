![Screenshot 2024-10-20 153758](https://github.com/user-attachments/assets/efb05ae4-3d19-4d30-80f3-382a4fdfa5de)

Chatbot Application
Overview
This is a simple chatbot application that allows users to send messages and receive responses from Google's Gemini model. Users can also upload files and insert emojis to enhance their messages. To use this application, you must have your own API key for the Gemini API.

Prerequisites
API Key: You must obtain an API key from Google Cloud Platform to access the Gemini language model. 

Google Cloud Project: Create a new project in the Google Cloud Console if you haven’t done so already.

Steps to Create an API Key
Create a Google Cloud Project:

Go to the Google Cloud Console.
Click on the project drop-down menu and select New Project.
Enter a name for your project and click Create.
Enable the Gemini API:

In the Cloud Console, use the navigation menu to find APIs & Services > Library.
Search for "Gemini" and select it.
Click Enable to activate the API for your project.
Create Credentials:

Still in the APIs & Services section, go to Credentials.
Click on Create Credentials and select API key.
Copy and save the API key, as you will need it to configure the application.
Configuration
Open the main JavaScript file where the API key is defined.
Replace the placeholder string for API_KEY with your actual API key:
CopyReplit
const API_KEY = "YOUR_ACTUAL_API_KEY_HERE";
Usage
Run the application in your web browser.
Interact with the chatbot by typing messages and clicking the send button.
Use the file input to upload files, and the emoji picker to enhance your messages.

License
This project is open source and available under the MIT License.

Feel free to modify any sections to better fit your application's specific details!
