import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import { web3Provider } from './config'
import Web3 from 'web3';

const providerUrl = web3Provider;

// note: on gatsby static html build window is undefined
const web3 = typeof window === 'undefined'
    ? null
    : new Web3((window as any).ethereum || providerUrl);

const connector = new WalletConnect({
  bridge: "https://bridge.walletconnect.org", // Required
  qrcodeModal: QRCodeModal,
});

export {
  Web3,
  providerUrl,
  web3,
  connector
};
