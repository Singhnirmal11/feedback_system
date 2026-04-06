import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

function FacultyList() {
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [faculties, setFaculties] = useState([]);
  const [facultyFeedback, setFacultyFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [designationFilter, setDesignationFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [sortOption, setSortOption] = useState("default");

  const [currentPage, setCurrentPage] = useState(1);
  const facultiesPerPage = 10;

  useEffect(() => {
    fetchFaculties();
  }, []);

  const fetchFaculties = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/faculties`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      const data = await response.json();
      setFaculties(data);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching faculties");
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      const url = editingId
        ? `${API_URL}/feedback/${editingId}`
        : `${API_URL}/feedback`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          faculty_id: selectedFaculty.id,
          rating: rating,
          comment: comment,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          editingId
            ? "Feedback updated successfully"
            : "Feedback submitted successfully"
        );
        setRating("");
        setComment("");
        setEditingId(null);
        fetchFeedback(selectedFaculty.id);
        fetchFaculties();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const fetchFeedback = async (facultyId) => {
    try {
      setLoading(true);
      setFacultyFeedback(null);

      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/faculties/${facultyId}/feedback`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setFacultyFeedback(data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching feedback");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/feedback/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Feedback deleted successfully");
        fetchFeedback(selectedFaculty.id);
        fetchFaculties();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const handleEdit = (item) => {
    setRating(item.rating);
    setComment(item.comment);
    setEditingId(item.id);
  };

  const filteredFaculties = faculties.filter((faculty) => {
    const matchesSearch =
      faculty.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.department?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDesignation =
      designationFilter === "All" ||
      faculty.designation
        ?.toLowerCase()
        .includes(designationFilter.toLowerCase());

    return matchesSearch && matchesDesignation;
  });

  const sortedFaculties = [...filteredFaculties].sort((a, b) => {
    if (sortOption === "name-asc") {
      return a.name.localeCompare(b.name);
    }

    if (sortOption === "rating-high") {
      return (b.average_rating || 0) - (a.average_rating || 0);
    }

    if (sortOption === "rating-low") {
      return (a.average_rating || 0) - (b.average_rating || 0);
    }

    if (sortOption === "reviews-high") {
      return (b.total_reviews || 0) - (a.total_reviews || 0);
    }

    return 0;
  });

  const totalPages = Math.ceil(sortedFaculties.length / facultiesPerPage);
  const startIndex = (currentPage - 1) * facultiesPerPage;
  const endIndex = startIndex + facultiesPerPage;
  const currentFaculties = sortedFaculties.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, designationFilter, sortOption]);

  return (
    <div>
      <h2>Faculty List</h2>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by name, designation, department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select
          value={designationFilter}
          onChange={(e) => setDesignationFilter(e.target.value)}
          className="filter-select"
        >
          <option value="All">All Designations</option>
          <option value="Professor">Professor</option>
          <option value="Associate Professor">Associate Professor</option>
          <option value="Assistant Professor">Assistant Professor</option>
        </select>

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="filter-select"
        >
          <option value="default">Sort By</option>
          <option value="name-asc">Name A-Z</option>
          <option value="rating-high">Highest Rated</option>
          <option value="rating-low">Lowest Rated</option>
          <option value="reviews-high">Most Reviewed</option>
        </select>
      </div>

      <p className="results-count">
        <b>Total Faculties Found:</b> {sortedFaculties.length}
      </p>

      <div className="faculty-grid">
        {currentFaculties.map((faculty) => (
          <div className="faculty-card" key={faculty.id}>
            <h3>{faculty.name}</h3>

            <div className="designation-badge">{faculty.designation}</div>

            <p className="rating-summary">
              {faculty.average_rating || 0} ⭐ ({faculty.total_reviews || 0} reviews)
            </p>

            <p>
              <b>Department:</b> {faculty.department}
            </p>
            <p>
              <b>Email:</b> {faculty.email}
            </p>
            <p>
              <b>Mobile:</b> {faculty.mobile_no}
            </p>

            <button
              onClick={() => {
                setSelectedFaculty(faculty);
                setFacultyFeedback(null);
                setRating("");
                setComment("");
                setEditingId(null);
              }}
            >
              Give Feedback
            </button>

            <button
              onClick={() => {
                setSelectedFaculty(faculty);
                setRating("");
                setComment("");
                setEditingId(null);
                fetchFeedback(faculty.id);
              }}
            >
              View Feedback
            </button>

            {selectedFaculty?.id === faculty.id && (
              <div className="feedback-box">
                <h3>Feedback for {selectedFaculty.name}</h3>

                <input
                  type="number"
                  placeholder="Rating (1-5)"
                  value={rating}
                  min="1"
                  max="5"
                  onChange={(e) => setRating(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="Comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />

                <button onClick={handleSubmit}>
                  {editingId ? "Update Feedback" : "Submit Feedback"}
                </button>
              </div>
            )}

            {loading && selectedFaculty?.id === faculty.id && (
              <p className="loading-text">Loading...</p>
            )}

            {facultyFeedback && selectedFaculty?.id === faculty.id && (
              <div className="feedback-display">
                <h3>{facultyFeedback.faculty.name}</h3>
                <p>
                  <b>Average Rating:</b> {facultyFeedback.averageFeedback}
                </p>
                <p>
                  <b>Total Feedback:</b> {facultyFeedback.totalFeedback}
                </p>

                {facultyFeedback.feedback.map((item) => (
                  <div className="feedback-item" key={item.id}>
                    <p>
                      <b>Rating:</b> {item.rating} ⭐
                    </p>
                    <p>
                      <b>Comment:</b> {item.comment}
                    </p>
                    <p>
                      <b>Sentiment:</b>{" "}
                      {item.sentiment === "Positive"
                        ? "Positive 😊"
                        : item.sentiment === "Negative"
                        ? "Negative 😕"
                        : "Neutral 😐"}
                    </p>

                    <button onClick={() => handleEdit(item)}>Edit</button>
                    <button onClick={() => handleDelete(item.id)}>
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="pagination">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default FacultyList;