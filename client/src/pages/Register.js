import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setpasswordConfirmation] = useState("");

  //Register user request - redirect to login on success
  async function registerUser(event) {
    event.preventDefault();

    // elements for client-side form-validation
    const elementErrors = document.getElementById("errors");
    const elementFirstname = document.getElementById("firstname");
    const elementLastname = document.getElementById("lastname");
    const elementEmail = document.getElementById("email");
    const elementPassword = document.getElementById("password");
    const elementConfirmPassword = document.getElementById("confirmPassword");

    let messages = [];
    elementErrors.innerText = "";

    if (elementPassword.value.length < 5) {
      messages.push("Password must be atleast 5 characters long");
      elementPassword.focus();
    }
    if (elementConfirmPassword.value !== elementPassword.value) {
      messages.push("Confirm password does not match password");
      elementConfirmPassword.focus();
    }

    if (elementFirstname.value.length < 2) {
      messages.push("Firstname must be atleast 2 characters long");
      elementFirstname.focus();
    }

    if (elementLastname.value.length < 2) {
      messages.push("Lastname must be atleast 2 characters long");
      elementLastname.focus();
    }

    if (messages.length > 0) {
      elementErrors.innerText = messages.join("\r\n");
      return false;
    }

    const response = await fetch("http://localhost:1337/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstname,
        lastname,
        email,
        password,
        passwordConfirmation,
      }),
    });
    const data = await response.json();
    if (data["success"]) {
      alert("Registration successful");
      navigate("/login");
    } else {
      alert(data["error"]);
      elementEmail.focus();
    }
  }

  return (
    <div>
      <h1>Register</h1>
      <h2>Join today and get 100 Bamboo dollars for free!</h2>
      <div id="errors"></div>
      <form onSubmit={registerUser}>
        <input
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          type="text"
          placeholder="First Name"
          id="firstname"
          required
        />
        <input
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          type="text"
          placeholder="Last Name"
          id="lastname"
          required
        />
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
        <input
          value={passwordConfirmation}
          onChange={(e) => setpasswordConfirmation(e.target.value)}
          type="password"
          placeholder="Confirm Password"
          id="confirmPassword"
          required
        />
        <input type="submit" value="Register" />
      </form>
    </div>
  );
}

export default Register;
