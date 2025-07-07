// controllers/auth.ts (or wherever your auth check is)

import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';

export const isauth = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ loggedIn: false, message: 'No token found' });
    }

    // 🔐 Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET) as { email: string, username: string };

    console.log(decoded);

    const username = decoded.username;

    return res.status(200).json({ loggedIn: true, username });
  } catch (error) {
    console.error('Auth check failed:', error);
    return res.status(401).json({ loggedIn: false, message: 'Invalid token' });
  }
};
