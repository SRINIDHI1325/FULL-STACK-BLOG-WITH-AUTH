import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <nav style={{ background: "#333", color: "#fff", padding: "1rem" }}>
      <div style={{ maxWidth: 1000, margin: "auto", display: "flex", gap: 12 }}>
        <Link to="/" style={{ color: "#fff" }}>
          Home
        </Link>
        <Link to="/create" style={{ color: "#fff" }}>
          Create Post
        </Link>
        <Link to="/my-posts" style={{ color: "#fff" }}>
          My Posts
        </Link>
        <div style={{ marginLeft: "auto" }}>
          {token ? (
            <button onClick={logout}>Logout</button>
          ) : (
            <>
              <Link to="/login" style={{ color: "#fff", marginRight: 8 }}>
                Login
              </Link>
              <Link to="/register" style={{ color: "#fff" }}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
