import sdk from 'matrix-js-sdk'
import { useEffect, useState } from 'react'


export default function MatrixChat (){
    const [rooms, setRooms] = useState([])

    useEffect(() => {
        // const client = sdk.createClient("https://matrix.org");
        // client.publicRooms(function(err, data) {
        // console.log("Public Rooms: %s", JSON.stringify(data));
        // setRooms(data)

        const client = sdk.createClient({
            baseUrl: "https://matrix.org",
            accessToken: "....MDAxM2lkZW50aWZpZXIga2V5CjAwMTBjaWQgZ2Vu....",
            userId: "@USERID:matrix.org"
        });

        console.log(client)
    })
    
    return <div>CHAT: </div>
}