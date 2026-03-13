import { Express } from "express";
import { Server } from "http";
import nodemailer from "nodemailer";
import { pool } from "./db";  
import { storage } from "./storage";


export async function registerRoutes(httpServer: Server, app: Express) {

  console.log("Register Routes HIT!");

  const testDbHandler = async (_req: any, res: any) => {
    console.log("in test-db");
    try {
      const result = await pool.query("SELECT NOW()");
      res.json(result.rows);
    } catch (err) {
      console.error("test-db error:", err);
      res.status(500).json({ message: "DB test failed" });
    }
  };

  app.get("/api/test-db", testDbHandler);
  app.get("/test-db", testDbHandler);

  // =========================
  // LOGOUT
  // =========================
  app.post("/api/logout", (req: any, res: any) => {
    if (!req.session) {
      return res.json({ message: "Logged out" });
    }

    req.session.destroy((err: any) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Failed to logout" });
      }

      res.clearCookie("connect.sid");
      res.json({ message: "Logged out" });
    });
  });

  // middleware to check login
  function isAuthenticated(req: any, res: any, next: any) {

    if (!req.session.user) {
      return res.status(401).json({ message: "Not logged in" })
    }

    req.user = req.session.user
    next()

  }


  // =========================
  // GET USER PROFILE
  // =========================
  app.get("/api/me", isAuthenticated, async (req: any, res) => {

    try {

      const result = await pool.query(
        `SELECT 
          id,
          email,
          first_name,
          last_name,
          department,
          year_of_study,
          skills,
          bio,
          github_url,
          resume_url
        FROM users
        WHERE id=$1`,
        [req.user.id]
      )

      const user = result.rows[0]

      if (!user) {
        return res.status(404).json({ message: "User not found" })
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
        resumeUrl: user.resume_url
      })

    } catch (err) {

      console.error(err)
      res.status(500).json({ message: "Failed to fetch user" })

    }

  })


  // =========================
  // UPDATE USER PROFILE
  // =========================
  app.put("/api/users/profile", isAuthenticated, async (req: any, res: any) => {

    try {

      const userId = req.user.id

      const {
        firstName,
        lastName,
        department,
        year,
        skills,
        bio,
        githubUrl,
        resumeUrl
      } = req.body

      await pool.query(
        `UPDATE users 
        SET first_name=$1,
            last_name=$2,
            department=$3,
            year_of_study=$4,
            skills=$5,
            bio=$6,
            github_url=$7,
            resume_url=$8
        WHERE id=$9`,
        [
          firstName,
          lastName,
          department,
          year,
          skills,
          bio,
          githubUrl,
          resumeUrl,
          userId
        ]
      )

      res.json({ message: "Profile updated successfully" })

    } catch (error) {

      console.error(error)
      res.status(500).json({ message: "Failed to update profile" })

    }

  })


  // =========================
  // CREATE PROJECT
  // =========================
  app.post("/api/projects", isAuthenticated, async (req: any, res: any) => {

    try {

      const userId = req.user.id;

      const {
        title,
        description,
        tech_stack,
        skills_required,
        collaborators_needed,
        project_type,
        duration,
        contact_info,
        required_skills,
        comms_link,
        members_needed
      } = req.body;

      const result = await pool.query(
        `INSERT INTO projects
        (
          title,
          description,
          owner_id,
          tech_stack,
          skills_required,
          collaborators_needed,
          project_type,
          duration,
          contact_info,
          required_skills,
          comms_link,
          members_needed
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
        RETURNING *`,
        [
          title,
          description,
          userId,
          tech_stack,
          skills_required,
          collaborators_needed,
          project_type,
          duration,
          contact_info,
          required_skills,
          comms_link,
          members_needed
        ]
      );

      res.json(result.rows[0]);

    } catch (error) {

      console.error("CREATE PROJECT ERROR:", error);
      res.status(500).json({ message: "Failed to create project" });

    }

  });


  // =========================
  // GET ALL PROJECTS
  // =========================
  app.get("/api/projects", async (req, res) => {

    try {

      const result = await pool.query(
        `SELECT * FROM projects ORDER BY created_at DESC`
      );

      res.json(result.rows);

    } catch (error) {

      console.error(error);
      res.status(500).json({ message: "Failed to fetch projects" });

    }

  });

  // =========================
  // SINGLE PROJECT
  // =========================
  app.get("/api/projects/:id", async (req, res) => {
    const result = await pool.query(
      `SELECT * FROM projects WHERE id=$1`,
      [req.params.id]
    );

    res.json(result.rows[0]);
  });

  return httpServer
}
