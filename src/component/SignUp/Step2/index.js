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
import { useSelector } from "react-redux";
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
  recoveryCode: "",
};
const initialError = {
  recoveryCode: "",
};
export default function Step2({ stepNumber, totalStep, OnPrevious, OnNext, mainState, setMainState }) {
  const [state, setState] = useState(initialState);
  const [formValid, setFormValid] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { recoveryCode } = state;

  const { email } = useSelector((state) => state.signup);

  useEffect(() => {
    setFormValid(checkAnyOneEmpty({ recoveryCode }));
  }, [recoveryCode]);

  const handleSubmit = (e) => {
    if (recoveryCode.length < 1) {
      setError("Can't input empty recovery code")
      return;
    }
    
    setLoading(true);
    postRequest("api/v1/user/sign_up_two", {
      email: email,
      verification_code: recoveryCode,
    }).then((response) => {
      setLoading(false);
      const { status, data } = response;
      handlePasswordSubmit();
      if (status === "success") {
      } else {
        setError("Wrong recovery code");
      }
    }).catch((err) => {
      setLoading(false);
    });
  }
  

  const handlePasswordSubmit = () => {
    console.log("happends")
  postRequest("api/v1/user/sign_up_three", {
    email,
    password:mainState.password,
    accepted_terms_condition:mainState.accepted_terms_condition,
  }).then((response) => {
    const { status, data } = response;
    console.log("le response", response)
    if (status === "success") {
      //history.push("/");
      window.location.reload(false);
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
    // });
  };
  return (
    <>
      <Loader loading={loading}>
        <form action="#" className="form login_form stepOne" id="loginForm">
          <div className="form-group">
            <p>
              Please enter the recovery code
            <br />
            you've received.
          </p>
          </div>
          <div className="form-group">
            <Textbox
              name="recoveryCode"
              value={recoveryCode}
              onChange={handleOnChange}
              onBlur={vailadated}
              required
            />
            <Error>{error}</Error>
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
