import { Request, Response } from 'express';

export const isauth = (req: Request, res: Response) => {
  res.status(200).json({ loggedIn: true });
};
