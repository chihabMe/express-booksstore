import { Router } from "express";
import cookie from "cookie";
import {
  loginHandler,
  refreshTokenHandler,
  registerHandler,
  verifyAccessTokenHandler,
} from "./auth.handlers";

export const authRouter = Router();
authRouter.post("/token/obtain/", loginHandler);
authRouter.post("/token/refresh/", refreshTokenHandler);
authRouter.post("/token/verify/", verifyAccessTokenHandler);
authRouter.post("/register/", registerHandler);
