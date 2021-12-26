/**
 * FlowBack was created and project lead by Loke Hagberg. The design was
 * made by Lina Forsberg. Emilio Müller helped constructing Flowback.
 * Astroneatech created the code. It was primarily financed by David
 * Madsen. It is a decision making platform.
 * Copyright (C) 2021  Astroneatech AB
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
import Checkbox from "../../common/Checkbox";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";


const initialState = {
  email: "",
  screenName: "",
  loginName: "",  
  password: "",
  repassword: "",
  accepted_terms_condition: false,
};
const initialError = {
  email: "",
  screenName: "",
  loginName: "",  
  password: "",
  accepted_terms_condition: false,
};

export default function Step13({ stepNumber, totalStep, OnPrevious, OnNext, mainState, setMainState }) {
  const [state, setState] = useState(initialState);
  const [formValid, setFormValid] = useState(false);
  const [error, setError] = useState(initialError);
  const [loading, setLoading] = useState(false);
  const { email, screenName, loginName, password, repassword,
    accepted_terms_condition } = state;
  const dispatch = useDispatch();
  useEffect(() => {
    setFormValid(checkAnyOneEmpty({ email, screenName, loginName, password, repassword,
        accepted_terms_condition }));
  }, [email, screenName, loginName, password, repassword, accepted_terms_condition]);

  const handleSubmit = (e) => {
    console.log("hu")
    if (email&&screenName&&loginName&&password&&repassword&&accepted_terms_condition) {
      if (password===repassword)
      {
        setLoading(true);
        setMainState(state)
        postRequest("api/v1/user/sign_up_first", {
          email,
          screen_name: screenName,
          login_name: loginName,
        }).then((response) => {
          //handlePasswordSubmit().then(()=>{   
            console.log("RESPONSÉ", response);
            const { status, data } = response;
            if (status === "success") {
              dispatch(submitScreen1(email, screenName, loginName));
              if (OnNext) OnNext();
            } else {
              setError({ ...error, email: data });
            }
            //}
            //)
          }).catch((err) => {
            setLoading(false);
          });
        }
        else{
          setError({...error, email:"Passwords need to match"})

        }
        }
        else{
          setError({...error, email:"Leave no field empty"})
    }
  };
// const handlePasswordSubmit = () => {
//   postRequest("api/v1/user/sign_up_three", {
//     email,
//     password,
//     accepted_terms_condition,
//   }).then((response) => {
//     setLoading(false);
//     const { status, data } = response;
//     console.log("le response", response)
//     if (status === "success") {
//       //history.push("/");
//       //window.location.href = "/"
//     } else {
//       setError({ ...error, ...data[0] });
//     }
//     }).catch((err) => {
//         setLoading(false);
// });
// }

  const handleOnChange = (e) => {
    setState({ ...state, ...inputKeyValue(e) });
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
              placeholder="Email"
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
              placeholder="Full Name"
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
          </div>
          <div className="form-group">
            <div className="form-check">
              <Checkbox
                checked={accepted_terms_condition}
                name="accepted_terms_condition"
                onChange={handleOnChange}
              >
                I accept the <a href="media/legal/terms_of_service.html">Terms & Conditions.</a>
              </Checkbox>
            </div>
          </div>
          <div className="form-group mb-0">
            <h5>Password</h5>
          </div>
          <div className="form-group">
            <Textbox
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={handleOnChange}
              onBlur={vailadated}
              required
            />
          </div>
          <div className="form-group">
            <Textbox
              type="password"
              name="repassword"
              placeholder="Re-type Password"
              value={repassword}
              onChange={handleOnChange}
              onBlur={vailadated}
              required
            />
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


/*export default function Step3({ stepNumber, totalStep, OnPrevious, OnNext }) {
  const [state, setState] = useState(initialState);
  const [formValid, setFormValid] = useState(true);
  const [error, setError] = useState(initialError);
  const [loading, setLoading] = useState(false);
  const {
    password,
    repassword,
    accepted_terms_condition,
  } = state;

  const { email } = useSelector((state) => state.signup);

  let history = useHistory();

  useEffect(() => {
    setFormValid(
      checkAnyOneEmpty({
        password,
        accepted_terms_condition,
      })
    );
  }, [password, accepted_terms_condition]);

  const handleSubmit = (e) => {
    if (formValid) {
      setLoading(true);
      postRequest("api/v1/user/sign_up_three", {
        email: email,
        password,
        accepted_terms_condition,
      }).then((response) => {
        setLoading(false);
        const { status, data } = response;
        if (status === "success") {
          history.push("/");
        } else {
          setError({ ...error, ...data[0] });
        }
      }).catch((err) => {
        setLoading(false);
      });
    }
  };
  const handleOnChange = (e) => {
    console.log(state);
    setState({ ...state, ...inputKeyValue(e) });
    console.log(state);
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

      </Loader>
    </>
  );
}*/