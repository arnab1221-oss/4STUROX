import express from "express";
import multer from "multer";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(express.static(__dirname));

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_ADDRESS,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { name, roll, section } = req.body;
    const filePath = req.file.path;

    await transporter.sendMail({
      from: process.env.GMAIL_ADDRESS,
      to: process.env.GMAIL_ADDRESS,
      subject: `New File Upload from ${name}`,
      text: `Name: ${name}\nRoll: ${roll}\nSection: ${section}`,
      attachments: [{ filename: req.file.originalname, path: filePath }]
    });

    fs.unlinkSync(filePath);
    res.send("File uploaded and emailed successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error sending file.");
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
