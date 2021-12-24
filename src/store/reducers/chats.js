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

import { CHAT } from "../types";

const initialState = {
    messages: {},
    opened: {}
}

export default function chats(state = initialState, action) {
    const { type, payload } = action;
    let oldMessages = [];
    let newMessages = [];
    let openedChats = {};

    switch (type) {
        case CHAT.SET_PREVIOUS_MESSAGES:
            oldMessages = (state.messages[payload.roomId]) ? state.messages[payload.roomId] : []
            newMessages = payload.messages ? [...payload.messages] : []
            return {
                ...state,
                messages: {
                    ...state.messages,
                    [payload.roomId]: [...newMessages, ...oldMessages]
                }
            };

        case CHAT.SET_WEBSOCKET_MSG:
        case CHAT.SET_NEW_MESSAGES:
            oldMessages = (state.messages[payload.roomId]) ? state.messages[payload.roomId] : []
            newMessages = payload.messages ? [...payload.messages] : []
            return {
                ...state,
                messages: {
                    ...state.messages,
                    [payload.roomId]: [...oldMessages, ...newMessages]
                }
            };

        case CHAT.OPEN_CHAT_POPUP:
            openedChats = { ...state.opened };
            openedChats[payload.roomId] = true;
            return {
                ...state,
                opened: { ...openedChats }
            }

        case CHAT.CLOSE_CHAT_POPUP:
            openedChats = { ...state.opened };
            delete openedChats[payload.roomId];
            return {
                ...state,
                opened: { ...openedChats }
            }

        default:
            return state;
    }
}