require('dotenv').config(); // Load environment variables
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000; // You can change this if needed

// Middleware
app.use(cors());
app.use(bodyParser.json());

// 📌 1️⃣ Store contact form data in a file
const saveToFile = (data) => {
    const filePath = path.join(__dirname, 'contactData.json');
    let existingData = [];

    if (fs.existsSync(filePath)) {
        existingData = JSON.parse(fs.readFileSync(filePath));
    }

    existingData.push(data);

    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
};

// 📌 2️⃣ Send email using Nodemailer
const sendEmail = async (formData) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Use your email provider (Gmail, Outlook, etc.)
        auth: {
            user: process.env.EMAIL_USER, // Email from .env
            pass: process.env.EMAIL_PASS  // Password from .env
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: formData.email, // Send to user who filled the form
        subject: 'Thank you for contacting us!',
        text: `Hello ${formData.name},\n\nThank you for reaching out! We will get back to you soon.\n\nBest regards,\nBangle Seller Team`
    };

    await transporter.sendMail(mailOptions);
};

// 📌 3️⃣ API Route to Handle Contact Form Submission
app.post('/submit-form', async (req, res) => {
    try {
        const formData = req.body;
        console.log("Received contact form data:", formData);

        saveToFile(formData); // Save data to file
        await sendEmail(formData); // Send email

        res.status(200).json({ message: "Form submitted successfully!" });
    } catch (error) {
        console.error("Error submitting form:", error);
        res.status(500).json({ message: "Error submitting form" });
    }
});

// 📌 4️⃣ Start the server
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
