import { useState, useEffect } from "react";
import Loader from "../common/Loader";

export function ConnectToMetamask() {
    const [account, setAccount] = useState();
    const [loading, setLoading] = useState(false);

    const connectToMetamask = () => {
        setLoading(true)
        window.ethereum?.request({ method: 'eth_requestAccounts' }).then(accounts => {
            setLoading(false)
            if (window.ethereum?.isMetaMask)
                setAccount(accounts[0]);
            else
                console.warn("not using metamask")
        }).catch(e => {
            setLoading(false)
            console.warn(e)
        });
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
                <button onClick={connectToMetamask}>
                    Authenticate with Metamask
                </button>}
        </Loader>

    </div>
}

export function isSignedIn() {
    window.ethereum.request({ method: 'eth_requestAccounts' }).then(response => {
        console.log(response)
    });
}