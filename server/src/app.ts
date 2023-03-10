import express, { NextFunction, Request, Response, Router } from "express";
import * as dotenv from "dotenv";
import {} from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { authRouter } from "./apps/auth/auth.routes";
import cors from "cors";
import { ALLOWED_ORIGINS } from "./core/constance";
import { accountsRouter } from "./apps/accounts/accounts.routes";
import cookieParser from "cookie-parser";
import { _404, _500 } from "./middlewares/errors.middleware";
import { PORT } from "./env";
dotenv.config();
const registerRoutes = (app: Router) => {
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/accounts", accountsRouter);
};

const main = () => {
  const app = express();
  //middleware
  app.use(express.json());
  app.use(helmet());
  app.use(morgan("dev"));
  app.use(cookieParser());
  app.use(
    cors({
      credentials: true,
      origin: ALLOWED_ORIGINS,
    })
  );
  //register apps
  registerRoutes(app);
  app.use(_404);
  app.use(_500);
  //handle 404 errors
  //
  const port =  PORT;

  app.listen(port, () => {
    console.log(`run on ${port}`);
  });
};

main();
