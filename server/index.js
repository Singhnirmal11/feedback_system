if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const verifyToken = require("./middleware/verifyToken");
const verifyAdmin = require("./middleware/verifyAdmin");
const authRoutes = require("./routes/authRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://your-frontend-url.vercel.app"
    ],
    credentials: true,
  })
);

app.use(express.json());

app.use("/", authRoutes);
app.use("/", facultyRoutes);
app.use("/", feedbackRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/admin", verifyToken, verifyAdmin, (req, res) => {
  res.json({
    message: "Welcome Admin",
  });
});

app.get("/dashboard", verifyToken, (req, res) => {
  res.json({
    message: "Welcome to Dashboard",
    user: req.user,
  });
});

app.put("/feedback/:id", verifyToken, (req, res) => {
  const feedbackId = req.params.id;
  const { rating, comment } = req.body;
  const student_id = req.user.id;

  if (!rating) {
    return res.status(400).json({ message: "Rating is required" });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  const checkQuery = "SELECT * FROM feedback WHERE id=? AND student_id=?";

  db.query(checkQuery, [feedbackId, student_id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.length === 0) {
      return res.status(403).json({ message: "Unauthorized or feedback not found" });
    }

    const updateQuery = `
      UPDATE feedback
      SET rating=?, comment=?
      WHERE id=?
    `;

    db.query(updateQuery, [rating, comment, feedbackId], (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Database error" });
      }

      res.json({ message: "Feedback updated successfully" });
    });
  });
});

app.delete("/feedback/:id", verifyToken, (req, res) => {
  const feedbackId = req.params.id;
  const student_id = req.user.id;

  const checkQuery = "SELECT * FROM feedback WHERE id=? AND student_id=?";

  db.query(checkQuery, [feedbackId, student_id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.length === 0) {
      return res.status(403).json({ message: "Unauthorized or feedback not found" });
    }

    const deleteQuery = "DELETE FROM feedback WHERE id=?";

    db.query(deleteQuery, [feedbackId], (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Database error" });
      }

      res.json({ message: "Feedback deleted successfully" });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});