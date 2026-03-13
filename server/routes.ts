import { Express } from "express";
import { Server } from "http";
<<<<<<< HEAD
import { pool } from "./db";  


<<<<<<< HEAD
export async function registerRoutes(httpServer: Server, app: Express) {

  console.log("Register Routes Hit!");
=======
import nodemailer from "nodemailer";
import { pool } from "./db";

const otpStore: Record<string, string> = {};

// EMAIL TRANSPORTER
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function registerRoutes(httpServer: Server, app: Express) {

  app.get("/api/test-db", async (_req, res) => {
=======
export async function registerRoutes(httpServer: Server, app: Express) {

  console.log("Register Routes HIT!");

  app.get("/api/test-db", async (req,res)=>{

    console.log("in test-db");
    
>>>>>>> 84d81a7 (Correct commit, for Sakthi)
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  });
>>>>>>> 309780e7e5ab5e3c34c547d80956e38bad4f4dad

  /* =========================
     AUTH MIDDLEWARE
  ========================= */
  function isAuthenticated(req: any, res: any, next: any) {
    if (!req.session?.user) {
      return res.status(401).json({ message: "Not logged in" });
    }

    req.user = req.session.user;
    next();
  }

<<<<<<< HEAD
<<<<<<< HEAD
  
  // =========================
  // TEST DATABASE CONNECTION
  // =========================
  app.get("/api/test-db", async (req, res) => {
    console.log("🔹 /api/test-db route hit");
    try {
      // Simple query to check DB connectivity
      const result = await pool.query("SELECT NOW()");
      
      res.json({
        message: "Database connection successful",
        currentTime: result.rows[0].now
      });
    } catch (error) {
      console.error("DB TEST ERROR:", error);
      res.status(500).json({ message: "Failed to connect to database", error });
    }
  });
=======
  /* =========================
     SEND OTP
  ========================= */
  app.post("/api/send-otp", async (req: any, res) => {
    const { email } = req.body;

    const regex = /^[a-zA-Z0-9]+@nitt\.edu$/;

    if (!regex.test(email)) {
      return res.status(400).json({ message: "Use NITT email" });
    }

    const rollno = email.split("@")[0];

    if (email === "test@nitt.edu") {

      await pool.query(
        "INSERT INTO users (id,email) VALUES ($1,$2) ON CONFLICT (id) DO NOTHING",
        [rollno, email]
      );

      req.session.user = { id: rollno, email };

      return res.json({
        message: "Auto login success",
        autoLogin: true,
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = otp;

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "NITT Hub OTP Verification",
        html: `<h2>Your OTP is ${otp}</h2>`,
      });

      res.json({ message: "OTP sent successfully" });

    } catch (err) {

      console.error(err);
      res.status(500).json({ message: "Failed to send OTP" });

    }
  });

  /* =========================
     VERIFY OTP
  ========================= */
  app.post("/api/verify-otp", async (req: any, res) => {

    const { email, otp } = req.body;

    if (otpStore[email] !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    delete otpStore[email];

    const rollno = email.split("@")[0];

    try {

      await pool.query(
        "INSERT INTO users (id,email) VALUES ($1,$2) ON CONFLICT (id) DO NOTHING",
        [rollno, email]
      );

      req.session.user = { id: rollno, email };

      res.json({
        message: "login success",
        user: req.session.user,
      });

    } catch (err) {

      console.error(err);
      res.status(500).json({ message: "Database error" });

    }
  });

  /* =========================
     LOGIN
  ========================= */
  app.post("/api/login", (req: any, res) => {

    const { email } = req.body;

    const regex = /^[a-zA-Z0-9]+@nitt\.edu$/;

    if (!regex.test(email)) {
      return res.status(400).json({ message: "Use NITT email" });
    }

    const rollno = email.split("@")[0];

    req.session.user = { id: rollno, email };

    res.json({
      message: "login success",
      user: req.session.user,
    });

  });

  /* =========================
     LOGOUT
  ========================= */
  app.post("/api/logout", (req: any, res) => {

    req.session.destroy(() => {
      res.json({ message: "logged out" });
    });

  });
>>>>>>> 309780e7e5ab5e3c34c547d80956e38bad4f4dad

  /* =========================
     GET USER PROFILE
  ========================= */
=======

  // =========================
  // GET USER PROFILE
  // =========================
>>>>>>> 84d81a7 (Correct commit, for Sakthi)
  app.get("/api/me", isAuthenticated, async (req: any, res) => {

    try {

      const result = await pool.query(
        `SELECT id,email,first_name,last_name,department,
        year_of_study,skills,bio,github_url,resume_url
        FROM users
        WHERE id=$1`,
        [req.user.id]
      );

      const user = result.rows[0];

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        department: user.department,
        year: user.year_of_study,
        skills: user.skills,
        bio: user.bio,
        githubUrl: user.github_url,
        resumeUrl: user.resume_url,
      });

    } catch (err) {

      console.error(err);
      res.status(500).json({ message: "Failed to fetch user" });

    }
  });

  return httpServer;
}