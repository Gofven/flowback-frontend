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

import { formatDate, sortByProperty } from './common';
let data = [
  { number: 123, name: 'pqr' },
  { number: 234, name: 'xyz' },
  { number: 412, name: 'abc' },
  { number: 634, name: 'ghi' },
];
//----------------------sortByProperty--------------------------
test('sortByProperty number is valid', () => {
  expect(data.sort(sortByProperty('number', true))).toStrictEqual([
    { number: 634, name: 'ghi' },
    { number: 412, name: 'abc' },
    { number: 234, name: 'xyz' },
    { number: 123, name: 'pqr' },
  ]);
});

//----------------------sortByProperty--------------------------
test('sortByProperty number is valid', () => {
  expect(data.sort(sortByProperty('number', false))).toStrictEqual([
    { number: 123, name: 'pqr' },
    { number: 234, name: 'xyz' },
    { number: 412, name: 'abc' },
    { number: 634, name: 'ghi' },
  ]);
});

//----------------------sortByProperty--------------------------
test('sortByProperty number is valid', () => {
  expect(data.sort(sortByProperty('number'))).toStrictEqual([
    { number: 123, name: 'pqr' },
    { number: 234, name: 'xyz' },
    { number: 412, name: 'abc' },
    { number: 634, name: 'ghi' },
  ]);
});

//----------------------sortByProperty--------------------------
test('sortByProperty string is valid', () => {
  expect(data.sort(sortByProperty('name'))).toStrictEqual([
    { number: 412, name: 'abc' },
    { number: 634, name: 'ghi' },
    { number: 123, name: 'pqr' },
    { number: 234, name: 'xyz' },
  ]);
});

//----------------------sortByProperty--------------------------
test('sortByProperty string is valid', () => {
  expect(data.sort(sortByProperty('name', true))).toStrictEqual([
    { number: 234, name: 'xyz' },
    { number: 123, name: 'pqr' },
    { number: 634, name: 'ghi' },
    { number: 412, name: 'abc' },
  ]);
});

const dateData = [
  { date: '2000-12-09' },
  { date: '2000-11-09' },
  { date: '2000-11-07' },
  { date: '1998-11-07' },
];
//----------------------sortByProperty--------------------------
test('sort By date in descending order', () => {
  expect(dateData.sort(sortByProperty('date', true))).toStrictEqual([
    { date: '2000-12-09' },
    { date: '2000-11-09' },
    { date: '2000-11-07' },
    { date: '1998-11-07' },
  ]);
});

test('sort By date in ascending order', () => {
  expect(dateData.sort(sortByProperty('date'))).toStrictEqual([
    { date: '1998-11-07' },
    { date: '2000-11-07' },
    { date: '2000-11-09' },
    { date: '2000-12-09' },
  ]);
});

//----------------------formatDate--------------------------
test('fromat date on expectation', () => {
  expect(formatDate('1999-06-12', 'YY.MM.DD')).toBe('99.06.12');
});
