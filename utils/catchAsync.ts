import { Request, Response, NextFunction } from "express";

export = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): any => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
