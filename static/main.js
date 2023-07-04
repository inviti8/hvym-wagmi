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

// 1. Define chains
const chains = [mainnet, polygon, avalanche, arbitrum];

// 1. Define ui elements
const connectButton = document.getElementById("connect-button");
const disconnectButton = document.getElementById("disconnect-button");

let session;

// 2. Create modal client, add your project id
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

// 3. Connect
async function onConnect() {
  try {
    connectButton.disabled = true;
    session = await web3Modal.connect({
      requiredNamespaces: {
        eip155: {
          methods: ["eth_sendTransaction", "personal_sign"],
          chains: ["eip155:1"],
          events: ["chainChanged", "accountsChanged"],
        },
      },
    });
    console.info(session);
  } catch (err) {
    console.error(err);
  } finally {
    connectButton.disabled = false;
  }
}

async function onDisconnect() {
    try {
      await web3Modal.disconnect({
        topic: session.topic,
        code: 6000,
        message: "User disconnected",
      });
    } catch (e) {
      console.log(e);
    }
  }

// 4. Create connection handler
connectButton.addEventListener("click", onConnect);
disconnectButton.addEventListener("click", onDisconnect);