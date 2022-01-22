import React, { useState, useEffect } from "react";
import { Textbox } from "../../component/common/Textbox";
import { Textarea } from "../../component/common/Textarea";
import { inputKeyValue } from '../../utils/common';

export default function SendEmail()
{
    const [state, setState] = useState({title:"", email:""});
    const {title, email} = state;

    const handleOnChange = (e) => {
        console.log(state)
        setState({ ...state, ...inputKeyValue(e) });
      }; 

    return <div className="feed-card card-rounded mb-4">
    <div action="#" className="card-header flex-header tab-header">
        <h4 className="card-title">Send Email</h4>
        <form className="form login_form" id="loginForm">
        <div className="form-group">
          <h5>Title</h5>
          <Textbox
            name="title"
            value={title}
            onChange={handleOnChange}
            required
            />
        </div>
        <div className="form-group">
          <h5>Email</h5>
          <Textarea
            name="email"
            value={email}
            onChange={handleOnChange}
            required
            />
        </div>
        <button
            type="button"
            className="btn login-btn btn-hover"
            //disabled={!formVaxlid}
            onClick={()=> console.log("click")}>
            Send
        </button>
        </form>
        </div>
        </div>
}