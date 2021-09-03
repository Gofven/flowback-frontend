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

import styled from "styled-components";

export const Textbox = styled.input`
  font-size: 16px;
  font-weight: 600;
  color: #575757;
  height: 50px;
  border-radius: 10px;
  border: 1px solid #d4d4d4;
  padding: .375rem .75rem;
  transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
  width: 100%;

::placeholder {
  color: #a8a8a8;
}


  &:focus {
    outline-width:0px;
    background-color: rgba(2, 100, 195, 0.05);
    border-color: #0264c3;
`;
