import { pool } from "../config/db";
import { Request, Response } from "express";

const DEFAULT_LIMIT = 50;

export const getLatestContent = async (req: Request, res: Response) => {
  const { followings, offset = 0 } = req.body;

  if (!Array.isArray(followings)) {
    return res.status(400).json({ message: "`followings` must be an array of user IDs" });
  }
  if (followings.length === 0) {
    return res.status(200).json({ posts: [] });
  }

  const safeOffset = Math.max(0, Number(offset) || 0);

  try {
    const placeholders = followings.map(() => "?").join(",");
    const query = `
      SELECT
        c.content_id,
        c.media,
        c.content_type,
        c.caption,
        c.created_at,
        c.likes,
        c.comments,
        u.user_id,
        u.username,
        u.profile_picture
      FROM content c
      JOIN users u ON c.user_id = u.user_id
      WHERE c.user_id IN (${placeholders})
      ORDER BY c.created_at DESC
      LIMIT ?
      OFFSET ?
    `;
    const params = [...followings, DEFAULT_LIMIT, safeOffset];

    const [rows] = await pool.query(query, params);

    return res.status(200).json({ posts: rows });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ message: "Failed to fetch posts" });
  }
};
