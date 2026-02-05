const express = require("express");

const app = express();
const PORT = 5000;

// middleware to parse JSON
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "auth service running" });
});

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
