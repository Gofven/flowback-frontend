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

import axios from "axios";
import { getLocalStorage } from "./localStorage";
const { REACT_APP_PROXY } = process.env;

const API = axios.create({
  baseURL: localStorage.getItem('rootUrl') || REACT_APP_PROXY,
  // timeout: 1000,
  headers: { "Content-Type": "application/json" },
});

API.interceptors.request.use((config) => {
  const token = getLocalStorage("jwtToken");
  if (token) config.headers.Authorization = "token " + token;
  return config;
});

export function postRequest(url, data) {
  return API.post(url, data)
    .then((response) => response?.data)
    .catch((error) => error?.response?.data);
}

export function getRequest(url) {
  return API.get(url)
    .then((response) => response?.data)
    .catch((error) => error?.response?.data);
}

export function deleteRequest(url) {
  return API.delete(url)
    .then((response) => response?.data)
    .catch((error) => error?.response?.data);
}

export function putRequest(url, data) {
  return API.put(url, data)
    .then((response) => response?.data)
    .catch((error) => error?.response?.data);
}

export default API;
