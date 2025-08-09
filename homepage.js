let navbar = document.querySelector('.header .flex .navbar');
let menuBtn = document.querySelector('#menu-btn');
let header = document.querySelector('.header');

menuBtn.onclick = () =>{
    navbar.classList.toggle('active');
    menuBtn.classList.toggle('fa-times');
}

window.onscroll = () =>{
    navbar.classList.remove('active');
    menuBtn.classList.remove('fa-times');

    if(window.scrollY > 0){
        header.classList.add('active')
    }
    else{
        header.classList.remove('active')
    }

}

// Select all sections
const sections = document.querySelectorAll('section');

// Function to check and apply fade-in class
const fadeInSections = () => {
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (sectionTop < windowHeight - 150) {
            section.classList.add('fade-in');
        }
    });
}

// Trigger animation on scroll
window.addEventListener('scroll', fadeInSections);

// **Trigger animation on page load**
document.addEventListener('DOMContentLoaded', fadeInSections);





document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const authButtons = document.getElementById('authButtons');
    const contactForm = document.querySelector('.form');
    const formInputs = contactForm.querySelectorAll('input, textarea');

    // Update header buttons
    if (token) {
        authButtons.innerHTML = `
            <button class="btn profile-btn" onclick="window.location.href='profile/profile.html';">Profile</button>
            <button class="btn logout-btn" onclick="logout()">Logout</button>
        `;
    } else {
        authButtons.innerHTML = `
            <button class="btn login-btn" onclick="window.location.href='login/loginpage.html';">Login</button>
            <button class="btn signup-btn" onclick="window.location.href='login/loginpage.html';">Sign Up</button>
        `;
    }

    // Handle form accessibility
    if (!token) {
        contactForm.innerHTML = `
            <h1 class="heading"><span>Please login</span> to contact us</h1>
            <div class="flex">
                <button class="btn" onclick="window.location.href='login/loginpage.html';">Login</button>
                <button class="btn" onclick="window.location.href='login/loginpage.html';">Sign Up</button>
            </div>
        `;
    }

    // Form submission handler
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!token) {
            showModal('Please login to submit the form');
            return;
        }

        const formData = {
            name: document.querySelector('input[placeholder="your name"]').value,
            email: document.querySelector('input[placeholder="your email"]').value,
            number: document.querySelector('input[placeholder="your number"]').value,
            country: document.querySelector('input[placeholder="your country"]').value,
            message: document.querySelector('textarea').value
        };

        try {
            const response = await fetch('http://localhost:5000/submit-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            

                
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to submit form');
            }
            
            showModal('Form submitted successfully!');
            contactForm.reset();
            } 
            catch (error) {
                showModal(`Error: ${error.message}`);
                console.error('Submission error:', error);
            }
    });
});

function logout() {
    localStorage.removeItem('token');
    window.location.reload();
}

function showModal(message) {
    const modal = document.getElementById('customModal');
    const modalMessage = document.getElementById('modal-message');
    
    modalMessage.textContent = message;
    modal.style.display = 'block';

    // Close modal when clicking X
    document.querySelector('.close-btn').onclick = () => {
        modal.style.display = 'none';
    };

    // Close modal when clicking outside
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    // Auto-close after 3 seconds if no interaction
    setTimeout(() => {
        modal.style.display = 'none';
    }, 3000);
}