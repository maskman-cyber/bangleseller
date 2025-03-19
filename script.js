document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault(); 
    document.getElementById("responseMessage").innerText = "Thank you! We will get back to you soon.";
    this.reset();
});

// Slide-in Effect for Outlets
const homeBtn = document.querySelector('a[href="#home"]'); // Select the Home link
const outletSection = document.getElementById('outletSection');
const closeBtn = document.getElementById('closeBtn');

homeBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    outletSection.classList.add('active');
});

closeBtn.addEventListener('click', () => {
    outletSection.classList.remove('active');
});

// Close when clicking outside
document.addEventListener('click', (e) => {
    if (!outletSection.contains(e.target) && e.target !== homeBtn) {
        outletSection.classList.remove('active');
    }
});
