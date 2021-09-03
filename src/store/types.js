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

export const ADD_TOAST = "ADD_TOAST";
export const REMOVE_TOAST = "REMOVE_TOAST";

export const LOGOUT_USER = "LOGOUT_USER";
export const LOGIN_USER = "LOGIN_USER";

export const SCREEN1 = "SCREEN1";

export const ROOMS = {
    LOAD_ROOMS: 'LOAD_ROOMS',
    SET_ROOM_LAST_MSG: 'SET_ROOM_LAST_MSG',
    UNREAD_MSG_COUNT_INC: 'UNREAD_MSG_COUNT_INC',
    UNREAD_MSG_COUNT_RESET: 'UNREAD_MSG_COUNT_RESET',
    SET_UNREAD_MSG_COUNT: 'SET_UNREAD_MSG_COUNT'
}

export const CHAT = {
    SET_PREVIOUS_MESSAGES: 'SET_PREVIOUS_MESSAGES',
    SET_NEW_MESSAGES: 'SET_NEW_MESSAGES',
    SET_WEBSOCKET_MSG: 'SET_WEBSOCKET_MSG',
    OPEN_CHAT_POPUP: 'OPEN_CHAT_POPUP',
    CLOSE_CHAT_POPUP: 'CLOSE_CHAT_POPUP'
}
