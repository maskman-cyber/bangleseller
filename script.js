document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault(); 
    document.getElementById("responseMessage").innerText = "Thank you! We will get back to you soon.";
    this.reset();
});
