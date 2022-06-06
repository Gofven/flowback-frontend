import { decryptSafely, encrypt, encryptSafely, getEncryptionPublicKey, recoverPersonalSignature } from '@metamask/eth-sig-util';
import { useState } from 'react';
import { inputKeyValue } from '../../../utils/common';
import './validator.css';
import Layout1 from '../../../layout/Layout1';

export default function Validator() {
  const [validator, setValidator] = useState({
    data: '',
    signedData: '',
    privateKey: '',
    publicKey: ''
  });
  const [message, setMessage] = useState("")

  const onChange = (e) => {
    setValidator({ ...validator, ...inputKeyValue(e) });
  };
  
  const validated = (e) => {
    e.preventDefault();
    
    // const publicKey = getEncryptionPublicKey("5d46203f6060b6be023d95714c23f329d49a4f2315ec9cd4907edae66b125f1b")
    
    // const encryptedMessage = encryptSafely({
    //   version:"x25519-xsalsa20-poly1305",
    //   data:"hewwo",
    //   publicKey:"NrvltMCU/gzvhiCxKj7SlYcY7pumJWhvOVHOdjNO1SY="
    // })

    const parsed = JSON.parse(validator.data)
    
    // console.log(encryptedMessage)
    console.log(parsed)





    const decryptedMessage = decryptSafely({
      encryptedData:parsed,
      privateKey:validator.privateKey,
    })
    console.log(decryptedMessage)

    setMessage(`Successfully validated vote at position ${decryptedMessage.proposalIndex+1}`)
  };

  return (
    <Layout1>
      <div className="validator">
        <form action="#">
        <h1>Flowback Validator</h1>
          <div>Data</div>
          <input
            type="text"
            name="data"
            value={validator.data}
            onChange={onChange}
          ></input>
          <div>MetaMask private Key</div>
          <input
            type="text"
            name="privateKey"
            value={validator.privateKey}
            onChange={onChange}
          ></input>
          <button type="submit" onClick={validated} className="btn btn-primary mt-2">
            Decrypt vote
          </button>
        </form>
       <h1>{message}</h1>
      </div>
    </Layout1>
  );
}
