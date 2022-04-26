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

import { isEmail, isEmpty, isNotEmpty } from "./validate";
import moment from 'moment';
import { removeLocalStorage } from "./localStorage";

export function inputKeyValue(e) {
  const { name, value, checked, type } = e.target;
  const input = type === "checkbox" ? checked : value;
  return { [name]: input };
}

export function checkAnyOneEmpty(data) {
  for (let i in data) {
    if (!!data[i] && typeof data[i] == "object") {
      checkAnyOneEmpty(data[i]);
    } else {
      if (isNotEmpty(data[i])) return true;
    }
  }
  return false;
}

export function onValidation(e) {
  const { value, name } = inputKeyValue(e);
  let errorMessage = "";
  if (isEmpty(value)) {
    errorMessage = "This field is required";
  } else if (name === "email" && !isEmail(value)) {
    errorMessage = "Please enter valid email address";
  }
  return { [name]: errorMessage };
}

export function sortByProperty(property, orderBy) {
  return function (a, b) {
    if (a[property] > b[property]) return orderBy ? -1 : 1;
    else if (a[property] < b[property]) return orderBy ? 1 : -1;

    return 0;
  };
}

export function getOS() {
  let appVersion = navigator.userAgent;
  let OSList = [
    { key: "Windows NT 10.0", value: "Windows 10" },
    { key: "Windows NT 6.2", value: "Windows 8" },
    { key: "Windows NT 6.1", value: "Windows 7" },
    { key: "Windows NT 6.0", value: "Windows Vista" },
    { key: "Windows NT 5.1", value: "Windows XP" },
    { key: "Windows NT 5.0", value: "Windows 2000" },
    { key: "Mac", value: "MacOS" },
    { key: "X11", value: "UNIX" },
    { key: "Linux", value: "Linux" },
  ];
  let OSName = "Unknown OS";

  for (let i = 0; i < OSList.length; i++) {
    let OS = OSList[i];
    if (appVersion.indexOf(OS.key) > 0) {
      OSName = OS.value;
      break;
    }
  }
  return OSName;
}

export function getBrowswerDetail() {
  let browserList = [
    { key: "Opera", value: "Opera" },
    { key: "OPR", value: "Opera" },
    { key: "MSIE", value: "Microsoft Internet Explorer" },
    { key: "Trident", value: "Microsoft Internet Explorer" },
    { key: "Edg", value: "Microsoft Edge" },
    { key: "Chrome", value: "Google Chrome" },
    { key: "Safari", value: "Apple Safari" },
    { key: "Firefox", value: "Mozilla Firefox" },
    { key: "SamsungBrowser", value: "Samsung Internet" },
  ];
  let navUserAgent = navigator.userAgent;
  let browserName = "unknown";
  for (let i = 0; i < browserList.length; i++) {
    let browser = browserList[i];
    if (navUserAgent.indexOf(browser.key) > -1) {
      browserName = browser.value;
      break;
    }
  }

  return browserName;
}

export function getFillColor(isFilled) {
  return isFilled ? "#d7744c" : "#d2d0e5";
}

export const formatDate = (date, format = 'DD/MM/YYYY') => {
  return moment(date).format(format);
}

export const FormatComments = (inputComments) => {

  return inputComments
  //return inputComments || []
  const comments = [];
  const inputData = inputComments.slice();
  //Root comments with no replies are placed in the set
  inputData.forEach((comment,) => {
    if (!comment.reply_to) {
      comments.push({ ...comment, reply: [] });
    }
  })



  inputData.forEach((input) => {
    if (input.reply_to) {
      const index = comments.findIndex((comment) => comment.id === input.reply_to);
      if (index >= 0) {
        const reply = comments[index].reply || [];
        reply.push({ ...input, reply: [] });
        comments[index].reply = reply;
      }
    }
  })

  console.log('input', inputComments);
  console.log('output', comments);
  return comments || [];
}

export const logOut = () => {
  removeLocalStorage('jwtToken');
  removeLocalStorage('user');
  document.cookie = "sessionid_flowback=; csrftoken=; path=/";
}