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

export const isEmpty = (value) =>
  value === undefined ||
  value === null ||
  (typeof value === "object" && Object.keys(value).length === 0) ||
  (typeof value === "string" && value.trim().length === 0);

export const isNotEmpty = (value) => !isEmpty(value);

export function isNumeric(value) {
  return /^-?\d+$/.test(value);
}
export function isMobile(value) {
  return /^\+?([0-9]{2})?\)?[ ]?([0-9]{10})$/.test(value);
}
export function isEmail(value) {
  let reg = /\S+@\S+\.\S+/;
  return reg.test(value);
}
export function clone(array) {
  return JSON.parse(JSON.stringify(array));
}
export function isValidMobileNumber(value) {
  let size = value.length;
  return (
    size <= 14 &&
    (value === "" ||
      (size === 1 && value[0] === "+") ||
      (size === 4 && value[3] === " ") ||
      isNumeric(value.replace("+", "").replace(" ", "")))
  );
}
