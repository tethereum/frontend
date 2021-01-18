import { web3 } from './web3'
import abi from './ThethereumContract.json';
import { thethereumContractAddress } from './config'

export const tokenAddress = thethereumContractAddress;
export const tokenContract = web3 ? new web3.eth.Contract(abi as any, tokenAddress) : null;
export const tokenContractAbi = abi;
