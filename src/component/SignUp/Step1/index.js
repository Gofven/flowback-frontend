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
import { Error } from "../../common/Error";
import Loader from "../../common/Loader";
import StepButton from "../StepButton";

const initialState = {
  email: "",
  screenName: "",
  loginName: "",
};
const initialError = {
  email: "",
  screenName: "",
  loginName: "",
};
export default function Step1({ stepNumber, totalStep, OnPrevious, OnNext, mainState, setMainState }) {
  const [state, setState] = useState(initialState);
  const [formValid, setFormValid] = useState(false);
  const [error, setError] = useState(initialError);
  const [loading, setLoading] = useState(false);
  const { email, screenName, loginName } = state;
  const dispatch = useDispatch();
  // react.useEffect(() => {
  //   console.log("bruh")
  //   setFormValid(checkAnyOneEmpty({ email, screenName, loginName }));
  // }, [email, screenName, loginName]);
  
  const handleSubmit = (e) => {
    setMainState({...mainState, email, screen_name:screenName, login_name:loginName})
    if (email && screenName && loginName) {
      OnNext();
    }
    else {
      setError({ ...error, email:"No field can be empty" });
    }
      //dispatch(submitScreen1(email, screenName, loginName));
      //OnNext();
      //}
      /*  setLoading(true);
      postRequest("api/v1/user/sign_up_first", {
        email,
        screen_name: screenName,
        login_name: loginName,
      }).then((response) => {
        setLoading(false);
        console.log("response", response);
        const { status, data } = response;
        if (status === "success") {
          dispatch(submitScreen1(email, screenName, loginName));
          if (OnNext) OnNext();
        } else {
          setError({ ...error, email: data });
        }
      }).catch((err) => {
        setLoading(false);
      });
    };
  */}
  
  const handleOnChange = (e) => {
    console.log("eEEEEEE", e);
    setState({ ...state, ...inputKeyValue(e) });
    setMainState({...mainState, email, screen_name:screenName, login_name:loginName})
  };
  
  const vailadated = (e) => {
    setError({
      ...error,
      ...onValidation(e),
    });
  };

  return (
    <>
      <Loader loading={loading}>
        <form action="#" className="form login_form stepOne" id="loginForm">
          <div className="form-group">
            <Textbox
              type="email"
              name="email"
              value={email}
              onChange={handleOnChange}
              onBlur={vailadated}
              required
            />
            <Error>{error?.email}</Error>
          </div>
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
          <div className="form-group">
            <Textbox
              name="loginName"
              value={loginName}
              onChange={handleOnChange}
              onBlur={vailadated}
              className="right-icon-input"
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
        </form>
        <StepButton
          stepNumber={stepNumber}
          totalStep={totalStep}
          OnPrevious={OnPrevious}
          OnNext={handleSubmit}
        />
      </Loader>
    </>
  );
}
