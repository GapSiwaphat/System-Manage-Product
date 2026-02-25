// routes/orderRoutes.js
import express from "express";
import db from "../config/connectDB.js";
import { generatePdfInvoice } from "../routes/genPDF.js"; 

const router = express.Router();

// GET all orders
router.get("/", async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT 
        o.id,
        o.customer_id,
        c.name AS customer_name,
        c.phone AS customer_phone,
        o.total_price,
        o.status,
        o.payment_method,
        o.created_at
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      ORDER BY o.created_at DESC
    `);
    res.json({ success: true, data: orders });
  } catch (err) {
    console.error("Fetch orders error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single order
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const [order] = await db.query(
      `SELECT 
        o.id,
        o.total_price,
        o.status,
        o.payment_method,
        o.created_at,
        c.name AS customer_name 
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      WHERE o.id = ?`,
      [id]
    );

    if (order.length === 0) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    res.json({ success: true, data: order[0] });
  } catch (err) {
    console.error("Fetch single order error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET order items
router.get("/:id/items", async (req, res) => {
  const id = req.params.id;
  try {
    const [items] = await db.query(
      `SELECT 
        oi.id,
        oi.quantity,
        oi.price, 
        p.name AS product_name,
        p.image_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?`,
      [id]
    );

    res.json({ success: true, data: items });
  } catch (err) {
    console.error("Fetch order items error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Generate PDF Invoice
router.get("/:id/generate-pdf", async (req, res) => {
  const orderId = req.params.id;
  
  try {
    // ดึงข้อมูล Order
    const [[order]] = await db.query(
      `SELECT 
        o.id,
        o.created_at,
        o.total_price,
        o.payment_method,
        c.name AS customer_name
       FROM orders o 
       JOIN customers c ON o.customer_id = c.id 
       WHERE o.id = ?`,
      [orderId]
    );
    if (!order) return res.status(404).json({ success: false, error: "Order not found" });

    // Items
    const [items] = await db.query(
      `SELECT 
        oi.quantity,
        oi.price, 
        p.name AS product_name 
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = ?`,
      [orderId]
    );

    generatePdfInvoice(order, items, res);

  } catch (err) {
    console.error("Generate PDF error:", err);
    res.status(500).json({ success: false, error: "Failed to generate PDF invoice." });
  }
});

// POST create new order
router.post("/", async (req, res) => {
  const { customer_id, total_price, status, payment_method } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO orders (customer_id, total_price, status, payment_method) VALUES (?, ?, ?, ?)",
      [customer_id, total_price, status || "pending", payment_method || "cash"]
    );
    const [newOrder] = await db.query(
      `SELECT 
        o.id,
        o.customer_id,
        c.name AS customer_name,
        o.total_price,
        o.status,
        o.payment_method,
        o.created_at
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      WHERE o.id = ?`,
      [result.insertId]
    );
    res.json({ success: true, data: newOrder[0] });
  } catch (err) {
    console.error("Add order error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT update order status
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;

  try {
    const [result] = await db.query(
      "UPDATE orders SET status = ? WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Status updated successfully" });
  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE order
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  let connection; 

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();
    await connection.query("DELETE FROM order_items WHERE order_id = ?", [id]);
    const [result] = await connection.query("DELETE FROM orders WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      await connection.rollback(); 
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    await connection.commit();
    res.json({ success: true, message: "Order and related items deleted successfully" });

  } catch (err) {
    if (connection) {
      await connection.rollback();
    }
    console.error("Delete order error (Transaction rolled back):", err);
    res.status(500).json({ success: false, error: "Failed to delete order due to server error." });
  } finally {
    if (connection) {
      connection.release(); 
    }
  }
});

export default router;