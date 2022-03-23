/**
 * FlowBack was created and project lead by Loke Hagberg. The design was
 * made by Lina Forsberg. Emilio Müller helped constructing Flowback.
 * Astroneatech created the code. It was primarily financed by David
 * Madsen. It is a decision making platform.
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see https://www.gnu.org/licenses/.
*/

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Textbox } from "../common";
import { isNotEmpty, isEmpty } from "../../utils/validate";
import { getLocalStorage, setLocalStorage } from "../../utils/localStorage";
import { postRequest } from "../../utils/API";
import { inputKeyValue, onValidation } from "../../utils/common";
import { loginUser } from "../../store/actions/auth";
import Loader from "../common/Loader/Loader";
import ResetPassword from "./ResetPassword";

const initialState = {
  email: "",
  password: "",
  rememberMe: false,
};
const initialError = {
  email: "",
  password: "",
};
export default function LoginCard() {
  const [state, setState] = useState(initialState);
  const [formValid, setFormValid] = useState(true);
  const [error, setError] = useState(initialError);
  const [loading, setLoading] = useState(false);
  const [displayedMessege, setdisplayedMessege] = useState({messege:"", color:""});
  const [forgotPassword, setForgotPassword] = useState(false)
  const { email, password, rememberMe } = state;
  const dispatch = useDispatch();
  let history = useHistory();

  useEffect(() => {
    const login = getLocalStorage("loginUser");
    if (!isEmpty(login)) {
      history.push("home");
    }
    const rememberMe = getLocalStorage("rememberMe");
    const username = rememberMe ? getLocalStorage("user") : email;
    setState({ ...state, email: username, rememberMe });
  }, []);

  useEffect(() => {
    setFormValid(isNotEmpty(email) && isNotEmpty(password));
  }, [email, password]);

  /**
   * To login user when login button is clicked
   * @param {*} e 
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    setLocalStorage("rememberMe", rememberMe);
    if (rememberMe) { setLocalStorage("user", email); }
    if (formValid) {
      postRequest("api/v1/login", { username: email, password }).then(
        (response) => {
          setLoading(false);
          //console.log('response', response);
          const { status, data } = response;
          if (status === "success") {
            const { token, user } = data;
            dispatch(loginUser(token, user));
            history.push("/");
            // dispatch(addToast("Login Success."));
          } else {
            //console.log("data", data)
            setdisplayedMessege({messege:"Wrong username or password", color:"red"})
            setError({ ...error, email: data });
          }
        }
      ).catch((err) => {
        setLoading(false);
        setdisplayedMessege({messege:"A problem has occurred", color:"red"})
      });
    }
  };

  const handleOnChange = (e) => {
    setState({ ...state, ...inputKeyValue(e) });
  };

  const validated = (e) => {
    setError({
      ...error,
      ...onValidation(e),
    });
  };

  const handleKeypress = e => { if (e.keyCode === 13) { handleSubmit(); } };

  if (!forgotPassword) {
    return (
      <Loader loading={loading}>
        <form className="form login_form" id="loginForm">
          <span style={{ color: displayedMessege.color }}>{displayedMessege.messege}</span>
          <div className="form-group">
            <h5>Email</h5>
            <Textbox
              type="email"
              name="email"
              value={email}
              onChange={handleOnChange}
              onBlur={validated}
              required
            />
          </div>
          <div className="form-group">
            <h5>Password</h5>
            <Textbox
              type="password"
              name="password"
              value={password}
              onChange={handleOnChange}
              onBlur={validated}
              required
            />
          </div>
          <div className="form-group text-center">
            <a href="#" className="forgot-link" onClick={() => { setForgotPassword(true) }}>
              Forgot Password?
            </a>
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="btn login-btn btn-hover"
              //disabled={!formValid}
              onClick={handleSubmit}
            >
              Login
            </button>
            {/* <Button>Login</Button> */}
          </div>
        </form>
        <div className="text-center pt-2">
          <a href="/">Or enter as Guest</a>
        </div>
      </Loader>
    );
  }
  else {
    return <ResetPassword loading={loading} setLoading={setLoading} />
  }
}
