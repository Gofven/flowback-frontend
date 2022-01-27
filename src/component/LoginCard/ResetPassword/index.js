import React, { useState } from "react";
import { Textbox } from "../../common";
import Loader from "../../common/Loader";
import { inputKeyValue } from "../../../utils/common";
import { postRequest } from "../../../utils/API";


export default function ResetPassword({ loading, setLoading }) {
  const [state, setState] = useState({ email: "", newPassword: "", repassword: "", verification_code: "" })
  const [stage, setStage] = useState(1)
  const [status, setStatus] = useState("")
  const { email, password, repassword, verification_code } = state;

  const handleSendCodeToEmail = e => {
    e.preventDefault();
    setLoading(true)
    if (email) {
      postRequest("api/v1/user/reset-password-one", { email }).then(response => {
        setStage(2)
        setState({ email, password: "", repassword: "", verification_code: "" })
        setLoading(false)
      })
    }
  }

  const handlePasswordReset = (e) => {
    e.preventDefault();
    setStatus("");
    if (password !== repassword) {
      setStatus("Passwords must match");
      return;
    }
    else if (password.length < 8) {
      setStatus("Password must be 8 characters or more");
      return;
    }
    else if (verification_code === "") {
      setStatus("Leave no field empty");
      return;
    }
    else if (email) {
      setLoading(true)
      postRequest("api/v1/user/reset-password-two", { email, password, verification_code }).then(response => {
        setLoading(false)
        if (response !== "") {
          setStatus("Wrong verification code");
        }
        else {
          window.location.reload()
        }
      })
    }
  }

  //Clicking enter makes progress
  // document.addEventListener("keypress", function (event) {
  //   if (event.key === 'Enter') {
  //     if (stage === 1)
  //       handleSendCodeToEmail()
  //     else if (stage === 2)
  //       handlePasswordReset()
  //   }
  // });

  const handleOnChange = (e) => {
    setState({ ...state, ...inputKeyValue(e) });
  };

  if (stage === 1) {
    return <Loader loading={loading}>
      <form action="#" className="form login_form">
        <div className="form-group"><h4>Reset password by typing your account email below to receive verification code</h4></div>
        <div className="form-group">
          <h5>Mail</h5>
          <Textbox
            type="email"
            name="email"
            value={email}
            onChange={handleOnChange}
          //onBlur={validated}
          // required
          /></div>
        <div className="form-group">
          <button
            type="submit"
            className="btn login-btn btn-hover"
            //disabled={!formVaxlid}
            onClick={handleSendCodeToEmail}>
            Send
          </button>
        </div>
        {/* </form> */}
      </form>
    </Loader>
  }
  else if (stage === 2) {
    return <Loader loading={loading}>
      <form action="#">
        <div className="form login_form">
          <div className="form-group"><h4 style={{ "color": "green" }}>A verification code has been sent to the email adress</h4></div>
          {/* <div className="form-group">
          <h5>Email</h5>
        <Textbox
            type="email"
            name="email"
            value={email}
            onChange={handleOnChange}
            //onBlur={validated}
            // required
            /></div> */}
          <div className="form-group">
            <h5 style={{ "color": "red", "fontSize": "14px" }}>{status}</h5>
            <h5>Password</h5>
            <Textbox
              type="password"
              name="password"
              value={password}
              onChange={handleOnChange}
            //onBlur={validated}
            //required
            /></div><div className="form-group">
            <h5>Retype Password</h5>
            <Textbox
              type="password"
              name="repassword"
              value={repassword}
              onChange={handleOnChange}
            //onBlur={validated}
            //required
            /></div><div className="form-group">
            <h5>Verification Code</h5>
            <Textbox
              type="integers"
              name="verification_code"
              value={verification_code}
              onChange={handleOnChange}
            //onBlur={validated}
            //required
            /></div><div className="form-group">
            <button
              type="submit"
              className="btn login-btn btn-hover"
              //disabled={!formVaxlid}
              onClick={handlePasswordReset}>
              Set password
            </button></div>
        </div>
      </form>
    </Loader>
  }
}