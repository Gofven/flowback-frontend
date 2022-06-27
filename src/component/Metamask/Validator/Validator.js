import { decryptSafely, encrypt, encryptSafely, getEncryptionPublicKey, recoverPersonalSignature } from '@metamask/eth-sig-util';
import { useState } from 'react';
import { inputKeyValue } from '../../../utils/common';
import './validator.css';
import Layout1 from '../../../layout/Layout1';
import { getRequest } from '../../../utils/API';
import { useEffect } from 'react';

export default function Validator() {
  const [validator, setValidator] = useState({
    data: '',
    signedData: '',
    privateKey: '',
    publicKey: ''
  });
  const [message, setMessage] = useState("")

  useEffect(() => {
    const params = new URLSearchParams(document.location.search);
    if (params.length > 0){
      const jsonStoredURL = new URL(params.get("json"))
      getRequest(jsonStoredURL.pathname).then(data => {
        setValidator({ ...validator, data: JSON.stringify(data) })
      })
    }
  }, [])

  const onChange = (e) => {
    setValidator({ ...validator, ...inputKeyValue(e) });
  };

  const decryptVote = vote => {

    let parsedVote = vote;

    try {
      parsedVote = JSON.parse(vote.hash.replaceAll(/\\\"/gm, "\""))
    } catch (error) {
      setMessage("Something went wrong with the data")
      console.error(error)
    }

    try {
      const decryptedMessage = decryptSafely({
        encryptedData: parsedVote,
        privateKey: validator.privateKey,
      })
      return (decryptedMessage)

    } catch (error) {
      setMessage(window.t("Something wen't wrong with decryption"))
      console.error(error)
    }
  }

  const validated = (e) => {
    e.preventDefault();

    const data = JSON.parse(validator.data)
    const decryptedProposals = []

    data.proposals.forEach(proposal => {
      proposal.votes.forEach(vote => {
        const decryptedVote = decryptVote(vote)
        decryptedVote && decryptedProposals.push(decryptedVote)
      })
    });


    if (decryptedProposals.length > 0)
      setMessage(`${window.t("Succesfully validated")} ${decryptedProposals.length} ${window.t("votes")}`)

  };

  return (
    <Layout1>
      <div className="validator">
        <form action="#">
          <h1>{window.t("Flowback Validator")}</h1>
          <div>Data</div>
          <textarea
            type="text"
            name="data"
            value={validator.data}
            onChange={onChange}
          ></textarea>
          <div>MetaMask {window.t("private key")}</div>
          <input
            type="text"
            name="privateKey"
            value={validator.privateKey}
            onChange={onChange}
          ></input>
          <button type="submit" onClick={validated} className="btn btn-primary mt-2">
            {window.t("Decrypt vote")}
          </button>
          <div>{message}</div>
        </form>
      </div>
    </Layout1>
  );
}
