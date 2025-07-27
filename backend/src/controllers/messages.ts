import { Request, Response } from 'express';
import { pool } from '../config/db';

export const sendMessages = async (req: Request, res: Response) => {
  const { sender_id, receiver_id, message } = req.body;

  try {
    await pool.query(
      'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
      [sender_id, receiver_id, message]
    );

    res.status(200).json({ message: 'Message sent successfully' });
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ message: 'Error sending message' });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  const sender_id = Number(req.params.sender_id);
  const receiver_id = Number(req.params.receiver_id);

  console.log(sender_id, receiver_id);

  if (!sender_id || !receiver_id) {
    return res.status(400).json({ message: 'Missing sender_id or receiver_id' });
  }

  try {
    const [rows] = await pool.query(
      `SELECT * FROM messages 
       WHERE (sender_id = ? AND receiver_id = ?) 
          OR (sender_id = ? AND receiver_id = ?)
       ORDER BY timesent ASC`,
      [sender_id, receiver_id, receiver_id, sender_id]
    );

    res.status(200).json({ message: 'Messages retrieved successfully', messages: rows });
  } catch (err) {
    console.error('Error getting messages:', err);
    res.status(500).json({ message: 'Error retrieving messages' });
  }
};
