import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Welcome to Dynamic Report Dashboard</h1>
      <Link to="/reports">
        <button>Go to Reports</button>
      </Link>
    </div>
  );
};

export default Home;
