const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Define the upload folder path
const uploadFolder = "C:/Users/creat/OneDrive/Desktop/images";

// Ensure the upload folder exists
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
}

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        const filename = Date.now() + path.extname(file.originalname);
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

// Serve static files (for `index.html`)
app.use(express.static(__dirname));

// Serve uploaded images
app.use('/uploads', express.static(uploadFolder));

// Handle image upload
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    res.send(`
        <h2>Image Uploaded Successfully!</h2>
        <p>Click the link below to view your image:</p>
        <a href="${imageUrl}" target="_blank">${imageUrl}</a>
    `);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
