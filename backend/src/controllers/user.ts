import { pool } from "../config/db";
import { Request, Response } from "express";
import { hashPassword } from "../utils/hash";

interface RegisterUserRequest {
    email: string;
    password: string;
    fullName: string;
    username: string;
    date_of_birth: string;
  }


export const registerUser = async (req: Request, res: Response) => {
    const { email, password, fullName, username, date_of_birth } = req.body as RegisterUserRequest;
    console.log(req.body);
  
    try {
      const [existingUser] = await pool.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );
  
      console.log("existingUser", existingUser);
  
      if ((existingUser as any[]).length > 0) {
        return res.status(400).json({ message: "Email already exists", problem: "email" });
      }
  
      console.log("email does not exixts");
      
  
      const [usernameExists] = await pool.query(
        "SELECT * FROM users WHERE username = ?",
        [username]
      );
  
      console.log(usernameExists);
      
      
      if((usernameExists as any[]).length > 0) {
        return res.status(400).json({ message: "Username already exists", problem: "username" });
      }
  
      console.log("username doesnt exists");
      
  
      const hashedPassword = await hashPassword(password);
  
      console.log("hashedPassword", hashedPassword);
  
      const newUser = await pool.query(
        "INSERT INTO users (email, password, fullName, username, date_of_birth) VALUES (?, ?, ?, ?, ?)",
        [email, hashedPassword, fullName, username, date_of_birth]
      );
  
      res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
      console.error("❌ Error registering user:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };