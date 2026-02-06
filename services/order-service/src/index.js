const express = require("express");
const orderRoutes = require("./routes/order.routes");

const app = express();
const PORT = 5002;

app.use(express.json());

app.get("/orders/health", (req, res) => {
  res.json({ status: "order service running" });
});

app.use("/orders", orderRoutes);

app.listen(PORT, () => {
  console.log(`Order service running on port ${PORT}`);
});
