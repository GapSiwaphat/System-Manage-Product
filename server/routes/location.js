import express from "express";
import db from "../config/connectDB.js";

const router = express.Router();

// GET all locations
router.get('/', async (req, res) => {
    try {
        const [locations] = await db.query('SELECT * FROM locations ORDER BY created_at DESC');
        res.json({ success: true, data: locations });

    }catch (err) {
        console.error("Fetch locations error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Create new location
router.post('/', async (req, res) => {
    const { name, description } = req.body;

    if (!name || !description) {
        return res.status(400).json({ success: false, message: "Name and description are required." });
    }

    try {
        const [result] = await db.query('INSERT INTO locations (name, description) VALUES (?, ?)', [name, description]);

        res.status(201).json({
            success: true,
            message: "Location created successfully.",
            locationId: result.insertId
        })

    }catch (err) {
        console.error("Create location error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
})

//Edit location by ID
router.put('/:id', async (req, res) => {
    const locationId = req.params.id;
    const { name, description } = req.body;
    
    if (!name || !description) {
        return res.status(400).json({ success: false, message: "Name and description are required." });
    }

    try {
        const [result] = await db.query('UPDATE locations SET name = ?, description = ? WHERE id = ?', [name, description, locationId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Location not found." });
        }
        
        res.json({ success: true, message: "Location updated successfully." });

    }catch (err) {
        console.error("Update location error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});


router.get('/:id', async (req, res) => {
    const locationId = req.params.id;

    try {
        const [rows] = await db.query('SELECT * FROM locations WHERE id = ?', [locationId]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Location not found" });
        }

        res.json({ success: true, data: rows[0] });

    } catch (err) {
        console.error("Fetch single location error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});


// Delete location by ID
router.delete('/:id', async (req, res) => {
    const locationId = req.params.id;
    
    try {
        const [result] = await db.query('DELETE FROM locations WHERE id = ?', [locationId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Location not found." });
        }

        res.json({ success: true, message: "Location deleted successfully." });

    }catch (err) {
        console.error("Delete location error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});


export default router;