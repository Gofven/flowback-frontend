/**
 * FlowBack was created and project lead by Loke Hagberg. The design was
 * made by Lina Forsberg. Emilio Müller helped constructing Flowback.
 * Astroneatech created the code. It was primarily financed by David
 * Madsen. It is a decision making platform.
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see https://www.gnu.org/licenses/.
*/

import React, { useEffect, useState } from "react";
import './styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faTrash, faUpload, faTimes, faFileDownload } from '@fortawesome/free-solid-svg-icons'
import { Button } from "../../../component/common";
import { postRequest, deleteRequest } from '../../../utils/API';
import { formatDate } from "../../../utils/common";
import Loader from '../../common/Loader';
import { SearchFilter } from "../../common/Filter";

export default function AllTab(props) {

    const [filter, setFilter] = useState({ search: "" });
    const [document, setDocument] = useState({
        doc: null,
        doc_name: "",
        group: props.groupId,
    });
    const [documents, setDocuments] = useState([])
    const [loading, setLoading] = useState(false)

    const OnDocumentSelect = (e) => {
        const files = Array.from(e.target.files)
        var file = files[0];
        var fileName = file.name.substring(0, file.name.indexOf("."))
        console.log("index", fileName);
        setDocument({ ...document, doc_name: fileName, doc: file });
    }

    /**
     * To add document
     */
    const AddDocument = () => {
        console.log("I am sure")
        setLoading(true)
        var data = new FormData();
        Object.keys(document).forEach((key) => {
            data.append(key, document[key]);
        })
        postRequest("api/v1/user_group/add_group_doc", data).then(
            (response) => {
                console.log('response', response);
                const { status, data } = response;
                if (status === "success") {
                    removeDocument();
                    getDocuments();
                } else {
                }
                setLoading(false)
            }
        );
    }

    /**
     * To remove a document
     */
    const removeDocument = () => {
        setDocument({
            doc: null,
            doc_name: "",
            group: props.groupId,
        })
    }

    /**
     * To get all documents
     */
    const getDocuments = () => {
        setLoading(true);
        console.log("I'm here")
        postRequest("api/v1/user_group/get_all_group_docs", { group: props.groupId }).then(
            (response) => {
                console.log('response', response);
                const { status, data } = response;
                if (status === "success") {
                    setDocuments(data);
                } else {
                    // setError();
                }
                setLoading(false);
            }
        );
    }

    /**
     * To open document in new tab when download button is clicked
     * @param {*} item 
     */
    const viewDocument = (item) => {
        window.open(item.doc, '_blank');
    }


    const deleteDocument = (groupId, docId) => {
        setLoading(true);
        console.log("group", groupId);
        console.log("Doc", docId);
        deleteRequest("api/v1/user_group/delete_group_doc?group=" + `${groupId}` + "&doc=" + `${docId}`).then(
            (response) => {
                console.log('response', response);
                const { status, data } = response;
                if (status === "success") {
                    getDocuments();
                }
                setLoading(false);
            }
        );
    }

    useEffect(() => {
        getDocuments()
        console.log("I'm down here")
    }, [props])

    return (
        <Loader loading={loading}>
            <SearchFilter setFilter={setFilter} filter={filter} />
            {(!document.doc) ?
                (
                    <div className="grupper-card">
                        < div className=" text-center my-2"  >
                            <label htmlFor='document'>
                                <div>
                                    + Add Document
                                </div>
                            </label>
                            <input type='file' accept='image/*,application/pdf,application/msword' name="document" id='document' onChange={OnDocumentSelect} />

                        </div>
                    </div>) :
                <div className='field d-flex justify-content-between'>
                    <label htmlFor='document'>
                        <div>{document.doc_name}</div>
                    </label>
                    <div className='d-flex'> Upload:
                        <FontAwesomeIcon className="cursor-pointer"
                            icon={faUpload} color='black' size='lg' onClick={AddDocument} />
                        <div className='px-2'> Discard: </div>
                        <FontAwesomeIcon className="cursor-pointer"
                            icon={faTimes} color='#DD4A4C' size='lg' onClick={removeDocument} />
                    </div>
                </div>
            }

            {
                documents.map((document, key) => (
                    document.doc_name?.toUpperCase().includes(filter.search.toUpperCase()) &&
                    <div className="media mb-2" key={key}>
                        <div class="cursor-pointer">
                            <FontAwesomeIcon icon={faFileAlt} color='#737373' size='3x' onClick={() => { viewDocument(document) }} />
                        </div>
                        <div className="media-body">
                            <div class="cursor-pointer">
                                <p className="text-turncate mb-0">{document.doc_name}</p>
                            </div>
                            <p className="text-turncate small">Created {formatDate(document.created_at, 'DD/MM/YYYY')}</p>
                        </div>
                        <div className="d-flex" >
                            {/* <FontAwesomeIcon className="cursor-pointer"
                                icon={faFileDownload} color='blue' size='md' onClick={() => { viewDocument(document) }} /> */}
                            <div className='px-2'></div>
                            {["Owner", "Admin", "Moderator"].includes(props.userType) &&
                                <FontAwesomeIcon className="cursor-pointer"
                                    icon={faTrash} color='#DD4A4C' size='md' onClick={() => { deleteDocument(document.group, document.id) }} />
                            }
                        </div>
                    </div>
                ))
            }
        </Loader >
    );
}
