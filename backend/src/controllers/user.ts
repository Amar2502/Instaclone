import { pool } from "../config/db";
import { Request, Response } from "express";
import { hashPassword, comparePassword } from "../utils/hash";
import config from "../config/config";
import jwt from "jsonwebtoken";
import { RowDataPacket } from "mysql2";

interface RegisterUserRequest {
    email: string;
    password: string;
    fullName: string;
    username: string;
    date_of_birth: string;
  }

interface LoginUserRequest {
  email: string;
  password: string;
}

interface User extends RowDataPacket {
  user_id: number;
  username: string;
  profile_picture: string;
  fullName: string;
  email: string;
  password: string;
  bio: string;
  created_at: Date;
  date_of_birth: Date;
  followers: number;
  followings: number;
  posts: number;
  
}

export const registerUser = async (req: Request, res: Response) => {
  const { email, password, fullName, username, date_of_birth } = req.body as RegisterUserRequest;

  try {
    const [existingUser] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if ((existingUser as any[]).length > 0) {
      return res.status(400).json({ message: "Email already exists", problem: "email" });
    }

    const [usernameExists] = await pool.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if ((usernameExists as any[]).length > 0) {
      return res.status(400).json({ message: "Username already exists", problem: "username" });
    }

    // const hashedPassword = await hashPassword(password);

    const [insertResult]: any = await pool.query(
      "INSERT INTO users (email, password, fullName, username, date_of_birth) VALUES (?, ?, ?, ?, ?)",
      [email, password, fullName, username, date_of_birth]
    );

    // ✅ Fetch the newly inserted user
    const [newUser] = await pool.query<User[]>(
      "SELECT * FROM users WHERE user_id = ?",
      [insertResult.insertId]
    );

    // ✅ Create JWT token
    const token = jwt.sign(
      { user_id: newUser[0].user_id, username: newUser[0].username, email: newUser[0].email },
      config.JWT_SECRET,
      { expiresIn: "30d" }
    );

    // ✅ Set token cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(201).json({ message: "User registered and logged in", user: newUser[0], token });

  } catch (error) {
    console.error("❌ Error registering user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const {email, password} = req.body as LoginUserRequest;

  try {

    const [rows, fields] = await pool.query<User[]>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if(rows.length==0) {
      return res.status(400).json({ message: "User does not exist", problem: "identifier" });
    }

    const isMatch = password === rows[0].password;

    if(!isMatch) {
      return res.status(400).json({ message: "Password is not correct", problem: "password" });
    }

    const token = jwt.sign(
      { user_id: rows[0].user_id, username: rows[0].username, email: rows[0].email},
      config.JWT_SECRET,
      {expiresIn: "30d"}
    )

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
    })

    res.status(201).json({ message: "User logined successfully", user: rows[0], token: token});

  } catch (error) {
    return res.status(400).json({ message: "Internal Server Error" });
  } 
}

export const getUserByUsername = async (req: Request, res: Response) => {
  const { username } = req.params;
  const { author_id } = req.query;

  try {
    const [rows]: any = await pool.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    let isFollowing = [];

    if (author_id) {
      const [followRows]: any = await pool.query(
        'SELECT * FROM followers WHERE follower_id = ? AND following_id = ?',
        [author_id, rows[0].user_id]
      );
      isFollowing = followRows;
    }

    const publicUser = {
      user_id: rows[0].user_id,
      username: rows[0].username,
      profile_picture: rows[0].profile_picture,
      fullName: rows[0].fullname,
      bio: rows[0].bio,
      followers: rows[0].followers,
      followings: rows[0].followings,
      posts: rows[0].posts,
      isFollowing: isFollowing.length > 0,
    };

    return res.status(200).json({ user: publicUser });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getSomeAccounts = async (req: Request, res: Response) => {
  const { username } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT user_id, username, profile_picture, fullname 
       FROM users 
       WHERE username != ? 
       ORDER BY RAND() 
       LIMIT 8`,
      [username]
    );

    return res.status(200).json({ accounts: rows });
  } catch (error) {
    console.error('Error fetching random accounts:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const connectedToUsers = async (req: Request, res: Response) => {
  const { user_id } = req.params;

  if (!user_id) {
    return res.status(400).json({ message: "Missing user_id parameter" });
  }

  try {
    // Step 1: Get follower IDs for the current user
    const [rows] = await pool.query(
      "SELECT following_id FROM followers WHERE follower_id = ? UNION SELECT following_id FROM followers WHERE follower_id = ?",
      [user_id, user_id]
    );

    const followingIds = (rows as any[]).map(row => row.following_id);

    if (followingIds.length === 0) {
      return res.status(200).json([]); // No followers
    }

    // Step 2: Get user data of all followers
    const [usersData] = await pool.query(
      "SELECT user_id, username, profile_picture, fullname FROM users WHERE user_id IN (?)",
      [followingIds]
    );

    return res.status(200).json(usersData);
  } catch (error) {
    console.error("❌ Error getting followings:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export const getUserById = async (req: Request, res: Response) => {
  const { user_id } = req.params;

  if (!user_id) {
    return res.status(400).json({ message: "Missing user_id parameter" });
  }

  try {
    const [usersData] = await pool.query<User[]>(
      "SELECT user_id, username, profile_picture, fullname FROM users WHERE user_id = ?",
      [user_id]
    );

    return res.status(200).json(usersData[0]);
  } catch (error) {
    console.error("❌ Error getting user by id:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}