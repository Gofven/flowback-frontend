import { useState } from "react"
import { Modal } from "react-bootstrap"

export default function Tools(props) {
    const [show, setShow] = useState(false)

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleCoDocumentCreation = () => {
        window.open(`https://pad.flowback.org/p/${props.groupId}-${Math.floor(Math.random() * 100000000000)}-${Math.floor(Math.random() * 100000000000)}`, "_blank")
    }

    return <>
        <div onClick={handleShow}>{props.children}</div>
        <Modal show={show} onHide={handleClose} >
            <Modal.Header><Modal.Title>{props.children}</Modal.Title></Modal.Header>
            <Modal.Body>
                <div className="py-3 mb-2">Click this button to create a co-document, share the link for others to edit it. Remember to save the link.</div>
                <div className="grupper-card row g-2 clickable">
                    <div className="text-center my-2 noSelect">
                        <div onClick={handleCoDocumentCreation}>+ {window.t("Create Co-Document")}</div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer><button className="btn btn-danger" onClick={handleClose}>{window.t("Close")}</button></Modal.Footer>
        </Modal>
    </>
}