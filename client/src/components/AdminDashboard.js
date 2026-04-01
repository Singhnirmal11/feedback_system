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

const API_URL = process.env.REACT_APP_API_URL;

function AdminDashboard() {
  const [data, setData] = useState(null);
  const [topRatedData, setTopRatedData] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchTopRated();
    fetchLeaderboard();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/admin/stats`, {
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
      toast.error("Error fetching stats");
    }
  };

  const fetchTopRated = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/admin/top-rated`, {
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
      toast.error("Error fetching chart data");
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/admin/leaderboard`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      const result = await response.json();

      if (response.ok) {
        setLeaderboard(result);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Error fetching leaderboard");
    }
  };

  if (!data) return <p>Loading...</p>;

  return (
    <div className="admin-dashboard-wrapper">
      <h2 className="dashboard-heading">📊 Admin Dashboard</h2>

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
            <XAxis
              dataKey="name"
              angle={-20}
              textAnchor="end"
              interval={0}
              height={80}
            />
            <YAxis domain={[0, 5]} />
            <Tooltip />
            <Bar dataKey="avg_rating" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="leaderboard-container">
        <h3>🏆 Faculty Leaderboard</h3>

        <div className="top-three-container">
          {leaderboard.slice(0, 3).map((faculty, index) => (
            <div className={`top-rank-card rank-${index + 1}`} key={index}>
              <h4>
                {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"} Rank #{index + 1}
              </h4>
              <p>
                <strong>{faculty.name}</strong>
              </p>
              <p>{faculty.department}</p>
              <p>{faculty.avg_rating} ⭐</p>
              <p>{faculty.total_reviews} reviews</p>
            </div>
          ))}
        </div>

        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Department</th>
              <th>Avg Rating</th>
              <th>Total Reviews</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((faculty, index) => (
              <tr key={index} className={index < 3 ? "highlight-row" : ""}>
                <td>
                  {index === 0
                    ? "🥇"
                    : index === 1
                    ? "🥈"
                    : index === 2
                    ? "🥉"
                    : `#${index + 1}`}
                </td>
                <td>{faculty.name}</td>
                <td>{faculty.department}</td>
                <td>{faculty.avg_rating} ⭐</td>
                <td>{faculty.total_reviews}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;