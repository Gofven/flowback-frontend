import { decryptSafely, getEncryptionPublicKey } from '@metamask/eth-sig-util';
import { useState } from 'react';
import { inputKeyValue } from '../../../utils/common';
import './validator.css';
import * as nacl from 'tweetnacl';
import * as naclUtil from 'tweetnacl-util'

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
    // const recovered = recoverTypedSignature({
    //     data: JSON.stringify({test: validator.data}),
    //     signature: validator.signedData,
    //     version:"V4"
    //   });f
    const unencodedNonce = nacl.randomBytes(nacl.box.nonceLength);
    const nonce = naclUtil.encodeBase64(unencodedNonce);
    const publicKey = getEncryptionPublicKey(validator.privateKey)
    const decryptedMessege = decryptSafely({
      encryptedData: {
        ciphertext: validator.data,
        version: "x25519-xsalsa20-poly1305",
        ephemPublicKey: publicKey,
        nonce: nonce
      },
      privateKey: validator.privateKey
    })

    // const decryptedMessege = decryptSafely({ 
    //   encryptedData: validator.data, 
    //   privateKey: validator.privateKey, 
    //   version:"x25519-xsalsa20-poly1305"
    // }); 

    // expect(decryptedMessege).toBe(validator.data); 

    console.log('The decrypted message is:', decryptedMessege)




  };

  return (
    <div className="validator">
      <div>
        <div>Flowback Validator</div>
        <form action="#">
          <div>Hash</div>
          <input
            type="text"
            name="data"
            value={validator.data}
            onChange={onChange}
          ></input>
          <div>MetaMask Private Key</div>
          <input
            type="text"
            name="privateKey"
            value={validator.privateKey}
            onChange={onChange}
          ></input>
          <div>MetaMask Public Key</div>
          <input
            type="text"
            name="publicKey"
            value={validator.publicKey}
            onChange={onChange}
          ></input>
          <button type="submit" onClick={validated}>
            Check if true
          </button>
        </form>
      </div>
    </div>
  );
}
