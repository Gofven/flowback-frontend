import { useState } from "react"
import { Modal } from "react-bootstrap"

export default function Support() {
    const [show, setShow] = useState(false)

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return <>
        <div onClick={handleShow}>{window.t("Support")}</div>
        <Modal show={show} onHide={handleClose} >
            <Modal.Header><Modal.Title>{window.t("Support")}</Modal.Title></Modal.Header>
            <Modal.Body>
                <div>{window.t("Support between 12:00 and 17:00 CET")}</div>
                <div>{window.t("Number: +46737482562")}</div>
                <div>{window.t("Mail: flowbacktask@gmail.com")}</div>
                <div>{window.t("For questions about Metamask, contact the Metamask team.")}</div>
            </Modal.Body>
            <Modal.Footer><button className="btn btn-danger" onClick={handleClose}>{window.t("Close")}</button></Modal.Footer>
        </Modal>
    </>
}