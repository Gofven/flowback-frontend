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
import { submitScreen1 } from "../../../store/actions/signup";
import { postRequest } from "../../../utils/API";
import {
  checkAnyOneEmpty,
  inputKeyValue,
  onValidation,
} from "../../../utils/common";
import { Textbox } from "../../common";
import Loader from "../../common/Loader";
import StepButton from "../StepButton";
import Checkbox from "../../common/Checkbox";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ReactDOM from "react-dom";
import './index.css'


const initialState = {
  email: "",
  screenName: "",
  loginName: "",
  password: "",
  repassword: "",
  accepted_terms_condition: false,
};

export default function Step13({ stepNumber, totalStep, OnPrevious, OnNext, mainState, setMainState }) {
  const [state, setState] = useState(initialState);
  const [formValid, setFormValid] = useState(false);
  const [messege, setMessege] = useState({ messege: "", color: "red" });
  const [loading, setLoading] = useState(false);
  const { email, screenName, loginName, password, repassword,
    accepted_terms_condition } = state;
  const dispatch = useDispatch();
  useEffect(() => {
    setFormValid(checkAnyOneEmpty({
      email, screenName, password, repassword,
      accepted_terms_condition
    }));
  }, [email, screenName, password, repassword, accepted_terms_condition]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!(email && screenName && password && repassword)) {
      setMessege({ color: "red", messege: "Leave no field empty" })
      return;
    }
    if (password !== repassword) {
      setMessege({ color: "red", messege: "Passwords need to match" })
      return;
    }
    if (!accepted_terms_condition) {
      setMessege({ color: "red", messege: "Need to accept terms and conditions" })
      return;
    }
    if (password.length < 8) {
      setMessege({ color: "red", messege: "Password must be longer than 7 letters" })
      return;
    }

    setLoading(true);
    //Login name is no longer used but removing it would f up the backend
    setMainState({ ...state, loginName: "" })
    postRequest("api/v1/user/sign_up_first", {
      email,
      screen_name: screenName,
      login_name: loginName,
    }).then((response) => {
      console.log("RESPONSÉ", response);
      setLoading(false)
      const { status, data } = response;
      if (status === "success") {

        dispatch(submitScreen1(email, screenName, loginName));
        if (OnNext) OnNext();


      } else {
        setMessege({ messege: "Something went wrong", color: "red" });
      }
    }).catch((err) => {
      setLoading(false);
    });
  }

  const handleOnChange = (e) => {
    setState({ ...state, ...inputKeyValue(e) });
  };

  const vailadated = (e) => {
    // setError({
    //   ...error,
    //   ...onValidation(e),
    // })
    // ;
  };
  return (
    <>
      <Loader loading={loading}>
        <form action="#" className="form login_form stepOne" id="loginForm">
          <h4 style={{ "color": messege.color }}>{messege.messege}</h4>
          <div className="form-group">
            <h5>Email</h5>
            <Textbox
              type="email"
              name="email"
              value={email}
              onChange={handleOnChange}
              onBlur={vailadated}
              required
            />
          </div>
          <h5>Name</h5>
          <div className="form-group">
            <Textbox
              name="screenName"
              className="right-icon-input"
              value={screenName}
              onChange={handleOnChange}
              onBlur={vailadated}
              required
            />

            <div
              className="icon"
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              title="Please choose a name, i.e. your real name or your nich name. This name will be shown to others to identify you."
            >
              <img src="/img/info_icon1.png" className="info-icon1" />
              <img src="/img/info_icon2.png" className="info-icon2" />
            </div>
          </div>
          {/* <div className="form-group">
            <Textbox
              name="loginName"
              value={loginName}
              onChange={handleOnChange}
              onBlur={vailadated}
              className="right-icon-input"
              placeholder="Login Name"
              required
            />
            <div
              className="icon"
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              title="Please choose a name, i.e. your real name or your nich name. This name will be shown to others to identify you."
            >
              <img src="/img/info_icon1.png" className="info-icon1" />
              <img src="/img/info_icon2.png" className="info-icon2" />
            </div>
          </div> */}
          <div className="form-group mb-0">
            <h5>Password</h5>
          </div>
          <div className="form-group">
            <Textbox
              type="password"
              name="password"
              value={password}
              onChange={handleOnChange}
              onBlur={vailadated}
              required
            />
          </div>
          <h5>Retype Password</h5>
          <div className="form-group">
            <Textbox
              type="password"
              name="repassword"
              value={repassword}
              onChange={handleOnChange}
              onBlur={vailadated}
              required
            />
          </div>
          <div className="form-group">
            <div className="form-check">
              <Checkbox
                checked={accepted_terms_condition}
                name="accepted_terms_condition"
                onChange={handleOnChange}
              >
                <span style={{ "color": "#212529" }}>I accept the</span> <a href="media/legal/terms_of_service.html" target="_blank">Terms & Conditions.</a>
              </Checkbox>
            </div>
          </div>
          <div className="register-btn2">
            <button
              onClick={handleSubmit}
              type="submit"
              className="btn login-btn btn-hover"
            >Register</button>
          </div>
        </form>
      </Loader>
    </>
  );
}