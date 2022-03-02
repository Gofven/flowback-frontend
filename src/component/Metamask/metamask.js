import { useState, useEffect } from "react";
import Loader from "../common/Loader";
import { postRequest, getRequest } from "../../utils/API";
import { encryptSafely } from '@metamask/eth-sig-util';
import Web3 from 'web3';

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
                console.warn("ALREADY SIGNED UP!!!!")
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
                }) : console.warn("not using metamask"))

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
                    console.log("We can't encrypt anything without the key.");
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
        <Loader loading={loading}>
            {account ?
                <div className="metamask-connection"><span>Your are connected to MetaMask</span>
                    <button className="btn btn-outline-warning" onClick={disconnectMetamask}>
                        Disconnect from Metamask
                    </button></div>
                :
                <div className="metamask-connection"><span>Your are not connected to MetaMask</span>
                    <button className="btn btn-outline-primary" onClick={connectToMetamask}>
                        Connect to MetaMask
                    </button>
                </div>}
        </Loader>
    </div>
}

export function signData(data, userId, counterProposals, proposalIndexes, proposal) {
    return new Promise((resolve, reject) => {
        getMetamaskAddress(userId).then(userAccount => {
            const user = JSON.parse(window.localStorage.user)

            // const presentableData = data.positive.foreach(data =>
            //     counterProposals.find(counterProposal =>
            //         data === counterProposal.id
            //     )
            // )

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
                primaryType: 'Mail',
                types: {
                    // TODO: Clarify if EIP712Domain refers to the domain the contract is hosted on
                    EIP712Domain: [
                        { name: 'name', type: 'string' },
                        { name: 'version', type: 'string' },
                        { name: 'chainId', type: 'uint256' },
                        { name: 'verifyingContract', type: 'address' },
                    ],
                    // Not an EIP712Domain definition
                    Group: [
                        { name: 'name', type: 'string' },
                    ],
                    // Refer to PrimaryType
                    Mail: [
                        { name: 'contents', type: 'Polls' },
                    ],
                    Polls: [
                        { name: "positive", type: "Poll[]" },
                        { name: "negative", type: "Poll[]" }
                    ],
                    Poll: [
                        { name: 'proposal', type: "uint256" },

                    ]
                },
            })

            const web3 = new Web3(window.ethereum);
            web3.currentProvider.send({ method: 'eth_signTypedData_v4', params: [userAccount, msgParams], from: userAccount },
                function (err, results) {
                    if (err) reject(err);
                    else resolve(results.result);
                })

        })
    })
}

export function encrypt(data) {
    return new Promise((resolve, reject) => {
        getPublicKeyFromDatabase().then(publicKey => {
            if (publicKey) {
                const encryptedMessage = encryptSafely({ publicKey: publicKey, data: data, version: "x25519-xsalsa20-poly1305" });
                resolve(encryptedMessage.ciphertext);
            }
        })
    })
}

export function encryptWithPublicKey(data, publicKey) {
    const encryptedMessage = encryptSafely({ publicKey: publicKey, data: data, version: "x25519-xsalsa20-poly1305" });
    return encryptedMessage.ciphertext;
}

export function getPublicKeyFromDatabase(userId) {
    return new Promise((resolve, reject) => {
        getRequest("api/v1/me/get_public_key", { user: userId }).then(res => {
            resolve(res.public_key);
        }).catch(() => {
            reject(null);
        })
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