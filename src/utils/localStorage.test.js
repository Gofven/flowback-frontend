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

import { get, set } from './localStorage';
//----------------------get--------------------------
test('get b is empty', () => {
  expect(get('b')).toBe('');
});

test('get a is equal to 123', () => {
  set('a', 123);
  expect(get('a')).toBe(123);
});

test('get a is equal to true', () => {
  set('a', true);
  expect(get('a')).toBe(true);
});

test('get b is equal to "xyz"', () => {
  set('b', 'xyz');
  expect(get('b')).toBe('xyz');
});

test('get b is equal to [1,2,3]', () => {
  set('b', [1, 2, 3]);
  expect(get('b')).toStrictEqual([1, 2, 3]);
});

test('get b is equal to [{a:1},{a:2},{a:3}]', () => {
  set('b', [{ a: 1 }, { a: 2 }, { a: 3 }]);
  expect(get('b')).toStrictEqual([{ a: 1 }, { a: 2 }, { a: 3 }]);
});
