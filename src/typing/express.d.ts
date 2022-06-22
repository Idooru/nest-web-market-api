import { Request } from "express";

declare global {
  namespace Express {
    type Data = Data;
    interface Request {
      data?: Data;
    }
  }
}
