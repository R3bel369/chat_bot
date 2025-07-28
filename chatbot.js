// Sends prompt to local Ollama model and returns response
async function askBot(promptText) {
  const formattedPrompt = `User: ${promptText}\nAssistant:`;

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3.2:1b",  // Change this if your model is named differently
        prompt: formattedPrompt,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    return data.response || "No response from model.";
  } catch (error) {
    console.error("Error talking to API:", error);
    return "⚠️ Failed to get response from model.";
  }
}

// Handles sending user input and displaying bot response
async function handleSend() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (!message) return;

  appendMessage("user", message);
  input.value = "";

  const reply = await askBot(message);
  appendMessage("bot", reply);
}

// Appends message to chat box
function appendMessage(sender, text) {
  const chatBox = document.getElementById("chat-box");
  const msgDiv = document.createElement("div");
  msgDiv.className = sender === "user" ? "user-msg" : "bot-msg";
  msgDiv.innerText = text;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Support pressing Enter to send message
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("user-input");
  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      handleSend();
    }
  });
});
