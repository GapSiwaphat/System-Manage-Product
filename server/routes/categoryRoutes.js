// routes/categoryRoutes.js
import express from "express";
import db from "../config/connectDB.js";

const router = express.Router();

// GET categories
router.get("/", async (req, res) => {
  console.log("GET /categories called");
  try {
    const [fetchcategories] = await db.query("SELECT id, name, description FROM categories;");
    res.json({ success: true, data: fetchcategories });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST categories
router.post("/", async (req, res) => {
  const { name, description } = req.body;

  try {
    const [insertResult] = await db.query(
      "INSERT INTO categories (name, description) VALUES (?, ?)",
      [name, description]
    );

    const [newCategory] = await db.query(
      "SELECT * FROM categories WHERE id = ?",
      [insertResult.insertId]
    );

    res.json({ success: true, category: newCategory[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT categories after edit
router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, description } = req.body;

  try {
    const [result] = await db.query(
      "UPDATE categories SET name = ?, description = ? WHERE id = ?",
      [name, description, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: "Category not found" });
    }

    const [updatedCategory] = await db.query(
      "SELECT id, name, description FROM categories WHERE id = ?",
      [id]
    );
    res.json({ success: true, category: updatedCategory[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE categories
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const [deleteCat] = await db.query("DELETE FROM categories WHERE id = ?", [id]);

    if (deleteCat.affectedRows === 0) {
      return res.status(404).json({ success: false, error: "Category not found" });
    }

    res.json({ success: true, message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;