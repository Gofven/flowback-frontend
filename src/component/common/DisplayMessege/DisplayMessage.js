import { useState } from 'react'

export default function DisplayMessege() {
    const [displayedMessege, setDisplayedMessege] = useState({ messege: "", color: "black" })

    return <div style={{ "color": displayedMessege.color }}>{displayedMessege.messege}</div>
}