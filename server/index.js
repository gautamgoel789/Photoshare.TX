const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const { Readable } = require("stream");
const Grid = require("gridfs-stream");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 4000;
const MONGO_URI = process.env.MONGO_URI;
const API_HOST = process.env.API_HOST || "localhost";
const API_PORT = process.env.API_PORT || PORT;

app.use(cors());
app.use(express.json());

// MongoDB connection
let gfs;
let gridfsBucket;

mongoose.connect(MONGO_URI);

const conn = mongoose.connection;

conn.once("open", () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads",
  });

  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");

  console.log("✅ MongoDB + GridFS connected");
});

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload photo
app.post("/upload", upload.single("photo"), (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded");

  const readablePhotoStream = new Readable();
  readablePhotoStream.push(req.file.buffer);
  readablePhotoStream.push(null);

  const filename = `${Date.now()}-${req.file.originalname}`;
  const uploadStream = gridfsBucket.openUploadStream(filename, {
    contentType: req.file.mimetype,
  });

  readablePhotoStream.pipe(uploadStream)
    .on("error", (err) => {
      console.error("Upload error:", err);
      res.status(500).send("Error uploading file");
    })
    .on("finish", () => {
      res.status(200).json({ filename });
    });
});

// Get list of image URLs
app.get("/photos", async (req, res) => {
  try {
    const files = await gfs.files.find().toArray();
    console.log("📸 Photos requested, found:", files.length);

    if (!files || files.length === 0) return res.json([]);

    const urls = files
      .filter(file => file.contentType?.startsWith("image/"))
      .map(file => `http://localhost:4000/image/${file.filename}`);

    console.log("🔗 Sending URLs:", urls);
    res.json(urls);
  } catch (err) {
    console.error("Error fetching photos:", err);
    res.status(500).json({ error: "Error fetching photo list" });
  }
});

// Serve an image by filename
app.get("/image/:filename", async (req, res) => {
  try {
    console.log("🖼️ Image requested:", req.params.filename);
    const file = await gfs.files.findOne({ filename: req.params.filename });

    if (!file || !file.contentType?.startsWith("image/")) {
      console.log("❌ Image not found:", req.params.filename);
      return res.status(404).json({ error: "Image not found" });
    }

    console.log("✅ Serving image:", file.filename, "type:", file.contentType);
    res.set("Content-Type", file.contentType);

    const readstream = gridfsBucket.openDownloadStreamByName(file.filename);
    readstream.on("error", (err) => {
      console.error("Stream error:", err);
      res.status(500).send("Error reading image");
    });

    readstream.pipe(res);
  } catch (err) {
    console.error("Image route error:", err);
    res.status(500).json({ error: "Server error while retrieving image" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend Photo API running at http://${API_HOST}:${API_PORT}`);
});
