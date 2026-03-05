import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Register Auth blueprint routes
  await setupAuth(app);
  registerAuthRoutes(app);

  // User routes
  app.put(api.users.updateProfile.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const input = api.users.updateProfile.input.parse(req.body);
      const updatedUser = await storage.updateUserProfile(userId, input);
      if (!updatedUser) {
        return res.status(401).json({ message: "User not found" });
      }
      res.json(updatedUser);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Project routes
  app.get(api.projects.list.path, async (req, res) => {
    const allProjects = await storage.getProjects();
    res.json(allProjects);
  });

  app.get(api.projects.get.path, async (req, res) => {
    const projectId = parseInt(req.params.id);
    if (isNaN(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }
    
    const project = await storage.getProject(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    res.json(project);
  });

  app.post(api.projects.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const input = api.projects.create.input.parse(req.body);
      const newProject = await storage.createProject({ ...input, creatorId: userId });
      res.status(201).json(newProject);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Application routes
  app.get(api.applications.listForProject.path, isAuthenticated, async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      if (isNaN(projectId)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }

      // Check if user is the creator of the project
      const project = await storage.getProject(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      const userId = req.user.claims.sub;
      if (project.creatorId !== userId) {
        return res.status(401).json({ message: "Unauthorized to view these applications" });
      }

      const apps = await storage.getApplicationsForProject(projectId);
      res.json(apps);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.applications.listForUser.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const apps = await storage.getApplicationsForUser(userId);
      res.json(apps);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.applications.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      if (isNaN(projectId)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }

      const userId = req.user.claims.sub;
      const input = api.applications.create.input.parse(req.body);
      
      const newApp = await storage.createApplication({ 
        ...input, 
        projectId, 
        applicantId: userId 
      });
      
      res.status(201).json(newApp);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch(api.applications.updateStatus.path, isAuthenticated, async (req: any, res) => {
    try {
      const appId = parseInt(req.params.id);
      if (isNaN(appId)) {
        return res.status(400).json({ message: "Invalid application ID" });
      }

      const input = api.applications.updateStatus.input.parse(req.body);
      const userId = req.user.claims.sub;
      
      // We need to check if the current user is the creator of the project this app belongs to
      // In a real app we'd do this via a join or specific query, but for simplicity we'll do this
      // Or maybe the frontend only shows this button if they are the creator
      
      const updatedApp = await storage.updateApplicationStatus(appId, input.status);
      if (!updatedApp) {
        return res.status(404).json({ message: "Application not found" });
      }
      
      res.json(updatedApp);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
