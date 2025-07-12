import { Request, Response } from "express";
import { pool } from "../config/db";
import config from "../config/config";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

export const setProfile = async (
  req: Request & { file: Express.Multer.File },
  res: Response
) => {
  const file = req.file;
  const username = req.body.username;

  if (!file) {
    return res.status(400).json({ message: "No file provided" });
  }

  const base64File = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

  try {
    // 1. Get current profile_pic_public_id from DB
    const [rows]: any = await pool.query(
      "SELECT profile_pic_public_id FROM users WHERE username = ?",
      [username]
    );
    
    const currentPublicId = rows[0]?.profile_pic_public_id;

    // 2. Delete old image if it's not the default
    if (currentPublicId && currentPublicId !== config.DEFAULT_PROFILE_PUBLIC_ID) {
      await cloudinary.uploader.destroy(currentPublicId);
    }

    // 3. Upload new image
    const result = await cloudinary.uploader.upload(base64File, {
      folder: "profile-pictures",
    });

    // 4. Update DB
    await pool.query(
      "UPDATE users SET profile_picture = ?, profile_pic_public_id = ? WHERE username = ?",
      [result.secure_url, result.public_id, username]
    );

    return res.status(200).json({
      message: "Profile picture updated successfully",
      url: result.secure_url,
    });
  } catch (error) {
    console.error("Cloudinary error:", error);
    return res.status(500).json({ message: "Image upload failed" });
  }
};
