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

const ModificatorType = PropTypes.oneOfType([PropTypes.number, PropTypes.bool]);

const offsetProps = DIMENSION_NAMES.map((d) => d + "Offset");
const DimensionPropTypes = DIMENSION_NAMES.reduce((propTypes, dimension) => {
  propTypes[dimension] = ModificatorType;
  propTypes[dimension + "Offset"] = PropTypes.number;
  return propTypes;
}, {});

const Col = styled.div`
  box-sizing: border-box;
  flex: 0 0 auto;
  padding-right: ${(p) => config(p).gutterWidth / 2}rem;
  padding-left: ${(p) => config(p).gutterWidth / 2}rem;

  ${(p) =>
    p.reverse &&
    `
    flex-direction: column-reverse;
  `}

  ${(p) =>
    Object.keys(p)
      .filter((k) => ~DIMENSION_NAMES.indexOf(k))
      .sort(
        (k1, k2) => DIMENSION_NAMES.indexOf(k1) - DIMENSION_NAMES.indexOf(k2)
      )
      .map(
        (k) =>
          config(p).media[k]`${
            Number.isInteger(p[k])
              ? // Integer value
                `
        flex-basis: ${(100 / config(p).gridSize) * p[k]}%;
        max-width: ${(100 / config(p).gridSize) * p[k]}%;
        display: block;
      `
              : // Boolean
              p[k]
              ? // Auto-width
                `
          flex-grow: 1;
          flex-basis: 0;
          max-width: 100%;
          display: block;
        `
              : // Hide element
                "display: none;"
          }`
      )}

  ${(p) =>
    Object.keys(p)
      .filter((k) => ~offsetProps.indexOf(k))
      .map(
        (k) =>
          config(p).media[k.replace(/Offset$/, "")]`
        margin-left: ${(100 / config(p).gridSize) * p[k]}%;
      `
      )}
`;

Col.displayName = "Col";

Col.propTypes = {
  ...DimensionPropTypes,
  reverse: PropTypes.bool,
  children: PropTypes.node,
};

export default Col;
