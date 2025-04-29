// Get DOM elements
const gossipForm = document.getElementById('gossipForm');
const gossipContainer = document.getElementById('gossipContainer');
const pageHeader = document.querySelector('.site-header h1');

// Get category from URL or current page
const urlParams = new URLSearchParams(window.location.search);
let category = urlParams.get('category') || window.location.pathname.split('.')[0].replace('/', '');
if (category === 'index') category = 'general';

// Check if user is owner (Gossip Girl)
const isOwner = localStorage.getItem('isOwner') === 'true';

// Load existing gossip from localStorage
let gossipFeed = JSON.parse(localStorage.getItem(`gossipFeed_${category}`)) || [];

// Display gossip feed
function displayGossip() {
    gossipContainer.innerHTML = '';
    gossipFeed.forEach((gossip, index) => {
        const gossipElement = document.createElement('div');
        gossipElement.className = 'gossip-item';
        gossipElement.innerHTML = `
            <p>${gossip.content}</p>
            <small>Posted anonymously - ${gossip.date}</small>
            ${isOwner ? `<button onclick="deleteGossip(${index})" class="delete-btn">Delete</button>` : ''}
        `;
        gossipContainer.prepend(gossipElement);
    });
}

// Handle gossip submission
if (gossipForm) {
    gossipForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const content = this.querySelector('textarea').value.trim();

        if (content) {
            const newGossip = {
                content: content,
                date: new Date().toLocaleString(),
                category: category
            };

            gossipFeed.push(newGossip);
            localStorage.setItem(`gossipFeed_${category}`, JSON.stringify(gossipFeed));

            this.querySelector('textarea').value = '';
            displayGossip();
        }
    });
}

// Delete gossip (only for owner)
function deleteGossip(index) {
    if (!isOwner) return;
    gossipFeed.splice(index, 1);
    localStorage.setItem(`gossipFeed_${category}`, JSON.stringify(gossipFeed));
    displayGossip();
}

// Initial display
displayGossip();

// Owner login functionality
function showOwnerLogin() {
    const loginDialog = document.createElement('div');
    loginDialog.className = 'owner-login';
    loginDialog.innerHTML = `
        <div class="login-popup">
            <h3>Gossip Girl Login</h3>
            <input type="password" id="ownerPassword" placeholder="Enter password" />
            <button onclick="attemptOwnerLogin()">Login</button>
            <button onclick="this.parentElement.parentElement.remove()">Cancel</button>
        </div>
    `;
    document.body.appendChild(loginDialog);
}

function attemptOwnerLogin() {
    const password = document.getElementById('ownerPassword').value;
    const ownerPassword = "danisgossipgirl"; // Your secret password

    if (password === ownerPassword) {
        localStorage.setItem('isOwner', true);
        alert("Welcome back, Gossip Girl! XOXO");
        location.reload();
    } else {
        alert("Wrong password! You're not Gossip Girl!");
        localStorage.setItem('isOwner', false);
    }
}

// Add owner login button
const loginButton = document.createElement('button');
loginButton.className = 'owner-login-btn';
loginButton.textContent = 'GG Login';
loginButton.onclick = showOwnerLogin;
document.body.appendChild(loginButton);