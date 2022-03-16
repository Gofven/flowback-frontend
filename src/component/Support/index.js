import { useState, useEffect } from "react"
import { Modal } from "react-bootstrap"

export default function Support() {
    const [show, setShow] = useState(false)

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        console.log("hi")
    })

    return <>
        <div onClick={handleShow}>Support</div>
        <Modal show={show} onHide={handleClose} >
            <Modal.Header><Modal.Title>Support</Modal.Title></Modal.Header>
            <Modal.Body>
            <div>Support between 12:00 and 17:00 CET</div>
            <div>Number: +46737482562</div>
            <div>Mail: flowbacktask@gmail.com</div>
            </Modal.Body>
            </Modal>
        </>
}