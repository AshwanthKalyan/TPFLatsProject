import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import session from "express-session";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { setupVite } from "./vite";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* Session configuration */
app.use(
  session({
    secret: process.env.SESSION_SECRET || "nitt-secret",
    resave: false,
    saveUninitialized: false,
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

    /* Environment-based frontend serving */
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