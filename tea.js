
// Get DOM elements
const teaForm = document.getElementById('teaForm');
const teaContainer = document.getElementById('teaContainer');

// Check if user is owner
const isOwner = localStorage.getItem('isOwner') === 'true';

// Load existing tea from localStorage
let teaFeed = JSON.parse(localStorage.getItem('teaFeed')) || [];

// Display tea feed
function displayTea() {
    teaContainer.innerHTML = '';
    teaFeed.forEach((tea, index) => {
        const teaElement = document.createElement('div');
        teaElement.className = 'tea-item';
        teaElement.innerHTML = `
            <p>${tea.content}</p>
            <small>Posted: ${tea.date}</small>
            ${isOwner ? `<button onclick="deleteTea(${index})" class="delete-btn">Delete</button>` : ''}
        `;
        teaContainer.prepend(teaElement);
    });
}

// Handle tea submission
teaForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const content = this.querySelector('textarea').value.trim();
    
    if (content) {
        const newTea = {
            content: content,
            date: new Date().toLocaleString(),
        };
        
        teaFeed.push(newTea);
        localStorage.setItem('teaFeed', JSON.stringify(teaFeed));
        
        this.querySelector('textarea').value = '';
        displayTea();
    }
});

// Delete tea (only for owner)
function deleteTea(index) {
    if (!isOwner) return;
    teaFeed.splice(index, 1);
    localStorage.setItem('teaFeed', JSON.stringify(teaFeed));
    displayTea();
}

// Initial display
displayTea();
