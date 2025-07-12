import { Request, Response } from "express";
import { pool } from "../config/db";


export const getExplore = async (req: Request, res: Response) => {
    const user_id = req.params.user_id;
    try {
      const [contents] = await pool.query(
        "SELECT content_id, media, content_type, caption, created_at, likes, comments FROM content where user_id != ?",
        [user_id]
      );
  
      return res.status(200).json({ contents });
    } catch (error) {
      console.error("Database error:", error);
      return res.status(500).json({ message: "Failed to fetch posts" });
    }
  };
  