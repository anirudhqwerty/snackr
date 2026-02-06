const express = require("express");
const pool = require("../db");
const auth = require("../middleware/auth");
const { randomUUID } = require("crypto");

const router = express.Router();

/**
 * POST /orders
 * Customer only
 */
router.post("/", auth("customer"), async (req, res) => {
  const { foodId } = req.body;

  if (!foodId) {
    return res.status(400).json({ error: "foodId required" });
  }

  const id = randomUUID();

  await pool.query(
    "INSERT INTO orders (id, food_id, status) VALUES ($1, $2, 'pending')",
    [id, foodId]
  );

  res.status(201).json({ id, foodId, status: "pending" });
});

/**
 * GET /orders
 * Delivery only
 */
router.get("/", auth("delivery"), async (req, res) => {
  const result = await pool.query(
    "SELECT id, food_id AS \"foodId\", status FROM orders ORDER BY created_at DESC"
  );

  res.json(result.rows);
});

/**
 * PATCH /orders/:id/pick
 * Delivery only
 */
router.patch("/:id/pick", auth("delivery"), async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    "UPDATE orders SET status = 'picked' WHERE id = $1 AND status = 'pending' RETURNING id, food_id AS \"foodId\", status",
    [id]
  );

  if (result.rowCount === 0) {
    return res.status(400).json({ error: "Invalid transition" });
  }

  res.json(result.rows[0]);
});

/**
 * PATCH /orders/:id/deliver
 * Delivery only
 */
router.patch("/:id/deliver", auth("delivery"), async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    "UPDATE orders SET status = 'delivered' WHERE id = $1 AND status = 'picked' RETURNING id, food_id AS \"foodId\", status",
    [id]
  );

  if (result.rowCount === 0) {
    return res.status(400).json({ error: "Invalid transition" });
  }

  res.json(result.rows[0]);
});

module.exports = router;
