import React, { useState, useEffect } from "react";
import { Textbox } from "../../component/common/Textbox";
import { Textarea } from "../../component/common/Textarea";
import { inputKeyValue } from '../../utils/common';
import { postRequest } from "../../utils/API";

export default function SendEmail({groupId})
{
    const [state, setState] = useState({subject:"", message:""});
    const {subject, message} = state;

    const handleOnChange = (e) => {
        console.log(state)
        setState({ ...state, ...inputKeyValue(e) });
      }; 

      const handleSendMail = () => {
        // console.log(groupId)
        var data = new FormData();
        data.append("subject", state.subject);
        data.append("message", state.message);

        postRequest(`api/v1/user_group/${groupId}/mail_all_group_members`, data).then(response => {
            console.log(response);
        })
      }

    return (
    <div className="document-card card-rounded mb-4">
        <div className="card-header flex-header tab-header">
            <h4 className="card-title">Send Email</h4>
        </div>
        <div className="card-body">
        <form className="form login_form" id="loginForm">
            <div className="form-group">
            <h5>Title</h5>
            <Textbox
                name="subject"
                value={subject}
                onChange={handleOnChange}
                required
                />
            </div>
            <div className="form-group">
            <h5>Email</h5>
            <Textarea
                name="message"
                value={message}
                onChange={handleOnChange}
                required
                />
            </div>
            <button
                type="button"
                className="btn btn-primary btn-hover"
                //disabled={!formVaxlid}
                onClick={handleSendMail}>
                Send
            </button>
        </form>
        </div>
        </div>)
}