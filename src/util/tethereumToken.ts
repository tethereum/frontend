import BigNumber from 'bignumber.js';
import { tokenAddress, tokenContract } from './contracts';
import { callMethod, bnDivdedByDecimals } from './utils';
import { sendTransaction } from './metamask';
import { decimals } from './config';

export const getTotalSupply  = async () => {
  if (!tokenContract) {
    return null;
  }
  const result = await callMethod(tokenContract.methods['totalSupply'], []);
  return bnDivdedByDecimals(new BigNumber(result));
}

export const getBalance = async (address: string) => {
  if (!tokenContract) {
    return null;
  }
  const result = await callMethod(tokenContract.methods['balanceOf'], [address]);
  return bnDivdedByDecimals(new BigNumber(result));
}

export const getTotalFees  = async () => {
    if (!tokenContract) {
      return null;
    }
    const result = await callMethod(tokenContract.methods['totalFees'], []);
    return bnDivdedByDecimals(new BigNumber(result));
}

export const withdraw = (fromAddress: string, amount: string) => {
    return new Promise(async (resolve, reject) => {
        if (!tokenContract) {
          return reject(new Error('No token contract'));
        }
        const tethNumberValue = new BigNumber(amount);
        const ethValueForuint256 = tethNumberValue.shiftedBy(decimals).toString()
        const encodedABI = tokenContract.methods.tEthFromrEth(ethValueForuint256).encodeABI();
        await sendTransaction(fromAddress, tokenAddress, encodedABI, '0x927C0', resolve, reject);
    });
}
