import React, { useState, useEffect } from "react";
import "./Login.css";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../../../slices/userAPISlices.js";
import { setCredentials } from "../../../slices/userSlices.js";
import { useNavigate } from "react-router-dom";
import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(eyeOff);

  const [login] = useLoginMutation();
  const [isChecked, setIsChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ username, password }).unwrap();
      if (isChecked) {
        dispatch(setCredentials({ ...res }));
      }
      setIsLoggedIn(true);
      sessionStorage.setItem("isLoggedIn", isLoggedIn);
      sessionStorage.setItem("userInfo", JSON.stringify(res.user));

      navigate("/home");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleToggle = async (e) => {
    if (type === "password") {
      setIcon(eye);
      setType("text");
    } else {
      setIcon(eyeOff);
      setType("password");
    }
  };

  const onChangeCheckbox = (e) => {
    setIsChecked({
      isChecked: e.target.checked,
    });
  };

  return (
    <>
      <div className="auth-container">
        <form className="register-form" onSubmit={submitHandler}>
          <h1>Login</h1>

          <div className="formInput">
            <label>Username</label>
            <input
              type="text"
              placeholder="Username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="formInput-password">
            <label>Password</label>
            <div className="passwordInput">
              <input
                type={type}
                placeholder="Password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="span-eye" onClick={handleToggle}>
                <Icon className="absolute mr-10" icon={icon} size={23} />
              </span>
            </div>
          </div>

          <button type="submit" className="btn-grad">
            Log In
          </button>

          <div className="chkboxContainer">
            <input
              type="checkbox"
              id="chkRememberMe"
              name="chkRememberMe"
              value={isChecked}
              onChange={onChangeCheckbox}
            />
            <label className="rememberMe" htmlFor="chkRememberMe">
              Keep me login
            </label>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
