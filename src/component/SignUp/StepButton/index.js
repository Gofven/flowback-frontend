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

import React from "react";

export default function StepButton({
  stepNumber,
  totalStep,
  OnPrevious,
  OnNext,
}) {
  return (
    <div className="row">
      {/* <div className="col-6"> */}
        {/* <div
          className="register-btn register-btn1 prev"
        >
          {stepNumber} Step / {totalStep} Step
        </div> */}
      {/* </div> */}
      <div className="col-6" style={{"boxShadow":"1000px", "marginLeft":"25%"}}>
        <button
          type="button"
          className="btn register-btn register-btn2 next btn-hover"
          onClick={OnNext}
        >
          Next Step
        </button>
      </div>
    </div>
  );
}
