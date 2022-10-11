import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Post login request to sevrer - set jwt on success
  async function loginUser(event) {
    event.preventDefault();
    const elementErrors = document.getElementById("errors");
    elementErrors.innerText = "";
    const response = await fetch("http://localhost:1337/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const data = await response.json();
    if (data.success) {
      localStorage.setItem("token", data.user);
      alert("Login successful");
      navigate("/dashboard", { replace: true });
    } else {
      elementErrors.innerText =
        "Sorry, your email or password was incorrect. Please double-check your credentials.";
    }
  }

  return (
    <div>
      <h1>Login</h1>
      <div id="errors"></div>
      <form onSubmit={loginUser}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="JohnSmith@gmail.com"
          id="email"
          required
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          id="password"
          required
        />
        <input type="submit" value="Login" />
      </form>
    </div>
  );
}

export default Login;
