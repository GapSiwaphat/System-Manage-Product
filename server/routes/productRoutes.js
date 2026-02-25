import express from "express";
import multer from "multer";
import db from "../config/connectDB.js";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// GET products to table
router.get("/", async (req, res) => {
  const categoryId = req.query.category_id;

  try {
    let sqlQuery = `
      SELECT 
        p.id, 
        p.name, 
        p.description, 
        p.price, 
        p.quantity, 
        c.name AS category_name, 
        p.image_url 
      FROM products p 
      JOIN categories c ON p.category_id = c.id
    `;

    const queryParams = [];
    if (categoryId && categoryId !== "all") {
      sqlQuery += ` WHERE p.category_id = ?`;
      queryParams.push(categoryId);
    }

    const [product] = await db.query(sqlQuery, queryParams);
    res.json({ success: true, data: product });
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST products
router.post("/", upload.single("image"), async (req, res) => {
  console.log("Body:", req.body);
  console.log("File:", req.file);

  const { name, description, price, quantity, category_id } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const [insertResult] = await db.query(
      "INSERT INTO products (name, description, price, quantity, category_id, image_url) VALUES (?, ?, ?, ?, ?, ?)",
      [name, description, price, quantity, category_id, image_url]
    );

    const [newProduct] = await db.query(
      "SELECT * FROM products WHERE id = ?",
      [insertResult.insertId]
    );

    res.json({ success: true, product: newProduct[0] });
  } catch (err) {
    console.error("Insert error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT products with image
router.put("/:id", upload.single("image"), async (req, res) => {
  const id = parseInt(req.params.id);
  let { name, description, price, quantity, category_id } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    category_id = parseInt(category_id) || null;
    quantity = parseInt(quantity) || 0;

    let query = `UPDATE products SET name=?, description=?, price=?, quantity=?, category_id=?`;
    const params = [name, description, price, quantity, category_id];

    if (image_url) {
      query += `, image_url=?`;
      params.push(image_url);
    }

    query += ` WHERE id=?`;
    params.push(id);

    const [result] = await db.query(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }

    const [updatedProduct] = await db.query(
      `SELECT p.id, p.name, p.description, p.price, p.quantity, p.category_id, c.name AS category_name, p.image_url 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.id = ?`,
      [id]
    );

    res.json({ success: true, product: updatedProduct[0] });
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE products
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const [deleteProduct] = await db.query("DELETE FROM products WHERE id = ?", [id]);

    if (deleteProduct.affectedRows === 0) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;