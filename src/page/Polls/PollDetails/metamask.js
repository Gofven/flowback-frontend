import { useState, useEffect } from "react";

export default function Metamask() {
    const [account, setAccount] = useState();

    const connectToMetamask = () => {
        window.ethereum.request({ method: 'eth_requestAccounts' }).then(accounts => {
            setAccount(accounts[0]);
            // console.log(response)
        });
    }

    useEffect(() => {
        if (window.ethereum.selectedAddress) {
            setAccount(window.ethereum.selectedAddress);
        }
    })


    return <div>
        <div>
            {account ?
                `Your account is: ${account}`
                :
                <button onClick={connectToMetamask}>
                    Authenticate with Metamask
                </button>}
        </div>
    </div>
}