import { useState, useEffect } from "react";
import Loader from "../common/Loader";
import { postRequest, getRequest } from "../../utils/API";

export function ConnectToMetamask({userId}) {
    const [account, setAccount] = useState();
    const [loading, setLoading] = useState(false);

    const connectToMetamask = () => {
        authenticateAccount()
        .then(account=>{
            getPublicKey(account).then(key => {
                storePublicKey(key)   
            })
        });
    }

    const authenticateAccount = () => {
        setLoading(true)
        return new Promise((resolve, reject) => window.ethereum?.request({ method: 'eth_requestAccounts' }).then(accounts => {
            setLoading(false)
            if (window.ethereum?.isMetaMask) setAccount(accounts[0]);
            else console.warn("not using metamask")
            resolve(accounts[0]);

        }).catch(e => {
            setLoading(false)
            console.warn(e)
            reject();
        }));
    }
    
    const getPublicKey = (account) => {
        let encryptionPublicKey;
        
        return new Promise((resolve, reject) => window.ethereum
        .request({
            method: 'eth_getEncryptionPublicKey',
            params: [account], // you must have access to the specified account
        })
        .then((result) => {
            encryptionPublicKey = result;
            resolve(encryptionPublicKey);
            // return encryptionPublicKey;
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

    const storePublicKey = (publicKey) => {
        console.log(publicKey);
        if (!publicKey) publicKey = "";
        postRequest("api/v1/me/update_public_key", {public_key: publicKey}).then(response =>{
            console.log(response);
        }).catch(e => {
            console.warn(e);
        })

    }

    const getPublicKeyFromDatabase = () => {
        getRequest("api/v1/me/get_public_key", {user: userId}).then(res => {
            console.log(res)
        })
    }

    useEffect(() => {
        if (window.ethereum?.selectedAddress) {
            setAccount(window.ethereum.selectedAddress);
        }
    })
    
    
    return <div>
        <Loader loading={loading}>
            {account ?
                `Your account is: ${account}`
                :
                <button className="btn btn-outline-primary" onClick={connectToMetamask}>
                    Authenticate with Metamask
                </button>}
        </Loader>

    </div>
}


export function isSignedIn() {
    // if (window.ethereunm)
    // window.ethereum.request({ method: 'eth_requestAccounts' }).then(response => {
    //     if (response[0]) return true;
    // }).catch(() => {
    //     return false;
    // });
}