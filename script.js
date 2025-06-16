// Image gallery data
const eventImages = {
    'minimal-sessions': [
        '../images/S__8953921.jpg',
        '../images/S__8953923.jpg'
    ]
};

// Modal elements
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const currentImageSpan = document.getElementById('currentImage');
const totalImagesSpan = document.getElementById('totalImages');
const closeBtn = document.querySelector('.close');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentImageIndex = 0;
let currentEventImages = [];

// Open modal function
function openModal(eventKey, eventTitle) {
    currentEventImages = eventImages[eventKey] || [];
    if (currentEventImages.length === 0) return;

    currentImageIndex = 0;
    modalTitle.textContent = eventTitle;
    totalImagesSpan.textContent = currentEventImages.length;
    showImage(currentImageIndex);
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Show image function
function showImage(index) {
    if (currentEventImages.length === 0) return;
    
    modalImage.src = currentEventImages[index];
    currentImageSpan.textContent = index + 1;
    
    // Update navigation button visibility
    prevBtn.style.display = currentEventImages.length > 1 ? 'flex' : 'none';
    nextBtn.style.display = currentEventImages.length > 1 ? 'flex' : 'none';
}

// Previous image
function prevImage() {
    if (currentEventImages.length <= 1) return;
    currentImageIndex = (currentImageIndex - 1 + currentEventImages.length) % currentEventImages.length;
    showImage(currentImageIndex);
}

// Next image
function nextImage() {
    if (currentEventImages.length <= 1) return;
    currentImageIndex = (currentImageIndex + 1) % currentEventImages.length;
    showImage(currentImageIndex);
}

// Close modal function
function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Email validation function
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show message function
function showMessage(message, isError = false) {
    const messageDiv = document.getElementById('newsletter-message');
    messageDiv.textContent = message;
    messageDiv.className = isError ? 'newsletter-message error' : 'newsletter-message success';
    messageDiv.style.display = 'block';
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Clickable event listener
    const clickableEvent = document.querySelector('.clickable-event[data-event="minimal-sessions"]');
    if (clickableEvent) {
        clickableEvent.addEventListener('click', function(e) {
            e.preventDefault();
            const eventKey = this.getAttribute('data-event');
            const eventTitle = this.querySelector('.event-title a').textContent;
            openModal(eventKey, eventTitle);
        });
    }

    // Modal close listeners
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Navigation button listeners
    prevBtn.addEventListener('click', prevImage);
    nextBtn.addEventListener('click', nextImage);

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (modal.style.display === 'block') {
            switch(e.key) {
                case 'Escape':
                    closeModal();
                    break;
                case 'ArrowLeft':
                    prevImage();
                    break;
                case 'ArrowRight':
                    nextImage();
                    break;
            }
        }
    });

    // Newsletter form handling
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('newsletter-email').value.trim();
            
            if (!email) {
                showMessage('メールアドレスを入力してください。', true);
                return;
            }
            
            if (!validateEmail(email)) {
                showMessage('有効なメールアドレスを入力してください。', true);
                return;
            }
            
            // Show loading message
            showMessage('登録中...', false);
            
            // Send to PHP backend
            fetch('newsletter.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showMessage(data.message, false);
                    document.getElementById('newsletter-email').value = '';
                } else {
                    showMessage(data.message, true);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showMessage('エラーが発生しました。もう一度お試しください。', true);
            });
        });
    }

    // Simple navigation highlighting
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
});