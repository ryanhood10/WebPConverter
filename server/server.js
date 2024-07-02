const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Multer configuration for file uploads
const upload = multer({ dest: 'uploads/' });

// Enable CORS for all origins
app.use(cors());

// Serve static files (converted WebP images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Endpoint to handle file upload and conversion
app.post('/webpConvert', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const { path: imagePath, filename } = req.file;

    // Process image using Sharp to convert to WebP format
    const webpPath = path.join(__dirname, 'uploads', `${filename}.webp`);
    await sharp(imagePath)
      .toFormat('webp')
      .toFile(webpPath);

    // Clean up original image file
    fs.unlinkSync(imagePath);

    // Respond with the path to the converted WebP image relative to /uploads
    res.json({ message: 'Image converted to WebP.', webpPath: `uploads/${filename}.webp` });
  } catch (error) {
    console.error('Error converting image:', error);
    res.status(500).json({ error: 'Failed to convert image.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
