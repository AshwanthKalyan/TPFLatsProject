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

app.use(
  session({
    secret: process.env.SESSION_SECRET || "nitt-secret",
    resave: false,
    saveUninitialized: false,
  })
);

export function log(message: string) {
  const time = new Date().toLocaleTimeString();
  console.log(`${time} ${message}`);
}

(async () => {

  await registerRoutes(httpServer, app);

  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    await setupVite(httpServer, app);
  }

  app.use((err:any,_req:Request,res:Response,next:NextFunction)=>{
    console.error(err);
    res.status(500).json({message:"Internal server error"});
  });

  const port = parseInt(process.env.PORT || "5000");

  httpServer.listen(port, () => {
    log(`Server running on http://localhost:${port}`);
  });

})();