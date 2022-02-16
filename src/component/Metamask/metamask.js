import { useState, useEffect } from "react";
import Loader from "../common/Loader";
import { postRequest, getRequest } from "../../utils/API";
// import { ethUtil } from 'ethereumjs-util'
import { encryptSafely } from '@metamask/eth-sig-util'


export function ConnectToMetamask() {
    const [account, setAccount] = useState();
    const [loading, setLoading] = useState(false);

    const connectToMetamask = () => {
        const userId = JSON.parse(window.localStorage.user).id;
        setLoading(true)
        getMetamaskAdress(userId).then(address => {
            if (address === null) {
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

    let onMount = false
    useEffect(() => {
        if (!onMount) {
            const userId = JSON.parse(window.localStorage.user).id;
            getMetamaskAdress(userId).then(address => {
                setAccount(address);
                onMount = true;
            })
        }
    })

    return <div>
        <Loader loading={loading}>
            {account ?
                <div><span>Your MetaMask account is: ${account}</span>
                    <button className="btn btn-outline-warning" onClick={disconnectMetamask}>
                        Disconnect from Metamask
                    </button></div>
                :
                <button className="btn btn-outline-primary" onClick={connectToMetamask}>
                    Connect to MetaMask
                </button>}
        </Loader>

    </div>
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

function getMetamaskAdress(userId) {
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