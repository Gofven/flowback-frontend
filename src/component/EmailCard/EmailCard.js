import React, { useState, useEffect } from "react";
import { Textbox } from "../common/Textbox/Textbox";
import { Textarea } from "../common/Textarea/Textarea";
import { inputKeyValue } from '../../utils/common';
import { postRequest } from "../../utils/API";
import Loader from "../common/Loader/Loader";
import { HTMEditor } from "../HTMEditor/HTMEditor";

export default function SendEmail({ groupId, userType }) {
    const [state, setState] = useState({ subject: "", message: "" });
    const { subject, message } = state;
    const [status, setStatus] = useState({ text: "", color: "black" });
    const [loading, setLoading] = useState(false);

    const handleOnChange = (e) => {
        console.log(state)
        setState({ ...state, ...inputKeyValue(e) });
    };

    const handleSendMail = () => {

        const draft = `<html><body>${window.localStorage.getItem("/groupdetails/1-htmeditor-draft")}</body></html>`;

        setLoading(true)
        var data = new FormData();
        data.append("subject", state.subject);
        data.append("message", draft);

        postRequest(`api/v1/user_group/${groupId}/mail_all_group_members`, data).then(response => {
            setLoading(false)
            if (response === "") {
                setStatus({ text: "Successfully sent mail", color: "green" });
            }
        }).catch(() => {
            setStatus({ text: "Something went wrong", color: "red" });
        })
    }
    return (
        userType === "Owner" ?
            <div className="document-card card-rounded mb-4">
                <div className="card-header flex-header tab-header">
                    <h4 className="card-title">{window.t("Send Email")}</h4>
                </div>
                <Loader loading={loading}>
                    <div className="card-body">
                        <h4 style={{ "color": status.color }}>{status.text}</h4>
                        <form className="form login_form" id="loginForm">
                            <div className="form-group">
                                <h5>{window.t("Subject")}</h5>
                                <Textbox
                                    name="subject"
                                    value={subject}
                                    onChange={handleOnChange}
                                    required
                                />
                            </div>
                            <div className="form-group" style={{ "margin-top": "3%" }}>
                                <h5>{window.t("Content")}</h5>
                                <HTMEditor />
                            </div>
                            <button
                                type="button"
                                className="btn btn-primary btn-hover"
                                //disabled={!formVaxlid}
                                onClick={handleSendMail}>
                                {window.t("Send")}
                            </button>
                        </form>
                    </div>
                </Loader>
            </div> : <div className="document-card card-rounded mb-4">
                <div className="card-header flex-header tab-header">
                    <h4 className="card-title">{window.t("Send Email")}</h4>
                </div>
                <div className="card-body text-danger">{window.t("Only an Admin is allowed to send emails")}.</div>
            </div>)
}