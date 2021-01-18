import { web3 } from './web3';
import BigNumber from 'bignumber.js';

const defaultDecimal = 9;

export const promisify = (promiEvent: any) => {
  return new Promise((resolve, reject) => {
    promiEvent
      // .on('confirmation', (confirmationNumber, receipt) => { // eslint-disable-line
      //   console.log('confirmation: ' + confirmationNumber);
      // })
      .on('error', (err: any) => {
        console.log('reject err : ', err);
        return reject(err);
      })
      .once('transactionHash', (hash: string) => {
        console.log('hash :>> ', hash);
        // return resolve(hash);
      })
      .once('receipt', (receipt: string) => { // eslint-disable-line
        console.log('reciept', receipt);
        return resolve(receipt);
      })
    // .then(console.log)
    // .catch(reject);
  })
}

export const getBalance = async (address: string) => {
  if (!web3) {
    return null;
  }
  const ethBalance = await web3.eth.getBalance(address);
  return ethBalance;
}

export const checkBalance = async (address: string, threshold = 0) => {
  const balance = await getBalance(address);
  if (!balance || parseInt(balance, 10) <= threshold) {
    throw new Error('Insufficient balance');
  }
  return balance;
}

export const callMethod = async (method: Function, args: string[] = []) => {
  const result = await method(...args).call();
  return result;
}

export const bnDivdedByDecimals = (bn: BigNumber, decimals = defaultDecimal) => {
  return bn.dividedBy(new BigNumber(10).pow(decimals))
}
