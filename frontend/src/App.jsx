import { useState } from "react";
import "./App.css";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({
    username: "",
    password: "",
    general: "",
  });

  const handleLogin = async () => {
    // Validasi input sebelum melakukan request
    if (!username) {
      setError((prevError) => ({
        ...prevError,
        username: "Username harus diisi",
      }));
      return;
    }

    if (!password) {
      setError((prevError) => ({
        ...prevError,
        password: "Password harus diisi",
      }));
      return;
    }

    try {
      // Reset pesan error saat melakukan request
      setError({ username: "", password: "", general: "" });

      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login berhasil, lakukan navigasi atau tindakan selanjutnya
        console.log("Login berhasil:", data);
        localStorage.setItem("id_artist", data.user.id_artist)
        navigate("/prediksi");
      } else {
        // Login gagal, tampilkan pesan kesalahan
        console.error("Login gagal:", data.message);
        setError((prevError) => ({
          ...prevError,
          general: "Username atau password salah",
        }));
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error.message);
    }
  };

  // Handle change event untuk menghapus pesan kesalahan saat input berubah
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setError((prevError) => ({ ...prevError, username: "" }));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError((prevError) => ({ ...prevError, password: "" }));
  };

  return (
    <div className="h-screen w-screen flex">
      <div className="w-7/12 flex flex-col gap-3 items-center p-5 content-center">
        <div className="w-full ml-0 items-start flex content-start">
          <img src="/image/logo.svg" alt="" className="" />
        </div>

        <div className="h-full flex justify-center items-center mb-28">
          <img src="/image/Saly-10.png" alt="" className="" />
        </div>
      </div>
      <div className="w-5/12 flex flex-col gap-3 items-center">
        <div className="h-full flex justify-center items-center">
          <div className="card max-w-md w-screen shadow-2xl bg-base-100">
            <form className="card-body p-0 mt-7 mb-7">
              <p className="text-left">Welcome!</p>
              <p className="text-left font-bold text-3xl pt-5 pb-5">Login</p>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Username</span>
                </label>
                <input
                  type="username"
                  placeholder="Masukan username"
                  className={`input input-bordered ${
                    error.username ? "input-error" : ""
                  }`}
                  value={username}
                  onChange={handleUsernameChange}
                  required
                />
                {error.username && (
                  <p className="text-xs text-error">{error.username}</p>
                )}
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="Masukan password"
                  className={`input input-bordered ${
                    error.password ? "input-error" : ""
                  }`}
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
                {error.password && (
                  <p className="text-xs text-error">{error.password}</p>
                )}
              </div>
              <div className="form-control mt-6">
                <button
                  type="button"
                  onClick={handleLogin}
                  className="btn btn-primary"
                >
                  Login
                </button>
              </div>
              {error.general && (
                <p className="text-xs text-error">{error.general}</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
