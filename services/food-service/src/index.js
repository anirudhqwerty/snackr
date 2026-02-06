const express = require("express");
const foodRoutes = require("./routes/food.routes");

const app = express();
const PORT = 5001;

app.use(express.json());

app.get("/food/health", (req, res) => {
  res.json({ status: "food service running" });
});

app.use("/food", foodRoutes);

app.listen(PORT, () => {
  console.log(`Food service running on port ${PORT}`);
});
