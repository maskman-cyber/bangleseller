require('dotenv').config(); // Load environment variables
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// ✅ Firebase Firestore Setup
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc } = require("firebase/firestore");

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

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

        console.log("📂 Contact form data saved to file.");
    } catch (error) {
        console.error("❌ Error saving to file:", error);
    }
};

// ✅ 2️⃣ Function to Save Contact Form Data to Firebase Firestore
const saveToFirebase = async (data) => {
    try {
        const docRef = await addDoc(collection(db, "contacts"), {
            ...data,  // Include IP in Firestore
            timestamp: new Date()
        });
        console.log(`🔥 Data saved to Firestore with ID: ${docRef.id}`);
    } catch (error) {
        console.error("❌ Error saving to Firestore:", error);
    }
};

// ✅ 3️⃣ Function to Send Email using Nodemailer (With Error Handling)
const sendEmail = async (formData) => {
    try {
        if (!formData.email?.trim()) {
            throw new Error("❌ No recipient email provided.");
        }

        console.log("📧 Sending email to:", formData.email);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: formData.email.trim(),
            subject: 'Thank you for contacting us!',
            text: `Hello ${formData.name},\n\nThank you for reaching out! We will get back to you soon.\n\nBest regards,\nBangle Seller Team`
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully to ${formData.email}`);
    } catch (error) {
        console.error("❌ Error sending email:", error);
    }
};

// ✅ 4️⃣ API Route to Handle Contact Form Submission (With Validation)
app.post('/submit-form', async (req, res) => {
    try {
        console.log("📥 Raw request body received:", req.body); // Debug log

        const { name, email, message } = req.body;

        // Ensure all fields are present and not empty
        if (!name?.trim() || !email?.trim() || !message?.trim()) {
            console.error("❌ Missing or empty fields:", { name, email, message });
            return res.status(400).json({ message: "❌ All fields (name, email, message) are required and cannot be empty!" });
        }

        // ✅ Capture IP Address
        const userIp = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;

        // ✅ Prepare Data with IP
        const formData = { name, email, message, ip: userIp, timestamp: new Date().toISOString() };

        console.log("✅ Validated contact form data:", formData);

        saveToFile(formData); // Save data to file
        await saveToFirebase(formData); // Save data to Firebase
        await sendEmail(formData); // Send email

        res.status(200).json({ message: "✅ Form submitted successfully!" });
    } catch (error) {
        console.error("❌ Error submitting form:", error);
        res.status(500).json({ message: "❌ Internal server error" });
    }
});


// ✅ 5️⃣ Health Check Route
app.get('/', (req, res) => {
    res.send("✅ Server is running smoothly!");
});

// ✅ 6️⃣ Start the Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
