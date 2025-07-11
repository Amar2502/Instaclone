import { Request, Response } from "express";
import { pool } from "../config/db";

export const followUser = async (req: Request, res: Response) => {
  const { user_id, following_id } = req.body;

  console.log(user_id, following_id);

  try {
    // 1. Check if user exists
    const [userRows] = await pool.query("SELECT * FROM users WHERE user_id = ?", [user_id]);
    if ((userRows as any[]).length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Validate following_id
    const [followingRows] = await pool.query("SELECT * FROM users WHERE user_id = ?", [following_id]);
    if ((followingRows as any[]).length === 0) {
      return res.status(404).json({ message: `Following user ID ${following_id} not found` });
    }

    // 3. Insert follow relationships
    await pool.query(
      "INSERT IGNORE INTO followers (follower_id, following_id) VALUES (?, ?)",
      [user_id, following_id]
    );

    // 4. Update followings count of main user
    await pool.query(
      "UPDATE users SET followings = followings + ? WHERE user_id = ?",
      [1, user_id]
    );

    // 5. Update followers count of followed user
    await pool.query(
      "UPDATE users SET followers = followers + 1 WHERE user_id = ?",
      [following_id]
    );

    return res.status(200).json({ message: "Users followed successfully" });

  } catch (error) {
    console.error("❌ Error following users:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};