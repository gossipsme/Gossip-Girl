// Get DOM elements
const screenshotForm = document.getElementById('screenshotForm');
const screenshotContainer = document.getElementById('screenshotContainer');

// Check if user is owner
const isOwner = localStorage.getItem('isOwner') === 'true';

// Load existing screenshots from localStorage
let screenshots = JSON.parse(localStorage.getItem('screenshots')) || [];

// Display screenshots
function displayScreenshots() {
    screenshotContainer.innerHTML = '';
    screenshots.forEach((screenshot, index) => {
        const screenshotElement = document.createElement('div');
        screenshotElement.className = 'screenshot-item';
        screenshotElement.innerHTML = `
            <img src="${screenshot.image}" alt="Anonymous Screenshot">
            ${screenshot.caption ? `<p>${screenshot.caption}</p>` : ''}
            <small>Posted anonymously - ${screenshot.date}</small>
            ${isOwner ? `<button onclick="deleteScreenshot(${index})" class="delete-btn">Delete</button>` : ''}
        `;
        screenshotContainer.prepend(screenshotElement);
    });
}

// Handle screenshot submission
if (screenshotForm) {
    screenshotForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const fileInput = document.getElementById('screenshotUpload');
        const caption = document.getElementById('screenshotCaption').value.trim();

        if (fileInput.files && fileInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const newScreenshot = {
                    image: e.target.result,
                    caption: caption,
                    date: new Date().toLocaleString()
                };

                screenshots.push(newScreenshot);
                localStorage.setItem('screenshots', JSON.stringify(screenshots));

                fileInput.value = '';
                document.getElementById('screenshotCaption').value = '';
                displayScreenshots();
                alert('Screenshot uploaded anonymously!');
            };
            reader.readAsDataURL(fileInput.files[0]);
        }
    });
}

// Delete screenshot (only for owner)
function deleteScreenshot(index) {
    if (!isOwner) return;

    if (confirm('Are you sure you want to delete this screenshot?')) {
        screenshots.splice(index, 1);
        localStorage.setItem('screenshots', JSON.stringify(screenshots));
        displayScreenshots();
    }
}

// Initial display
displayScreenshots();