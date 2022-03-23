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

import PropTypes from "prop-types";
import styled from "styled-components";

import config, { DIMENSION_NAMES } from "../config";

const ModificatorType = PropTypes.oneOf(DIMENSION_NAMES);

const Row = styled.div`
  box-sizing: border-box;
  display: flex;
  flex: 0 1 auto;
  flex-direction: row;
  flex-wrap: wrap;
  margin-right: ${(p) => (config(p).gutterWidth / 2) * -1}rem;
  margin-left: ${(p) => (config(p).gutterWidth / 2) * -1}rem;

  ${(p) =>
    p.reverse &&
    `
    flex-direction: row-reverse;
  `}

  ${(p) =>
    p.start &&
    config(p).media[p.start]`
    justify-content: flex-start;
  `}

  ${(p) =>
    p.center &&
    config(p).media[p.center]`
    justify-content: center;
  `}

  ${(p) =>
    p.end &&
    config(p).media[p.end]`
    justify-content: flex-end;
  `}

  ${(p) =>
    p.top &&
    config(p).media[p.top]`
    align-items: flex-start;
  `}

  ${(p) =>
    p.middle &&
    config(p).media[p.middle]`
    align-items: center;
  `}

  ${(p) =>
    p.bottom &&
    config(p).media[p.bottom]`
    align-items: flex-end;
  `}

  ${(p) =>
    p.around &&
    config(p).media[p.around]`
    justify-content: space-around;
  `}

  ${(p) =>
    p.between &&
    config(p).media[p.between]`
    justify-content: space-between;
  `}

  ${(p) =>
    p.first &&
    config(p).media[p.first]`
    order: -1;
  `}

  ${(p) =>
    p.last &&
    config(p).media[p.last]`
    order: 1;
  `}
`;

Row.displayName = "Row";

Row.propTypes = {
  reverse: PropTypes.bool,
  start: ModificatorType,
  center: ModificatorType,
  end: ModificatorType,
  top: ModificatorType,
  middle: ModificatorType,
  bottom: ModificatorType,
  around: ModificatorType,
  between: ModificatorType,
  first: ModificatorType,
  last: ModificatorType,
  children: PropTypes.node,
};

export default Row;
