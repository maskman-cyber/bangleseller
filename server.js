require('dotenv').config(); // Load environment variables
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000; // Port can be set via environment variables

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ 1️⃣ Function to Save Contact Form Data in a File (With Error Handling)
const saveToFile = (data) => {
    try {
        const filePath = path.join(__dirname, 'contactData.json');
        let existingData = [];

        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            existingData = fileContent ? JSON.parse(fileContent) : [];
        }

        existingData.push(data);
        fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));

        console.log("📂 Contact form data saved successfully.");
    } catch (error) {
        console.error("❌ Error saving to file:", error);
    }
};

// ✅ 2️⃣ Function to Send Email using Nodemailer (With Error Handling)
const sendEmail = async (formData) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: formData.email, // Send to user who filled the form
            subject: 'Thank you for contacting us!',
            text: `Hello ${formData.name},\n\nThank you for reaching out! We will get back to you soon.\n\nBest regards,\nBangle Seller Team`
        };

        await transporter.sendMail(mailOptions);
        console.log(`📧 Email sent successfully to ${formData.email}`);
    } catch (error) {
        console.error("❌ Error sending email:", error);
    }
};

// ✅ 3️⃣ API Route to Handle Contact Form Submission (With Validation)
app.post('/submit-form', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: "❌ All fields (name, email, message) are required!" });
        }

        console.log("📥 Received contact form data:", req.body);

        saveToFile(req.body); // Save data to a file
        await sendEmail(req.body); // Send email

        res.status(200).json({ message: "✅ Form submitted successfully!" });
    } catch (error) {
        console.error("❌ Error submitting form:", error);
        res.status(500).json({ message: "❌ Internal server error" });
    }
});

// ✅ 4️⃣ Health Check Route
app.get('/', (req, res) => {
    res.send("✅ Server is running smoothly!");
});

// ✅ 5️⃣ Start the Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
