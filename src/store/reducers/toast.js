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

import { ADD_TOAST, REMOVE_TOAST } from "../types";

const initialState = {
  duration: 4000,
  message: "",
  open: false,
  severity: "success",
};

export default function toast(state = initialState, action) {
  const { payload, type } = action;

  switch (type) {
    case ADD_TOAST:
      const { message, severity } = payload;

      return {
        ...state,
        message: message,
        severity: severity ? severity : state.severity,
        open: true,
      };

    case REMOVE_TOAST:
      return {
        ...state,
        message: "",
        severity: "success",
        open: false,
      };

    default:
      return state;
  }
}
