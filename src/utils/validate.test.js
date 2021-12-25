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

import {
  isEmpty,
  isNumeric,
  isMobile,
  isEmail,
  clone,
  isValidMobileNumber
} from './validate';
//----------------------isEmpty--------------------------
test('empty string is valid', () => {
  expect(isEmpty('')).toBe(true);
});

test('undefined is valid', () => {
  expect(isEmpty(undefined)).toBe(true);
});

test('null is valid', () => {
  expect(isEmpty(null)).toBe(true);
});

test('{} is valid', () => {
  expect(isEmpty({})).toBe(true);
});
test('[] is valid', () => {
  expect(isEmpty([])).toBe(true);
});

//----------------------isNumeric--------------------------
test('123 is valid', () => {
  expect(isNumeric(123)).toBe(true);
});

test('+123 is valid', () => {
  expect(isNumeric(+123)).toBe(true);
});
test('abc is not valid', () => {
  expect(isNumeric('abc')).toBe(false);
});

//----------------------isMobile--------------------------
test('+91 9725960834 is valid', () => {
  expect(isMobile('+91 9725960834')).toBe(true);
});
test('9725960834 is valid', () => {
  expect(isMobile('9725960834')).toBe(true);
});

test('919725960834 is valid', () => {
  expect(isMobile('919725960834')).toBe(true);
});

test('+919725960834 is valid', () => {
  expect(isMobile('+919725960834')).toBe(true);
});

test('25960834 is not valid', () => {
  expect(isMobile('25960834')).toBe(false);
});
test('qw25960834 is not valid', () => {
  expect(isMobile('qw25960834')).toBe(false);
});

//----------------------isEmail--------------------------
test('hardik.nai92@gmail.com is valid', () => {
  expect(isEmail('hardik.nai92@gmail.com')).toBe(true);
});
test('empty string is valid', () => {
  expect(isEmail('')).toBe(false);
});
test('12345 string is valid', () => {
  expect(isEmail(12345)).toBe(false);
});

//----------------------clone--------------------------
test('check object in object', () => {
  let a = { x: { z: 1 }, y: 2 };
  let b = clone(a);
  b.x.z = 0;
  expect(b.x.z).not.toBe(a.x.z);
});

test('check array in object', () => {
  let a = [{ z: 1 }, { z: 1 }, { z: 1 }];
  let b = clone(a);
  b[1].z = 0;
  expect(b[1].z).not.toBe(a[1].z);
});

test('check array', () => {
  let a = [1, 2, 3];
  let b = clone(a);
  b[1] = 0;
  expect(b[1]).not.toBe(a[1]);
});

test('check object', () => {
  let a = { z: 1 };
  let b = clone(a);
  b.z = 0;
  expect(b.z).not.toBe(a.z);
});

test('check Number', () => {
  let a = 1;
  let b = clone(a);
  b = 0;
  expect(b).not.toBe(a);
});

test('check String', () => {
  let a = 'abc';
  let b = clone(a);
  b = 'dce';
  expect(b).not.toBe(a);
});

//----------------------isValidMobileNumber--------------------------
test('+91 9725960834 string is valid', () => {
  expect(isValidMobileNumber('+91 9725960834')).toBe(true);
});

//----------------------isValidMobileNumber--------------------------
test('9725960834 string is valid', () => {
  expect(isValidMobileNumber('9725960834')).toBe(true);
});
//----------------------isValidMobileNumber--------------------------
test('919725960834 string is valid', () => {
  expect(isValidMobileNumber('919725960834')).toBe(true);
});

//----------------------isValidMobileNumber--------------------------
test('09725960834 string is valid', () => {
  expect(isValidMobileNumber('09725960834')).toBe(true);
});

//----------------------isValidMobileNumber--------------------------
test('91+ 9725960834 string is valid', () => {
  expect(isValidMobileNumber('91+ 9725960834')).toBe(true);
});

//----------------------isValidMobileNumber--------------------------
test('9+19725960834 string is valid', () => {
  expect(isValidMobileNumber('9+19725960834')).toBe(true);
});
