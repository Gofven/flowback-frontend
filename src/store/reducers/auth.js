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

import {
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from "../../utils/localStorage";
import { LOGOUT_USER, LOGIN_USER } from "../types";

const initialState = {
  token: getLocalStorage("jwtToken"),
  user: getLocalStorage("user"),
};

export default function auth(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case LOGIN_USER:
      const { token, user } = payload;

      setLocalStorage("user", user);
      setLocalStorage("jwtToken", token);
      return {
        ...state,
        ...payload,
      };
    case LOGOUT_USER:
      removeLocalStorage("jwtToken");
      removeLocalStorage("user");
      return initialState;
    default:
      return state;
  }
}
