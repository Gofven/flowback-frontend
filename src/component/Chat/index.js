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

import './styles.css'
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";
import ChatPopup from "../ChatPopup";
import MessageListPopup from "../MessageListPopup";
import { getRequest } from "../../utils/API";
import { connect } from 'react-redux';
import { ROOMS, CHAT } from '../../store/types';

function useForceUpdate() {
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update the state to force render
}

function Chat(props) {

    // const [rooms, setRooms] = useState([])
    const [sockets, setSockets] = useState({});
    const [lastMessages, setLastMessages] = useState({});
    const [opened, setOpened] = useState({});
    // const lastMessages = {};
    const forceUpdate = useForceUpdate();

    const getRooms = () => {
        getRequest("api/v1/friend/get_all_friends_rooms").then(
            (response) => {
                console.log('response', response);
                if (response) {
                    // setRooms(response.data)
                    const rooms = response.data || [];
                    props.loadRooms(rooms);
                    connectToRoom(rooms);
                }
            });
    }

    // let socketRef = [];
    let path;
    const connectToRoom = (rooms) => {
        rooms?.map((room) => {
            console.log(room?.room_name)
            connect(room?.id, room?.room_name)
        })


    }

    useEffect(() => {
        // initSocket()
        getRooms();
    }, [])

    useEffect(() => {
        console.log('opened', props.opened);
        setOpened({ ...props.opened });
    }, [props.opened])

    const incUnreaadMessages = (id) => {
        if (!opened[id]) {
            props.unreadMessageCountInc(id)
        }
    }

    /**
     * To connect to socket
     * @param {*} id 
     * @param {*} roomName 
     */
    const connect = (id, roomName) => {
        console.log(roomName);
        path = 'ws://8c1c5077b1cd.ngrok.io/ws/friend/chat/' + roomName + '/';
        const socketRef = sockets;
        socketRef[id] = new WebSocket(path);
        socketRef[id].onopen = () => {
            console.log('WebSocket open');
        };
        socketRef[id].onmessage = (e) => {
            console.log("E", (JSON.parse(e.data).message_details.message));
            if (JSON.parse(e.data).message_details?.message.length) {
                props.setwebsocketMsg(id, [JSON.parse(e.data).message_details])
            }

        };

        socketRef[id].onerror = e => {
            console.log(e.message);
        };
        socketRef[id].onclose = () => {
            console.log("WebSocket closed let's reopen" + id);
            connect(id, roomName);
        };
        setSockets({ ...socketRef });
    }

    /**
     * To set last message per room to show in list view
     * @param {*} roomId 
     * @param {*} msg 
     * @param {*} index 
     */
    const setRoomLastMessage = (roomId, msg, index) => {
        setTimeout(() => {
            console.log('last msg', lastMessages)
            setLastMessages({ ...lastMessages, [roomId]: msg });
        }, 100 * index);
        // lastMessages[roomId] = msg;
        forceUpdate();

    }

    useEffect(() => {
        console.log('last', lastMessages)
    }, [lastMessages])


    return (
        <>
            <MessageListPopup rooms={props.rooms} unreadMessages={props.unreadMessages} lastMessages={lastMessages} />
            <div className='chat-container'>
                {
                    props.rooms.map((room, index) => {
                        return <ChatPopup key={room?.id} room={room} socketRef={sockets[room?.id]} setLastMessage={(msg) => setRoomLastMessage(room.id, msg, index)} />;
                    })
                }
            </div>
        </>
    );
}
const mapDispachToProps = dispatch => {
    return {
        loadRooms: rooms => dispatch({ type: ROOMS.LOAD_ROOMS, payload: { rooms } }),
        setwebsocketMsg: (roomId, messages) => dispatch({ type: CHAT.SET_WEBSOCKET_MSG, payload: { roomId, messages } }),
        unreadMessageCoountInc: (roomId) => dispatch({ type: ROOMS.UNREAD_MSG_COUNT_INC, payload: { roomId } })

    };
};

const mapStateToProps = state => {
    return {
        rooms: state.rooms.rooms,
        unreadMessages: state.rooms.unreadMessages,
        opened: state.chats.opened
    };
};

export default connect(mapStateToProps, mapDispachToProps)(Chat);
