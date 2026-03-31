const express = require("express");
const router = express.Router();
const db = require("../config/db");
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");

router.get("/faculties", verifyToken, (req, res) => {
  const query = `
    SELECT 
      f.*,
      ROUND(AVG(fb.rating), 1) AS average_rating,
      COUNT(fb.id) AS total_reviews
    FROM faculties f
    LEFT JOIN feedback fb ON f.id = fb.faculty_id
    GROUP BY f.id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Database error" });
    }

    res.json(results);
  });
});

router.post("/faculties", verifyToken, verifyAdmin, (req, res) => {
  const { name, department } = req.body;

  if (!name || !department) {
    return res.status(400).json({ message: "Name and department are required" });
  }

  const query = "INSERT INTO faculties (name, department) VALUES (?, ?)";

  db.query(query, [name, department], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Database error" });
    }

    res.status(201).json({ message: "Faculty added successfully" });
  });
});

router.get("/faculties/:id/feedback", verifyToken, (req, res) => {
  const faculty_id = req.params.id;

  const query = `
    SELECT fb.id, f.name, f.department, fb.rating, fb.comment
    FROM feedback fb
    JOIN faculties f ON fb.faculty_id = f.id
    WHERE f.id = ?
  `;

  db.query(query, [faculty_id], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    const totalRatings = results.length;
    const averageRating =
      results.reduce((sum, item) => sum + item.rating, 0) / totalRatings;

    res.json({
      faculty: {
        name: results[0].name,
        department: results[0].department,
      },
      totalFeedback: totalRatings,
      averageFeedback: averageRating.toFixed(2),
      feedback: results,
    });
  });
});

router.get("/admin/stats", verifyToken, verifyAdmin, (req, res) => {
  const statsQuery = `
    SELECT 
      (SELECT COUNT(*) FROM faculties) AS total_faculties,
      (SELECT COUNT(*) FROM feedback) AS total_feedback,
      (SELECT ROUND(AVG(rating),1) FROM feedback) AS avg_rating
  `;

  db.query(statsQuery, (err, statsResult) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Database error" });
    }

    const topRatedQuery = `
      SELECT f.name, ROUND(AVG(fb.rating),1) AS avg_rating
      FROM faculties f
      JOIN feedback fb ON f.id = fb.faculty_id
      GROUP BY f.id
      ORDER BY avg_rating DESC
      LIMIT 1
    `;

    db.query(topRatedQuery, (err, topResult) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Database error" });
      }

      const mostReviewedQuery = `
        SELECT f.name, COUNT(fb.id) AS total_reviews
        FROM faculties f
        JOIN feedback fb ON f.id = fb.faculty_id
        GROUP BY f.id
        ORDER BY total_reviews DESC
        LIMIT 1
      `;

      db.query(mostReviewedQuery, (err, reviewResult) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "Database error" });
        }

        res.json({
          stats: statsResult[0],
          topRated: topResult[0] || null,
          mostReviewed: reviewResult[0] || null,
        });
      });
    });
  });
});

module.exports = router;