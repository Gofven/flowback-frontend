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
import styled, { css } from "styled-components";
import config, { DIMENSION_NAMES } from "./config";

const Grid = styled.div`
  margin-right: auto;
  margin-left: auto;
  padding-right: ${(p) => config(p).outerMargin + "rem"};
  padding-left: ${(p) => config(p).outerMargin + "rem"};

  ${(p) =>
    !p.fluid &&
    css`
      ${DIMENSION_NAMES.map(
        (t) =>
          config(p).container[t] &&
          config(p).media[t]`
        width: ${(p) => config(p).container[t]}rem;
      `
      )}
    `}
`;

Grid.displayName = "Grid";

Grid.propTypes = {
  fluid: PropTypes.bool,
  children: PropTypes.node,
};

export default Grid;
