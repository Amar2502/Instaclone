import { Request, Response } from "express";
import { pool } from "../config/db";
import config from "../config/config";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

export const setPost = async (
  req: Request & { file: Express.Multer.File },
  res: Response
) => {
  const file = req.file;
  const { user_id, caption, content_type } = req.body;

  if (!file) {
    return res.status(400).json({ message: "No file provided" });
  }

  const base64File = `data:${file.mimetype};base64,${file.buffer.toString(
    "base64"
  )}`;

  try {
    const result = await cloudinary.uploader.upload(base64File, {
      folder: "posts",
    });

    const [content] = await pool.query(
      "INSERT INTO content (user_id, media, content_type, caption) VALUES (?, ?, ?, ?)",
      [user_id, result.secure_url, content_type, caption]
    );

    await pool.query(
      "UPDATE users SET posts = posts + 1 WHERE user_id = ?",
      [user_id]
    );

    return res.status(200).json({
      message: "Post uploaded successfully",
      mediaUrl: result.secure_url,
    });
  } catch (error) {
    console.error("Upload or DB error:", error);
    return res.status(500).json({ message: "Post upload failed" });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  const user_id = req.params.user_id;

  try {
    const [posts] = await pool.query(
      "SELECT content_id, media, content_type, caption, created_at, likes, comments FROM content WHERE user_id = ?",
      [user_id]
    );

    return res.status(200).json({ posts });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ message: "Failed to fetch posts" });
  }
};
