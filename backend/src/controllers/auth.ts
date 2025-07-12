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
    const decoded = jwt.verify(token, config.JWT_SECRET) as { email: string, username: string, user_id: number, profile_picture: string };

    console.log(decoded);

    const username = decoded.username;
    const user_id = decoded.user_id;
    const profile_picture = decoded.profile_picture;


    return res.status(200).json({ loggedIn: true, username, user_id, profile_picture });
  } catch (error) {
    console.error('Auth check failed:', error);
    return res.status(401).json({ loggedIn: false, message: 'Invalid token' });
  }
};
