import express from "express";
import db from "../config/connectDB.js";
import bcrypt from "bcrypt";       
import jwt from "jsonwebtoken";    
import Swal from 'sweetalert2';  

const router = express.Router();

const JWT_SECRET = 'your_jwt_secret_key';

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  
    if(rows.length === 0) {
      return res.status(401).json({ success: false, message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง!" });
    }
    
    const user = rows[0]; 
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง!" });
    }

    const payload = { id: user.id, email: user.email };

    jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) {
          console.error("JWT sign error:", err);
          return res.status(500).json({ success: false, message: 'Token creation failed.' });
      }
      
      res.status(200).json({ 
        success: true, 
        msg: 'Login successful',
        token: token, 
        user: { 
            id: user.id, 
            name: user.name, 
            email: user.email, 
            role: user.role  
        }
      }); 
    });
  } catch (err) {
      console.error("Login database or bcrypt error:", err);
      res.status(500).json({ success: false, message: "Internal Server Error." });
  }
});

// POST register new user
const saltRounds = 10;
router.post("/register", async (req, res) => {
    const { name, email, password, role } = req.body;
    
    try {
        const [existingUsers] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ success: false, message: "Email already exists." });
        }

        // Hash รหัสผ่าน
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // บันทึกผู้ใช้ลง DB
        const [result] = await db.query(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
            [name, email, hashedPassword, role || 'User'] // กำหนด role เป็น 'User' เป็นค่าเริ่มต้น
        );
        
        res.status(201).json({ 
            success: true, 
            message: "สมัครสมาชิกสำเร็จ.",
            userId: result.insertId
        });

    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ success: false, message: "Internal Server Error during registration." });
    }
});

// GET all users
router.get("/", async (req, res) => {
  try {
    const [users] = await db.query("SELECT id, name, email, role FROM users");
    console.log("users", JSON.stringify(users, null, 2));
    res.json({ success: true, data: users });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST add user
router.post("/", async (req, res) => {
  const { name, email, role } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO users (name, email, role) VALUES (?, ?, ?)",
      [name, email, role]
    );
    const [newUser] = await db.query(
      "SELECT id, name, email, role FROM users WHERE id = ?",
      [result.insertId]
    );
    res.json({ success: true, data: newUser[0] });
  } catch (err) {
    console.error("Add user error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT update user
router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email, role } = req.body;
  try {
    await db.query(
      "UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?",
      [name, email, role, id]
    );
    const [updatedUser] = await db.query(
      "SELECT id, name, email, role FROM users WHERE id = ?",
      [id]
    );
    res.json({ success: true, data: updatedUser[0] });
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE user
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await db.query("DELETE FROM users WHERE id = ?", [id]);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;