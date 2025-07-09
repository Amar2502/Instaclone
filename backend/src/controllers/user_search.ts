import { Request, Response } from "express";
import { pool } from "../config/db";

interface User {
  user_id: number;
  username: string;
  profile_picture: string;
  fullname: string;
}

export const searchUserbyLetters = async (req: Request, res: Response) => {
  const { query } = req.params;

  console.log(query);

  if (!query || query.length < 2) {
    return res.status(400).json({ message: "Query is required" });
  }

  console.log("query is not null and length is greater than 2");

  try {
    const [results] = await pool.query(
      `
      SELECT user_id, username, profile_picture, fullname,
        CASE
          WHEN username LIKE ? THEN 1
          WHEN fullname LIKE ? THEN 2
          WHEN username LIKE ? OR fullname LIKE ? THEN 3
          ELSE 4
        END AS priority
      FROM users
      WHERE username LIKE ? OR fullname LIKE ?
      ORDER BY priority ASC
      `,
      [
        `${query}%`,   // for username startsWith
        `${query}%`,   // for fullname startsWith
        `%${query}%`,  // for username contains
        `%${query}%`,  // for fullname contains
        `%${query}%`,  // WHERE clause match
        `%${query}%`,  // WHERE clause match
      ]
    );

    console.log(results);

    if ((results as User[]).length === 0) {
      return res.status(404).json({ message: "No accounts found" });
    }


    return res.status(200).json({ success: true, accounts: results });
  } catch (error) {
    console.error("Error in search route:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
