import React, { useState } from "react";
import { Textbox } from "../../common";
import Loader from "../../common/Loader";
import { inputKeyValue } from "../../../utils/common";
import { postRequest } from "../../../utils/API";


export default function ResetPassword({loading, setLoading}){
    const [state, setState] = useState({email:"", newPassword:"", repassword:"", verification_code:0})
    const [stage, setStage] = useState(1)
    const [wrongPass, setWrongPass] = useState(false)
    const { email, password, repassword, verification_code } = state;
  
    const handleSendCodeToEmail = () =>
    {
      setLoading(true)
      if (email){
        postRequest("api/v1/user/reset-password-one", {email}).then(response => {
          setStage(2)
          setState({email:"", password:"", verification_code:""})
          setLoading(false)
        })
      }
    }

    const handlePasswordReset = () =>
    {
      setLoading(true)
      if (password!==repassword){
        setWrongPass(true)
      }
      else if (email)
      {
        postRequest("api/v1/user/reset-password-two", {email, password, verification_code}).then(response => {
          setState({email:"", password:"", verification_code:""})
          setLoading(false)
          console. log("RESPNS", response)
          window.location.reload()
        })
      }
    }

      //Clicking enter makes progress
  document.addEventListener("keypress", function(event) {
    if (event.key==='Enter') 
    {
      if (stage===1)
        handleSendCodeToEmail()
      else if (stage===2)
        handlePasswordReset()
    }  
  });

    const handleOnChange = (e) => {
        setState({ ...state, ...inputKeyValue(e) });
      };

    if (stage===1){
    return <Loader loading={loading}>
      <div className="form login_form">
        <div className="form-group"><h4>Restore password by writing in the email
          for the account you lost</h4></div>
        <div className="form-group">
        <Textbox
            type="email"
            name="email"
            placeholder="example@example.com"
            value={email}
            onChange={handleOnChange}
            //onBlur={validated}
            // required
            /></div>
            <div className="form-group">
            <button
            type="button"
            className="btn login-btn btn-hover"
            //disabled={!formVaxlid}
            onClick={handleSendCodeToEmail}>
            Send
        </button>
        </div>
      </div>
    </Loader>
    }
    else if (stage===2)
    {
        return <Loader loading={loading}>
        {/* <form>  */}
        <div className="form login_form">
        <div className="form-group"><h4>A code has been sent to the email adress</h4></div>
        <div className="form-group">
          <h5>Email</h5>
        <Textbox
            type="email"
            name="email"
            placeholder="example@example.com"
            value={email}
            onChange={handleOnChange}
            //onBlur={validated}
            // required
            /></div><div className="form-group">
              <h5 style={{"color":"red","fontSize":"14px"}}>{wrongPass ? "Passwords don't match" : ""}</h5>
              <h5>Password</h5>
            <Textbox
            type="password"
            name="password"
            placeholder="********"
            value={password}
            onChange={handleOnChange}
            //onBlur={validated}
            //required
            /></div><div className="form-group">
              <h5>Retype Password</h5>
            <Textbox
            type="password"
            name="repassword"
            placeholder="********"
            value={repassword}
            onChange={handleOnChange}
            //onBlur={validated}
            //required
            /></div><div className="form-group">
              <h5>Verification Code</h5>
            <Textbox
            type="integers"
            name="verification_code"
            placeholder="XXXXXXX"
            value={verification_code}
            onChange={handleOnChange}
            //onBlur={validated}
            //required
            /></div><div className="form-group">
            <button
            type="button"
            className="btn login-btn btn-hover"
            //disabled={!formVaxlid}
            onClick={handlePasswordReset}>
            Send
        </button></div>
        </div>
        {/* </form>   */}
    </Loader>
    }
}