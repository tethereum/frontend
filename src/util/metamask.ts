export const sendTransaction = async (
    fromAddress: string,
    toAddress: string,
    encodedABI: any,
    gasLimit: string,
    successCallBack: Function,
    errorCallBack: Function,
    wei = `0x0`
) => {
    const web3 = (window as any).web3;
    if ((window as any).ethereum && web3) {
      try {
        const gasPrice = await web3.eth.getGasPrice();
        // gasPrice = '0x${gasPrice.toString(16)';
        const tx = {
          from: fromAddress,
          to: toAddress,
          gas: gasLimit,
          gasPrice: web3.utils.toHex(gasPrice),
          // chainId: 3,
          data: encodedABI,
          value: wei
        };
  
        web3.eth.sendTransaction(tx)
          .on('transactionHash', (hash: string) => { console.log('hash: ', hash) })
          .on('receipt', (_receipt: string) => {
            successCallBack();
          })
          .on('error', (err: any) => {
            errorCallBack(err)
          });
  
      } catch (err) {
        console.log('err :>> ', err);
        return null;
      }
    } else {
      return null;
    }
}