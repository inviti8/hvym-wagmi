import { WalletConnectModalSign } from "https://unpkg.com/@walletconnect/modal-sign-html@2.5.8";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
  WagmiCore,
  WagmiCoreChains,
  WagmiCoreConnectors,
} from "https://unpkg.com/@web3modal/ethereum@2.6.2";

import { Web3Modal } from "https://unpkg.com/@web3modal/html@2.6.2";

// 0. Import wagmi dependencies
const { mainnet, polygon, avalanche, arbitrum } = WagmiCoreChains;
const { configureChains, createConfig } = WagmiCore;

const chains = [mainnet, polygon, avalanche, arbitrum];

let connectButton = document.getElementById("connect-button");
//const signButton = document.getElementById("sign-button");

window.WCsession = null;
window.WCconnected = false;
window.account = null;
window.signature = null;

let web3Modal = null;
let WCsession = null;

window.WCinit = function(projectId, name, description, url, icons){
    web3Modal = new WalletConnectModalSign({
      projectId: projectId,
      metadata: {
        name: name,
        description: description,
        url: url,
        icons: icons,
      },
    });

    web3Modal.onSessionEvent((event) => {
        if(event == "chainChanged"){
            console.info("Chain changed.")

        }
        if(event == "accountsChanged"){
            console.info("Chain changed.")

        }
        if(event == "session_deleted"){
            console.info("Session deleted.")
            WCreset();
        }
    });

    console.log(web3Modal);
}

window.setConnectButton = function(btn){
    connectButton = btn;
}

window.WCToggle = function(){
    if(window.WCconnected){
        WCdisconnect()
    }else{
        WCconnect()
    }
}

window.WCreset = function(){
    connectButton.disabled = false;
    connectButton.innerHTML = "CONNECT";
    window.account = null;
    window.signature = null;
    window.WCconnected = false;
}

window.WCconnect = async function(callback = null) {
  try {
    connectButton.disabled = true;
    WCsession = await web3Modal.connect({
      requiredNamespaces: {
        eip155: {
          methods: ["personal_sign"],
          chains: ["eip155:1"],
          events: ["chainChanged", "accountsChanged", "session_deleted"],
        },
      },
    });
    console.info(WCsession);
    console.info(WCsession.namespaces.eip155.accounts)

  } catch (err) {
    console.error(err);
  } finally {
    connectButton.disabled = false;
    connectButton.innerHTML = "DISCONNECT";
    window.WCsession = WCsession;
    window.account = WCsession.namespaces.eip155.accounts[0].slice(9);
    window.WCconnected = true;
    console.info("Wallet Connected");
    if (typeof callback === "function") {
        callback();
    }
  }
}

window.WCsignNonce = async function(nonce, callback = null){

    if(window.account != null){
        try {
            window.signature = await web3Modal.request({
                topic: WCsession.topic,
                chainId: 'eip155:1',
                request: {
                    method: "personal_sign",
                    params: [
                      window.account,
                      nonce,
                    ]
                }
            });

        } catch (err) {
            console.error(err);
        } finally {
            console.info("Transaction signed.")
            if (typeof callback === "function") {
                callback(window.signature);
            }
        }
    }

}

window.WCdisconnect = async function(callback = null) {
    try {
      await web3Modal.disconnect({
        topic: WCsession.topic,
        code: 6000,
        message: "User disconnected",
      });
    } catch (e) {
      console.log(e);
    } finally {
      WCreset();
        console.info("Wallet Disconnected");
        if (typeof callback === "function") {
            callback();
        }
    }
}

if(connectButton != null){
  connectButton.addEventListener("click", WCToggle);  
}

//initialization example:
//WCinit("4b158e5711a8ed2e288d76772f6beaaf", "My Dapp", "My Dapp description", "https://my-dapp.com", ["https://my-dapp.com/logo.png"]);

