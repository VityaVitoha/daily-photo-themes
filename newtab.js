const blockedWords = [
    "fuck",
    "shit",
    "bitch",
    "asshole",
    "motherfucker",
    "cocaine",
    "heroin",
    "meth",
    "marijuana",
    "weed",
    "fentanyl",
    "ecstasy",
    "mdma",
    "lsd",
    "crack",
    "porn",
    "pornography",
    "xxx",
    "sex",
    "sexual",
    "nude",
    "nudity",
    "naked",
    "hentai",
    "rape",
    "terrorist",
    "terrorism",
    "isis",
    "al qaeda",
    "bomb",
    "murder",
    "murderer",
    "kill",
    "killing",
    "assassination",
    "drug dealer",
    "criminal"
];
const topicInput = document.getElementById("topicInput");
const saveTopic = document.getElementById("saveTopic");

function saveTopicValue() {
    const topic = topicInput.value.trim();

    if (!/^[a-zA-Z0-9\s.,!?'-]+$/.test(topic)) {
        alert("Change the keyboard layout");
        return;
    }

    const normalizedTopic = topic.toLowerCase();

 if (blockedWords.some(word => normalizedTopic === word)) {
    alert("This topic is not allowed");
    return;
}

    if (topic === "") {
        return;
    }

    localStorage.setItem("topic", topic);
    loadPhoto();

topicInput.value = "";
}

saveTopic.addEventListener("click", saveTopicValue);
const savedTopic = localStorage.getItem("topic");

if (savedTopic) {
    topicInput.value = savedTopic;
}
topicInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        saveTopicValue();
    }
});
const background = document.getElementById("background");

async function loadPhoto() {
    const topic = localStorage.getItem("topic");

    if (!topic) {
        return;
    }

    const today = new Date().toISOString().split("T")[0];
    const savedPhoto = localStorage.getItem("photoUrl");
    const savedDate = localStorage.getItem("photoDate");
    const savedTopic = localStorage.getItem("photoTopic");

    if (savedPhoto && savedDate === today && savedTopic === topic) {
        background.style.backgroundImage = `url("${savedPhoto}")`;
        return;
    }

    const url = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(topic)}&page_size=20`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            return;
        }

        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            return;
        }

        const result = data.results[0];

        const imageUrl = result.url;

        localStorage.setItem("photoUrl", imageUrl);
        localStorage.setItem("photoDate", today);
        localStorage.setItem("photoTopic", topic);

        background.style.backgroundImage = `url("${imageUrl}")`;

    } catch (error) {
        console.error("Photo loading error:", error);
    }
}

loadPhoto();