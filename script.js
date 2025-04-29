// Get DOM elements
const teaForm = document.getElementById('teaForm');
const teaContainer = document.getElementById('teaContainer');

// Check if user is owner
const isOwner = localStorage.getItem('isOwner') === 'true';

// Load existing tea from localStorage
let teaFeed = JSON.parse(localStorage.getItem('teaFeed')) || [];

function showPage(page) {
    // Handle page navigation
    const pageMap = {
        'drama': 'drama.html',
        'relationships': 'relationships.html',
        'breakups': 'breakups.html',
        'cheaters': 'cheaters.html',
        'bestie': 'bestie.html',
        'screenshots': 'screenshots.html'
    };

    if (pageMap[page]) {
        window.location.href = pageMap[page];
        return;
    }

    const homePage = document.getElementById('homePage');
    const contentPage = document.getElementById('contentPage');
    const pageTitle = document.getElementById('pageTitle');
    const screenshotUpload = document.getElementById('screenshot-upload');
    const hotTopicSection = document.getElementById('hot-topic-section');
    const submitGossip = document.getElementById('submit-gossip');
    

    homePage.style.display = page === 'home' ? 'block' : 'none';
    contentPage.style.display = page === 'home' ? 'none' : 'block';
    screenshotUpload.style.display = page === 'screenshots' ? 'block' : 'none';
    hotTopicSection.style.display = page === 'hot-topic' ? 'block' : 'none';
    submitGossip.style.display = page !== 'screenshots' && page !== 'hot-topic' && page !== 'home' ? 'block' : 'none';

    // Update page title and content
    switch(page) {
        case 'home':
            pageTitle.textContent = 'gossip girl';
            break;
        case 'drama':
            pageTitle.textContent = 'shh... drama tea?';
            break;
        case 'relationships':
            pageTitle.textContent = 'shh... relationship tea?';
            break;
        case 'breakups':
            pageTitle.textContent = 'shh... breakup tea?';
            break;
        case 'cheaters':
            pageTitle.textContent = 'shh... cheater tea?';
            break;
        case 'bestie':
            pageTitle.textContent = 'shh... bestie tea?';
            break;
        case 'screenshots':
            pageTitle.textContent = 'screenshots';
            break;
        case 'hot-topic':
            pageTitle.textContent = 'hot topic';
            break;
    }

    // Load appropriate content
    if (page !== 'home') {
        loadContent(page);
    }
}

// Check if user is owner (Gossip Girl)
const isOwner = localStorage.getItem('isOwner') === 'true';

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
    const ownerPassword = "danisgossipgirl"; // Owner password

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

// Initial page load
const hash = window.location.hash.substring(1) || 'home';
showPage(hash);

// Handle navigation
window.addEventListener('hashchange', () => {
    const page = window.location.hash.substring(1) || 'home';
    showPage(page);
});

// Load page content
function loadContent(page) {
    if (!document.getElementById('contentContainer')) return;
    
    category = page;
    gossipFeed = JSON.parse(localStorage.getItem(`gossipFeed_${category}`)) || [];
    displayGossip();
}

// Promote gossip to hot topic
function promoteToHotTopic(gossip) {
    if (!isOwner) return;
    
    const hotTopics = JSON.parse(localStorage.getItem('hotTopics')) || [];
    const newTopic = {
        title: 'Hot Gossip Alert',
        content: gossip.content,
        date: new Date().toLocaleString()
    };
    
    hotTopics.push(newTopic);
    localStorage.setItem('hotTopics', JSON.stringify(hotTopics));
    alert('Gossip promoted to Hot Topics!');
}

// Update displayGossip function to include promote button for owner
function displayGossip() {
    const container = document.getElementById('contentContainer');
    if (!container) return;
    
    container.innerHTML = '';
    gossipFeed.forEach((gossip, index) => {
        const gossipElement = document.createElement('div');
        gossipElement.className = 'gossip-item';
        gossipElement.innerHTML = `
            <p>${gossip.content}</p>
            <small>Posted anonymously - ${gossip.date}</small>
            ${isOwner ? `
                <button onclick="deleteGossip(${index})" class="delete-btn">Delete</button>
                <button onclick="promoteToHotTopic(${JSON.stringify(gossip).replace(/"/g, '&quot;')})" class="promote-btn">Promote to Hot Topic</button>
            ` : ''}
        `;
        container.prepend(gossipElement);
    });
}