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

    console.log(file.size);
    console.log(base64File);
  
    try {
      const result = await cloudinary.uploader.upload(base64File, {
        folder: "profile-pictures",
      });
  
      await pool.query(
        "UPDATE users SET profile_picture = ? WHERE username = ?",
        [result.secure_url, username]
      );
  
      return res
        .status(200)
        .json({ message: "Profile picture updated successfully", url: result.secure_url });
    } catch (error) {
      console.error("Cloudinary error:", error);
      return res.status(500).json({ message: "Image upload failed" });
    }
  };
  