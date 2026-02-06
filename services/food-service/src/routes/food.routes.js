const express = require("express");
const pool = require("../db");
const auth = require("../middleware/auth");
const { randomUUID } = require("crypto");

const router = express.Router();

/**
 * POST /food
 * Vendor only
 */
router.post("/", auth("vendor"), async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Food name required" });
  }

  const id = randomUUID();

  await pool.query("INSERT INTO foods (id, name) VALUES ($1, $2)", [id, name]);

  res.status(201).json({ id, name });
});

/**
 * GET /food
 * Customer & Vendor
 */
router.get("/", auth(), async (req, res) => {
  const result = await pool.query(
    "SELECT id, name FROM foods ORDER BY created_at DESC"
  );

  res.json(result.rows);
});

module.exports = router;
