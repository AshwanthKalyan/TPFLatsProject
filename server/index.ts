import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import session from "express-session";
import { clerkMiddleware } from "@clerk/express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { setupVite } from "./vite";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

/* IMPORTANT for Railway / Render proxies */
app.set("trust proxy", 1);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Clerk auth middleware (reads Clerk session cookies / tokens)
app.use(clerkMiddleware());

/* Session configuration */
app.use(
  session({
    secret: process.env.SESSION_SECRET || "nitt-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // required for HTTPS
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

/* Logger utility */
export function log(message: string) {
  const time = new Date().toLocaleTimeString();
  console.log(`[${time}] ${message}`);
}

(async () => {
  try {

    /* Register API routes */
    await registerRoutes(httpServer, app);

    /* Frontend serving */
    if (process.env.NODE_ENV === "production") {
      serveStatic(app);
    } else {
      await setupVite(httpServer, app);
    }

    /* Global error handler */
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      console.error("Server Error:", err);
      res.status(500).json({
        message: "Internal server error",
      });
    });

    /* Port configuration */
    const port = Number(process.env.PORT) || 5000;

    httpServer.listen(port, "0.0.0.0", () => {
      log(`Server running on port ${port}`);
    });

  } catch (error) {
    console.error("Startup Error:", error);
    process.exit(1);
  }
})();
