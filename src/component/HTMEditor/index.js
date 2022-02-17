import {useState, useEffect} from 'react'

export function HTMEditor(){
    const [textEditorLoaded, setTextEditorLoaded] = useState(false)

    const loadTextEditor = () => {
    
        if (!textEditorLoaded) {
            const script = document.createElement("script");
            script.src = "https://htmeditor.com/js/htmeditor.min.js";
            script.setAttribute("htmeditor_textarea", "htmeditor");
            script.setAttribute("full_screen", "no");
            script.setAttribute("async", true);
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
                    console.log("hi")
                }
            }
        };
        
        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }

    useEffect(() => {
        loadTextEditor();
    })

    return <textarea id="htmeditor" required
    maxLength={100000}
    name="description"></textarea>
}

export function getHTML(){
    return window.localStorage.getItem("/groupdetails/1-htmeditor-draft");
}