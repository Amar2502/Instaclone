import { Request, Response } from "express";
import { pool } from "../config/db";

export const sendMessages = async (req: Request, res: Response) => {
  const { sender_id, receiver_id, message } = req.body;

  try {
    await pool.query(
      "INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)",
      [sender_id, receiver_id, message]
    );

    res.status(200).json({ message: "Message sent successfully" });
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ message: "Error sending message" });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  const sender_id = Number(req.params.sender_id);
  const receiver_id = Number(req.params.receiver_id);

  console.log(sender_id, receiver_id);

  if (!sender_id || !receiver_id) {
    return res
      .status(400)
      .json({ message: "Missing sender_id or receiver_id" });
  }

  try {
    const [rows] = await pool.query(
      `SELECT * FROM messages 
       WHERE (sender_id = ? AND receiver_id = ?) 
          OR (sender_id = ? AND receiver_id = ?)
       ORDER BY timesent ASC`,
      [sender_id, receiver_id, receiver_id, sender_id]
    );

    res
      .status(200)
      .json({ message: "Messages retrieved successfully", messages: rows });
  } catch (err) {
    console.error("Error getting messages:", err);
    res.status(500).json({ message: "Error retrieving messages" });
  }
};


export const getPreviousMessagesProfiles = async (
  req: Request,
  res: Response
) => {
  const user_id = Number(req.params.user_id);

  if (isNaN(user_id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const [rows] = await pool.query(
      `
      SELECT
        m.message_id,
        m.sender_id,
        m.receiver_id,
        m.message,
        m.timesent,
        u.user_id,
        u.fullname,
        u.profile_picture
      FROM (
          SELECT *,
                 ROW_NUMBER() OVER (
                     PARTITION BY LEAST(sender_id, receiver_id), GREATEST(sender_id, receiver_id)
                     ORDER BY timesent DESC
                 ) AS rn
          FROM messages
          WHERE sender_id = ? OR receiver_id = ?
      ) m
      JOIN users u ON u.user_id = CASE
          WHEN m.sender_id = ? THEN m.receiver_id
          ELSE m.sender_id
      END
      WHERE m.rn = 1
      ORDER BY m.timesent DESC;
      `,
      [user_id, user_id, user_id]
    );

    return res.status(200).json({
      message: "Previous message profiles retrieved successfully",
      profiles: rows,
    });
  } catch (err) {
    console.error("Error getting previous message profiles:", err);
    return res
      .status(500)
      .json({ message: "Error retrieving previous message profiles" });
  }
};
