import { Request, Response } from "express";
import { pool } from "../config/db";

export const followUser = async (req: Request, res: Response) => {
  const { user_id, following_ids } = req.body;

  console.log(user_id, following_ids);

  try {
    // 1. Check if user exists
    const [userRows] = await pool.query("SELECT * FROM users WHERE user_id = ?", [user_id]);
    if ((userRows as any[]).length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Validate all following_ids
    for (const fid of following_ids) {
      const [followingRows] = await pool.query("SELECT * FROM users WHERE user_id = ?", [fid]);
      if ((followingRows as any[]).length === 0) {
        return res.status(404).json({ message: `Following user ID ${fid} not found` });
      }
    }

    // 3. Insert follow relationships (skip duplicates)
    for (const fid of following_ids) {
      await pool.query(
        "INSERT IGNORE INTO followers (follower_id, following_id) VALUES (?, ?)",
        [user_id, fid]
      );
    }

    // 4. Update followings count of main user
    await pool.query(
      "UPDATE users SET followings = followings + ? WHERE user_id = ?",
      [following_ids.length, user_id]
    );

    // 5. Update followers count of each followed user
    for (const fid of following_ids) {
      await pool.query(
        "UPDATE users SET followers = followers + 1 WHERE user_id = ?",
        [fid]
      );
    }

    return res.status(200).json({ message: "Users followed successfully" });

  } catch (error) {
    console.error("❌ Error following users:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};