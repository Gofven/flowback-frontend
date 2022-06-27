import { useState, useEffect } from "react";
import Loader from "../common/Loader/Loader";
import { postRequest, getRequest } from "../../utils/API";
import { encryptSafely, recoverTypedSignature, getEncryptionPublicKey } from '@metamask/eth-sig-util';
import ethUtil from 'ethereumjs-util'
import Web3 from 'web3';
import './metamask.css'

export function ConnectToMetamask() {
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(false);

    const connectToMetamask = () => {
        const userId = JSON.parse(window.localStorage.user).id;
        setLoading(true)
        getMetamaskAddress(userId).then(address => {
            if (address === null || address === "") {
                authenticateAccount()
                    .then(metaMaskAccount => {
                        setAccount(metaMaskAccount);
                        getPublicKey(metaMaskAccount).then(key => {
                            storePublicKey(key, metaMaskAccount)
                            setLoading(false)
                        })
                    });
            }
            else {
                setLoading(false)
                console.warn("Already Signed Up")
            }
        })
    }

    const authenticateAccount = () => {
        return new Promise((resolve, reject) =>
            (window.ethereum?.isMetaMask) ?
                window.ethereum?.request({ method: 'eth_requestAccounts' }).then(accounts => {
                    resolve(accounts[0]);
                }).catch(e => {
                    setLoading(false)
                    console.warn(e)
                    reject();
                }) : console.warn("Not using metamask"))
    }

    const getPublicKey = (address) => {
        let encryptionPublicKey;

        return new Promise((resolve, reject) => window.ethereum
            .request({
                method: 'eth_getEncryptionPublicKey',
                params: [address], // you must have access to the specified account
            })
            .then((result) => {
                encryptionPublicKey = result;
                resolve(encryptionPublicKey);
            })
            .catch((error) => {
                if (error.code === 4001) {
                    // EIP-1193 userRejectedRequest error
                    console.warn("We can't encrypt anything without the key.");
                } else {
                    console.error(error);
                }
                reject();
            }));
    }

    const storePublicKey = (publicKey, address) => {
        if (!publicKey) publicKey = "";

        postRequest("api/v1/me/update_public_key", { public_key: publicKey, address }).then(response => {
            console.log(response);
        }).catch(e => {
            console.warn(e);
        })
    }

    const disconnectMetamask = () => {
        postRequest("api/v1/me/update_public_key", { public_key: null, address: null });
        setAccount();
    }

    useEffect(() => {
        if (account === null) {
            const userId = JSON.parse(window.localStorage.user).id;
            getMetamaskAddress(userId).then(address => {
                setAccount(address);
            })
        }
    })

    return <div>
        {loading && <div>{window.t("If nothing shows up, click the MetaMask icon in your browser")}</div>}
        <Loader loading={loading}>
            {account ?
                <div className="metamask-connection"><span>{window.t("You are connected to MetaMask")}</span>
                    <button className="btn btn-outline-primary" onClick={disconnectMetamask}>
                        {window.t("Disconnect from Metamask")}
                    </button></div>
                :
                <div className="metamask-connection"><span>{window.t("You are not connected to MetaMask")}</span>
                    <button className="btn btn-primary" onClick={connectToMetamask}>
                        {window.t("Connect to MetaMask")}
                    </button>
                </div>}

            <button className="btn btn-info mt-2" onClick={() => window.location = "/validator"}>{window.t("Go to Validator")}</button >
        </Loader>
    </div>
}

export function signData(data, userId, counterProposals, proposalIndexes, proposal) {
    return new Promise((resolve, reject) => {
        getMetamaskAddress(userId).then(userAccount => {
            const user = JSON.parse(window.localStorage.user)

            // data.positive.forEach((hashAndId, i) => {
            //     const matchingProposal = counterProposals.find(counterProposal => hashAndId.proposal === counterProposal.id);                
            //     // data[i].title = matchingProposal.title;
            // });

            console.log(data)

            const msgParams = JSON.stringify({
                domain: {
                    // Defining the chain aka Rinkeby testnet or Ethereum Main Net
                    chainId: 1,
                    // Give a user friendly name to the specific contract you are signing for.
                    name: `Hello, ${user.first_name}. Confirm encrypting your voting data`,
                    // If name isn't enough add verifying contract to make sure you are establishing contracts with the proper entity
                    verifyingContract: userAccount,
                    // Just let's you know the latest version. Definitely make sure the field name is correct.
                    version: '1',
                },

                // Defining the message signing data content.
                message: {
                    /*
                     - Anything you want. Just a JSON Blob that encodes the data you want to send
                     - No required fields
                     - This is DApp Specific
                     - Be as explicit as possible when building out the message schema.
                    */
                    contents: data,

                },
                // Refers to the keys of the *types* object below.
                primaryType: 'Data',
                types: {
                    EIP712Domain: [
                        { name: 'name', type: 'string' },
                        { name: 'version', type: 'string' },
                        { name: 'chainId', type: 'uint256' },
                        { name: 'verifyingContract', type: 'address' },
                    ],
                    Group: [
                        { name: 'name', type: 'string' },
                    ],
                    // Refer to PrimaryType
                    Data: [
                        { name: 'contents', type: 'Polls' },
                    ],
                    Polls: [
                        { name: "positive", type: "Poll[]" },
                        { name: "negative", type: "Poll[]" }
                    ],
                    Poll: [
                        { name: 'proposal', type: "uint256" },
                        { name: "hash", type: "string" }
                    ]
                },
            })

            const web3 = new Web3(window.ethereum);
            web3.currentProvider.send({ method: 'eth_signTypedData_v4', params: [userAccount, msgParams], from: userAccount },
                function (err, results) {
                    if (err) reject(err);
                    else {

                        const types = {
                            EIP712Domain: [],
                            Message: [{ name: 'Data', type: 'Polls' },
                            ],
                        };
                        resolve(results.result);
                    }
                })
        })
    })
}

export function encrypt(data) {
    return new Promise((resolve, reject) => {
        getPublicKeyFromDatabase().then(() => {
            const publicKey = getEncryptionPublicKey("f8cc7c2adb8060f36fdfcf1feb2a0a1bf2b8d1445a7d8beb0ffdbf0a611ffd94")
            if (publicKey) {
                const encryptedMessage = encryptSafely({ publicKey: publicKey, data: data, version: "x25519-xsalsa20-poly1305" });
                resolve(encryptedMessage.ciphertext);
            }
        })
    })
}

export function encryptWithPublicKey(data) {
    const publicKey = getEncryptionPublicKey("5d46203f6060b6be023d95714c23f329d49a4f2315ec9cd4907edae66b125f1b")
    const encryptedMessage = encryptSafely({ publicKey: publicKey, data: data, version: "x25519-xsalsa20-poly1305" });
    return encryptedMessage.ciphertext;
}

export function getPublicKeyFromDatabase(userId) {
    return new Promise((resolve, reject) => {

        window.ethereum.request({
            method: 'eth_getEncryptionPublicKey',
            params: ["0xd6b9b07CCc0e6c2c6eD4259ee802396e6aBF825D"],
        }).then(a => resolve(a))
        // getRequest("api/v1/me/get_public_key", { user: userId }).then(res => {
        //     resolve(res.public_key);
        // }).catch(() => {
        //     reject(null);
        // })
    })
}

function getMetamaskAddress(userId) {
    return new Promise((resolve, reject) => {
        getRequest("api/v1/me/get_public_key", { user: userId }).then(res => {
            resolve(res.address);
        }).catch(() => {
            reject(null);
        })
    })
}



export function isSignedIn() {
    // if (window.ethereunm)
    // window.ethereum.request({ method: 'eth_requestAccounts' }).then(response => {
    //     if (response[0]) return true;
    // }).catch(() => {
    //     return false;
    // });
}