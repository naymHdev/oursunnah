import express, { Express, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./app/routes/index.js";
import { env } from "./app/config/env.js";
import notFound from "./app/middleware/notFound.js";
import globalErrorHandler from "./app/middleware/globalErrorHandler.js";

const app: Express = express();

app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    success: true,
    message: "Our Sunnah API is running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/v1", router);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
