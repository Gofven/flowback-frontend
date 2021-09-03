/**
 * FlowBack was created and project lead by Loke Hagberg. The design was
 * made by Lina Forsberg. Emilio Müller helped constructing Flowback.
 * Astroneatech created the code. It was primarily financed by David
 * Madsen. It is a decision making platform.
 * Copyright (C) 2021  Astroneatech AB
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

import { LOGIN_USER, ROOMS } from "../types";

const initialState = {
    rooms: [],
    lastMessages: {},
    unreadMessages: {},
}

export default function rooms(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case ROOMS.LOAD_ROOMS:
            return {
                ...state,
                rooms: payload.rooms,
            };

        case ROOMS.SET_ROOM_LAST_MSG:
            return {
                ...state,
                lastMessages: {
                    ...state.lastMessages,
                    [payload.roomId]: payload.msg
                }
            }

        case ROOMS.SET_UNREAD_MSG_COUNT:
            return {
                ...state,
                unreadMessages: {
                    ...state.unreadMessages,
                    [payload.roomId]: payload.messageCount ? payload.messageCount : 0
                }
            }

        case ROOMS.UNREAD_MSG_COUNT_INC:
            return {
                ...state,
                unreadMessages: {
                    ...state.unreadMessages,
                    [payload.roomId]: (state.unreadMessages[payload.roomId]) ? state.unreadMessages[payload.roomId] + 1 : 1
                }
            }

        case ROOMS.UNREAD_MSG_COUNT_RESET:
            return {
                ...state,
                unreadMessages: {
                    ...state.unreadMessages,
                    [payload.roomId]: 0
                }
            }


        default:
            return state;
    }
}