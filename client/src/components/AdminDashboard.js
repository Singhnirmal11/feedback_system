import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function AdminDashboard() {
  const [data, setData] = useState(null);
  const [topRatedData, setTopRatedData] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchTopRated();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5001/admin/stats", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      const result = await response.json();

      if (response.ok) {
        setData(result);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching stats");
    }
  };

  const fetchTopRated = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5001/admin/top-rated", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      const result = await response.json();

      if (response.ok) {
        setTopRatedData(result);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching chart data");
    }
  };

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h2>Admin Dashboard</h2>

      <div className="admin-cards">
        <div className="admin-card">
          <h3>Total Faculties</h3>
          <p>{data.stats.total_faculties}</p>
        </div>

        <div className="admin-card">
          <h3>Total Feedback</h3>
          <p>{data.stats.total_feedback}</p>
        </div>

        <div className="admin-card">
          <h3>Average Rating</h3>
          <p>{data.stats.avg_rating || 0} ⭐</p>
        </div>
      </div>

      <div className="admin-insights">
        <h3>Top Rated Faculty</h3>
        <p>
          {data.topRated?.name || "N/A"} ({data.topRated?.avg_rating || 0} ⭐)
        </p>

        <h3>Most Reviewed Faculty</h3>
        <p>
          {data.mostReviewed?.name || "N/A"} (
          {data.mostReviewed?.total_reviews || 0} reviews)
        </p>
      </div>

      <div className="chart-container">
        <h3>Top 5 Faculty by Average Rating</h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topRatedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-20} textAnchor="end" interval={0} height={80} />
            <YAxis domain={[0, 5]} />
            <Tooltip />
            <Bar dataKey="avg_rating" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AdminDashboard;