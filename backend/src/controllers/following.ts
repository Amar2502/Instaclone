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


export const getFollowers = async (req: Request, res: Response) => {
  const { user_id } = req.params;

  if (!user_id) {
    return res.status(400).json({ message: "Missing user_id parameter" });
  }

  try {
    // Step 1: Get follower IDs for the current user
    const [rows] = await pool.query(
      "SELECT follower_id FROM followers WHERE following_id = ?",
      [user_id]
    );

    const followerIds = (rows as any[]).map(row => row.follower_id);

    if (followerIds.length === 0) {
      return res.status(200).json([]); // No followers
    }

    // Step 2: Get user data of all followers
    const [users] = await pool.query(
      "SELECT user_id, username, profile_picture, fullname FROM users WHERE user_id IN (?)",
      [followerIds]
    );

    return res.status(200).json(users);
  } catch (error) {
    console.error("❌ Error getting followers:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getFollowings = async (req: Request, res: Response) => {
  const { user_id } = req.params;

  if (!user_id) {
    return res.status(400).json({ message: "Missing user_id parameter" });
  }

  try {
    // Step 1: Get follower IDs for the current user
    const [rows] = await pool.query(
      "SELECT following_id FROM followers WHERE follower_id = ?",
      [user_id]
    );

    const followingIds = (rows as any[]).map(row => row.following_id);

    if (followingIds.length === 0) {
      return res.status(200).json([]); // No followers
    }

    // Step 2: Get user data of all followers
    const [users] = await pool.query(
      "SELECT user_id, username, profile_picture, fullname FROM users WHERE user_id IN (?)",
      [followingIds]
    );

    return res.status(200).json(users);
  } catch (error) {
    console.error("❌ Error getting followings:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
