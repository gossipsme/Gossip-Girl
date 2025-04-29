
// Get DOM elements
const hotTopicContainer = document.getElementById('hotTopicContainer');
const topicForm = document.getElementById('topicForm');
const submitSection = document.getElementById('submit-topic');

// Load existing hot topics from localStorage
let hotTopics = JSON.parse(localStorage.getItem('hotTopics')) || [];

// Check if user is owner
const isOwner = localStorage.getItem('isOwner') === 'true';

// Show submission form only to owner
if (isOwner) {
    submitSection.style.display = 'block';
}

// Display hot topics
function displayHotTopics() {
    hotTopicContainer.innerHTML = '';
    hotTopics.forEach((topic, index) => {
        const topicElement = document.createElement('div');
        topicElement.className = 'hot-topic-item';
        topicElement.innerHTML = `
            <h3>${topic.title}</h3>
            <p>${topic.content}</p>
            <small>Posted by Gossip Girl on ${topic.date}</small>
            ${isOwner ? `<button onclick="deleteTopic(${index})" class="delete-btn">Delete</button>` : ''}
        `;
        hotTopicContainer.prepend(topicElement);
    });
}

// Handle topic submission
if (topicForm) {
    topicForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (!isOwner) return;

        const title = document.getElementById('topicTitle').value.trim();
        const content = document.getElementById('topicContent').value.trim();
        
        if (title && content) {
            const newTopic = {
                title: title,
                content: content,
                date: new Date().toLocaleString()
            };
            
            hotTopics.push(newTopic);
            localStorage.setItem('hotTopics', JSON.stringify(hotTopics));
            
            document.getElementById('topicTitle').value = '';
            document.getElementById('topicContent').value = '';
            displayHotTopics();
        }
    });
}

// Delete topic (only for owner)
function deleteTopic(index) {
    if (!isOwner) return;
    hotTopics.splice(index, 1);
    localStorage.setItem('hotTopics', JSON.stringify(hotTopics));
    displayHotTopics();
}

// Initial display
displayHotTopics();


