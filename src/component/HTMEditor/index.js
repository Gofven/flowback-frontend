import {useEffect} from 'react'

export default function HTMEditor(){
    
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
    maxLength={maxDescriptionLength}
    onChange={handleOnChange}
    defaultValue={pollDetail.description}
    name="description"></textarea>
}