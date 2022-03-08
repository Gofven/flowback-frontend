import { useState, useEffect } from 'react'
import { formatDate } from '../../utils/common';

export function HTMEditor(id) {
    const [textEditorLoaded, setTextEditorLoaded] = useState(false)
    const [draftTime, setdraftTime] = useState(0)

    const loadTextEditor = () => {

        if (!textEditorLoaded) {
            const script = document.createElement("script");
            script.src = "https://htmeditor.com/js/htmeditor.min.js";
            script.setAttribute("htmeditor_textarea", "htmeditor");
            script.setAttribute("full_screen", "no");
            script.setAttribute("async", false);
            document.body.appendChild(script);
            setTextEditorLoaded(true)
        }

        const editor = document.getElementById("htmeditor_ifr");
        if (textEditorLoaded && editor !== null) {
            const child = editor.childNodes[0]
            console.log(child)
        }

        const targetNode = document.body;
        const config = { childList: true, subtree: true };

        const callback = function (mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    //If edited
                }
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }

    const getDraftTime = () => {
        return formatDate(parseInt(window.localStorage.getItem("/groupdetails/1/pollcreate-htmeditor-time")), 'kk:mm:ss');
    }

    useEffect(() => {
        const interval = setInterval(function () {
            setdraftTime(getDraftTime())
        }, 5000);


        loadTextEditor();
        setdraftTime(getDraftTime())

        return (clearInterval(interval))
    })

    return <div style={{"margin-top":"1rem"}}>
        <textarea id={`htmeditor`} required
            maxLength={100000}
            fillEmptyBlocks={false}
            name="description"></textarea></div>
}

export function getHTML() {
    return document.getElementById("htmeditor_ifr").contentDocument.children[0].children[1].innerHTML;
}

export function clearHTML() {
    return document.getElementById("htmeditor_ifr").contentDocument.children[0].children[1].innerHTML = "";
}

export function getTextBetweenHTMLTags(html) {
    const regexBetweenHTMLTags = /(?<=>)([\w\s]+)(?=<)/g
    const s = html?.match(regexBetweenHTMLTags)
    const h = s?.join("")
    return h
}

//<p>ffff ff</p>