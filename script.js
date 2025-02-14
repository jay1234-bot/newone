const apiKey = "AIzaSyA-KSzRmUzOVQ0DB4_642gj1xuwDu5-ZhA";
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

function appendMessage(sender, message) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add(sender);
    messageDiv.textContent = message;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

document.addEventListener("DOMContentLoaded", () => {
    const inputField = document.getElementById("user-input");
    const sendButton = document.querySelector("button");
    
    inputField.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    });
    
    sendButton.addEventListener("click", sendMessage);
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
        console.log("Full API Response:", data); // Debugging: Log full response
        
        const aiMessage = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I didn't understand that.";
        appendMessage("ai", aiMessage);
    } catch (error) {
        console.error("Error fetching AI response:", error);
        appendMessage("ai", "Sorry, I can't respond right now.");
    }
}
