import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';

function isAuthenticated(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ loggedIn: false });
    return;
  }

  try {
    jwt.verify(token, config.JWT_SECRET);
    next(); // user is authenticated, proceed to controller
  } catch (err) {
    res.status(401).json({ loggedIn: false });
  }
}

export default isAuthenticated;
