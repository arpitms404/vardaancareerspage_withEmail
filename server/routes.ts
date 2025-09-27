import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import nodemailer from "nodemailer";
import fs from "fs";
import * as dotenv from "dotenv";

dotenv.config();

// ✅ Multer config → uploads folder with size limit (5 MB)
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});

// Custom type for file in request
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // 🔹 Apply route (with resume upload)
  app.post("/api/apply", upload.single("resume"), async (req: MulterRequest, res) => {
    try {
      const { fullName, email, phone, experience, qualifications, coverLetter } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: "Resume is required" });
      }

      // ✅ Immediately respond to frontend
      res.status(200).json({ message: "Application received! We’ll email you shortly." });

      // ✅ Background me email bhejo
      (async () => {
        try {
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
          });

          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_TO,
            subject: `New Application from ${fullName}`,
            html: `
              <h2>New Job Application</h2>
              <p><b>Name:</b> ${fullName}</p>
              <p><b>Email:</b> ${email}</p>
              <p><b>Phone:</b> ${phone}</p>
              <p><b>Experience:</b> ${experience}</p>
              <p><b>Qualifications:</b> ${qualifications}</p>
              <p><b>Cover Letter:</b><br/> ${coverLetter}</p>
            `,
            attachments: [{ filename: file.originalname, path: file.path }],
          });

          fs.unlinkSync(file.path);
          console.log("✅ Background email sent successfully!");
        } catch (err) {
          console.error("❌ Email send failed in background:", err);
        }
      })();
    } catch (err: any) {
      console.error("❌ Application error:", err);

      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "Resume too large. Max 5MB allowed." });
      }

      if (!res.headersSent) {
        res.status(500).json({ message: "Error submitting application" });
      }
    }
  });

  // 🔹 Test email route (for debugging)
  app.get("/api/test-email", async (_req, res) => {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_TO,
        subject: "✅ Test Email",
        text: "This is a test email from Nodemailer setup",
      });

      console.log("📧 Test email sent successfully!");
      res.status(200).json({ message: "Test email sent successfully!" });
    } catch (err: any) {
      console.error("❌ Test email error:", err);
      res.status(500).json({ message: "Test email failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
