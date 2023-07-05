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

const connectButton = document.getElementById("connect-button");
const signButton = document.getElementById("sign-button");

let WCsession;
let WCconnected = false;
let account = null;
let signature = null;

const web3Modal = new WalletConnectModalSign({
  projectId: "4b158e5711a8ed2e288d76772f6beaaf",
  metadata: {
    name: "My Dapp",
    description: "My Dapp description",
    url: "https://my-dapp.com",
    icons: ["https://my-dapp.com/logo.png"],
  },
});

web3Modal.onSessionEvent((event) => {
  console.info("Session Event:", event);
  if(event == "session_deleted"){
    console.info("Session deleted.")
    WCreset();
  }
});

console.log(web3Modal)

function WCToggle(){
    if(WCconnected){
        WCdisconnect()
    }else{
        WCconnect()
    }
}

function WCSign(){
    const nonce = 123456789;
    WCsignNonce(nonce);
}

function WCreset(){
    connectButton.disabled = false;
    connectButton.innerHTML = "CONNECT";
    account = null;
    signature = null;
    WCconnected = false;
}

async function WCconnect(callback = null) {
  try {
    connectButton.disabled = true;
    WCsession = await web3Modal.connect({
      requiredNamespaces: {
        eip155: {
          methods: ["eth_sendTransaction", "personal_sign"],
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
    account = WCsession.namespaces.eip155.accounts[0].slice(9);
    WCconnected = true;
    console.info("Wallet Connected");
    if (typeof callback === "function") {
        callback();
    }
  }
}

async function WCsignNonce(nonce, callback = null){

    if(account != null){
        try {
            signature = await web3Modal.request({
                topic: WCsession.topic,
                chainId: 'eip155:1',
                request: {
                    method: "personal_sign",
                    params: [
                      account,
                      nonce,
                    ]
                }
            });

        } catch (err) {
            console.error(err);
        } finally {
            console.log("Nonce:", nonce);
            console.log("Address:", account);
            console.log("Signature:", signature);
            if (typeof callback === "function") {
                callback(nonce, account, signature);
            }
        }
        
    }
}

async function WCdisconnect() {
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
    }
  }

connectButton.addEventListener("click", WCToggle);
signButton.addEventListener("click", WCSign);
