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

import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step13 from "./Step13";
//importing useEffect the "normal" way leads to "undefined error so it's done
//like this instead 
import React, { useState } from "react";
import react from "react";

export default function SignUp() {
  const totalStep = 2;
  const [stepNumber, setStepNumber] = useState(1);
  const [mainState, setMainState] = useState({});
  
  react.useEffect=(() => {
    console.log(mainState, "STATE");
  });

  
  const handleSubmit = () => {

  };

  const renderStep = () => {
    switch (stepNumber) {
      case 1:
        return (
          <Step13
            stepNumber={stepNumber}
            totalStep={totalStep}
            OnPrevious={handleOnPrevious}
            OnNext={handleOnNext}
            mainState={mainState}
            setMainState={setMainState}
            />
            );
            break;
        case 2:
          return (
            <Step2
            stepNumber={stepNumber}
            totalStep={totalStep}
            OnPrevious={handleOnPrevious}
            OnNext={handleOnNext}
            mainState={mainState}
            setMainState={setMainState}
            />
            );
            break;
        case 3:
          return (
            <Step3
            stepNumber={stepNumber}
            totalStep={totalStep}
            OnPrevious={handleOnPrevious}
            OnNext={handleOnNext}
            state={mainState}
            setMainState={setMainState}
            />
            );
        break;
    }
  };

  /**
   * To go next step
   */
  const handleOnNext = () => {
    if (stepNumber < totalStep) setStepNumber(stepNumber + 1);
  };

  /**
   * To go previous step
   */
  const handleOnPrevious = () => {
    if (stepNumber > 1) setStepNumber(stepNumber - 1);
  };
  return <>{renderStep(stepNumber)}</>;
}
