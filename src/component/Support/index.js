import { useState } from "react"
import { Modal } from "react-bootstrap"

export default function Support() {
    const [show, setShow] = useState(false)

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return <>
        <div onClick={handleShow}>Support</div>
        <Modal show={show} onHide={handleClose} >
            <Modal.Header><Modal.Title>Support</Modal.Title></Modal.Header>
            <Modal.Body>
            <div>Support between 12:00 and 17:00 CET</div>
            <div>Number: +46737482562</div>
            <div>Mail: flowbacktask@gmail.com</div>
            </Modal.Body>
            <Modal.Footer><button className="btn btn-danger" onClick={handleClose}>Close</button></Modal.Footer>
            </Modal>
        </>
}