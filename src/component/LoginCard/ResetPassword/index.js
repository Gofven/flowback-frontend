import React, { useState } from "react";
import { Textbox } from "../../common";
import Loader from "../../common/Loader";
import { inputKeyValue } from "../../../utils/common";
import { postRequest } from "../../../utils/API";


export default function ResetPassword({loading, setLoading}){
    //{/*api/v1/user/reset-password-one*/}{/*api/v1/user/reset-password-two*/}
    const [state, setState] = useState({email:"", newPassword:"", verification_code:0})
    const [stage, setStage] = useState(1)
    const { email, password, verification_code } = state;
  
    const handleSendToEmailWhenForgotPassword = () =>
    {
      setLoading(true)
      if (email)
      {
        postRequest("api/v1/user/reset-password-one", {email}).then(response => {
          setStage(2)
          setState({email:"", password:"", verification_code:""})
          setLoading(false)
        })
      }
    }

    const handleFinalPasswordReset = () =>
    {
      setLoading(true)
      if (email)
      {
        postRequest("api/v1/user/reset-password-two", {email, password, verification_code}).then(response => {
          setStage(2)
          setState({email:"", password:"", verification_code:""})
          setLoading(false)
          console.log("RESPNS", response)
        })
      }
    }

      //Clicking enter makes progress
  document.addEventListener("keypress", function(event) {
    //console.log(event.key)
    if (event.key==='Enter') 
    {
      if (stage===1)
        handleSendToEmailWhenForgotPassword()
      else if (stage===2)
        handleFinalPasswordReset()
    }  
  });

    const handleOnChange = (e) => {
        setState({ ...state, ...inputKeyValue(e) });
      };


    if (stage===1){
        console.log("hiiiiiIIIIJFKILJIEOHN")
    return <Loader loading={loading}>
      <div className="form login_form">
        <div className="form-group"><h4>Restore password by writing in the email
          for the account you lost</h4></div>
        <div className="form-group">
        <Textbox
            type="email"
            name="email"
            placeholder="Username or email"
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
            onClick={handleSendToEmailWhenForgotPassword}>
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
        <Textbox
            type="email"
            name="email"
            placeholder="Username"
            value={email}
            onChange={handleOnChange}
            //onBlur={validated}
            // required
            /></div><div className="form-group">
            <Textbox
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={handleOnChange}
            //onBlur={validated}
            //required
            /></div><div className="form-group">
            <Textbox
            type="integers"
            name="verification_code"
            placeholder="123456"
            value={verification_code}
            onChange={handleOnChange}
            //onBlur={validated}
            //required
            /></div><div className="form-group">
            <button
            type="button"
            className="btn login-btn btn-hover"
            //disabled={!formVaxlid}
            onClick={handleFinalPasswordReset}>
            Send
        </button></div>
        </div>
        {/* </form>   */}
    </Loader>
    }
}