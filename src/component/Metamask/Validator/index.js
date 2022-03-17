import { recoverTypedSignature} from '@metamask/eth-sig-util'
import { useState } from 'react';
import { inputKeyValue } from '../../../utils/common';

export default function Validator () {
    const [validator, setValidator] = useState({data:"", signedData:""})

    const onChange = (e) => {
        setValidator({ ...validator, ...inputKeyValue(e) });
    };

    const validated = (e) => {
        e.preventDefault();
        const recovered = recoverTypedSignature({
            data: JSON.stringify({test: validator.data}),
            signature: validator.signedData,
            version:"V4"
          });

          return recovered;
    }

    return <div>
        <div>Flowback Validator</div>
        <form action="#">
        <div>Hash</div>
        <input type="text" name="data" value={validator.data} onChange={onChange}></input>
        <div>Poll Data</div>
        <input type="text" name="signedData" value={validator.signedData} onChange={onChange}></input>
        <button type="submit" onClick={validated}>Check if true</button>
        </form>
    </div>

}