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

let WCsession;
let WCconnected = false;

const web3Modal = new WalletConnectModalSign({
  projectId: "4b158e5711a8ed2e288d76772f6beaaf",
  metadata: {
    name: "My Dapp",
    description: "My Dapp description",
    url: "https://my-dapp.com",
    icons: ["https://my-dapp.com/logo.png"],
  },
});

console.log(web3Modal)

function WCToggle(){
    if(WCconnected){
        WCdisconnect()
    }else{
        WCconnect()
    }
}

async function WCconnect() {
  try {
    connectButton.disabled = true;
    WCsession = await web3Modal.connect({
      requiredNamespaces: {
        eip155: {
          methods: ["eth_sendTransaction", "personal_sign"],
          chains: ["eip155:1"],
          events: ["chainChanged", "accountsChanged"],
        },
      },
    });
    console.info(WCsession);

  } catch (err) {
    console.error(err);
  } finally {
    connectButton.disabled = false;
    connectButton.innerHTML = "DISCONNECT";
    WCconnected = true;
    console.info("Wallet Connected");
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
      connectButton.disabled = false;
      connectButton.innerHTML = "CONNECT";
      WCconnected = false;
      console.info("Wallet Disconnected");
    }
  }

connectButton.addEventListener("click", WCToggle);
