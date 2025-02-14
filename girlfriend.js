const apiKey = "AIzaSyA-KSzRmUzOVQ0DB4_642gj1xuwDu5-ZhA";
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

function appendMessage(sender, message) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add(sender, "message-container");
    
    // Create a message bubble
    const bubble = document.createElement("div");
    bubble.classList.add("message-bubble");
    bubble.textContent = message;
    
    // Create a timestamp
    const timestamp = document.createElement("span");
    timestamp.classList.add("timestamp");
    const now = new Date();
    timestamp.textContent = now.toLocaleTimeString();
    
    // Append timestamp inside bubble at the bottom-right corner
    bubble.appendChild(timestamp);
    messageDiv.appendChild(bubble);
    
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

document.addEventListener("DOMContentLoaded", () => {
    userInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    sendButton.addEventListener("click", sendMessage);

    // Add button animation
    sendButton.addEventListener("mousedown", () => {
        sendButton.classList.add("clicked");
    });

    sendButton.addEventListener("mouseup", () => {
        sendButton.classList.remove("clicked");
    });
});

async function sendMessage() {
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    appendMessage("user", userMessage);
    userInput.value = "";

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userMessage }] }]
            })
        });

        const data = await response.json();
        console.log("Full API Response:", data);

        if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            const aiMessage = data.candidates[0].content.parts[0].text;
            appendMessage("ai", aiMessage);
        } else {
            appendMessage("ai", "Sorry, I didn't understand that.");
        }
    } catch (error) {
        console.error("Error fetching AI response:", error);
        appendMessage("ai", "Sorry, I can't respond right now.");
    }
}
