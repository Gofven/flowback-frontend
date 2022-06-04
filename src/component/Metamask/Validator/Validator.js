import { decryptSafely, encrypt, encryptSafely, getEncryptionPublicKey, recoverPersonalSignature } from '@metamask/eth-sig-util';
import { useState } from 'react';
import { inputKeyValue } from '../../../utils/common';
import './validator.css';

export default function Validator() {
  const [validator, setValidator] = useState({
    data: '',
    signedData: '',
    privateKey: '',
    publicKey: ''
  });

  const onChange = (e) => {
    setValidator({ ...validator, ...inputKeyValue(e) });
  };
  
  const validated = (e) => {
    e.preventDefault();
    
    const publicKey = getEncryptionPublicKey("5d46203f6060b6be023d95714c23f329d49a4f2315ec9cd4907edae66b125f1b")
    
    const encryptedMessage = encryptSafely({
      version:"x25519-xsalsa20-poly1305",
      data:"foo",
      publicKey
    })

    const decryptedMessage = decryptSafely({
      encryptedData:encryptedMessage,
      privateKey:validator.privateKey,
    })

    console.log(decryptedMessage)
  };

  return (
    <div className="validator">
      <div>
        <div>Flowback Validator</div>
        <form action="#">
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
          <button type="submit" onClick={validated}>
            Decrypt vote
          </button>
        </form>
      </div>
    </div>
  );
}
