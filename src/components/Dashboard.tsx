import * as React from 'react';
import BigNumber from 'bignumber.js';
import styled from 'styled-components';
import {
    getTotalSupply,
    getBalance,
    getTotalFees,
    withdraw,
} from '../util/tethereumToken';
import { networkId } from '../util/config';
import { decimals } from '../util/config';
import { tokenContract } from '../util/contracts';

BigNumber.config({
    DECIMAL_PLACES: decimals,
    FORMAT: {
        prefix: '', // string to prepend
        decimalSeparator: '.', // decimal separator
        groupSeparator: ',', // grouping separator of the integer part
        groupSize: 3, // primary grouping size of the integer part
    }
});

const StyledDashboard = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    margin: 1rem auto 4rem auto;
    padding: 1.2rem 2.4rem;
    width: 520px;
    background-color: rgba(0,0,0,.33);
    text-align: justify;

    .teth-logo {
        font-size: 1.4rem;
        margin: auto;
        text-align: center;
        padding-bottom: 2rem;
        .firstlogoletter {
            color: #4AD06C;
        } 
    }

    .deposit-button, .withdraw-button {
        display: inline-block;
        border: none;
        padding: .8rem 1.4rem;
        margin: auto;
        text-decoration: none;
        color: #000;
        background-color: #ffffff;
        font-family: sans-serif;
        font-size: .8rem;
        cursor: pointer;
        text-align: center;
        -webkit-appearance: none;
        -moz-appearance: none;

        :hover, :focus {
            background-color: #99f0a6;
        }

        :disabled{
            background-color: #555;
            color: #f4f4f4;
            cursor: not-allowed;
            pointer-events: all !important;
        }
    }

    .dashboard-value {
        display: flex;
        flex-direction: row;
        margin-bottom: 1.2rem;
        flex: 1;
        .dashboard-value-title {
            margin-right: 1.2rem;
            width: 45%;
            text-align: right;
        }
        .dashboard-value-data {
            display: flex;
            flex: 1;
        }

        > .formaction {
            border-top: 1px solid white;
            opacity: .9;
            display: flex;
            flex: 1;
            padding-top: 0.8rem;
            align-items: center;
            .small-legend {
                font-size: 12px;
                opacity: .7;
                cursor: pointer;
            }
            > label {
                width: 60%;
                text-align: right;
                > input {
                    width: 80px;
                    height: 2rem;
                    text-align: center;
                    margin-left: .8rem;
                    margin-right: .8rem;
                    background-color: rgba(255,255,255,.5);
                }
            }
        }
    }
`;

export default ({ address }: { address: string; }) => {
    const [depositNumber, setDepositNumber] = React.useState('0.0');
    const [withdrawNumber, setWithdrawNumber] = React.useState('0.0');
    const [progress, setProgress] = React.useState(false);
    const [totalSupply, setTotalSupply] = React.useState(new BigNumber(0));
    const [tokenBalance, setTokenBalance] = React.useState(new BigNumber(0));
    const [totalFees, setTotalFees] = React.useState(new BigNumber(0));
    
    const fetchAllDataFromContract = React.useCallback(async () => {
        const totalSupply = await getTotalSupply();
        if (totalSupply) { setTotalSupply(totalSupply); }
        const bal = await getBalance(address);
        if (bal) { setTokenBalance(bal); }
        const fees = await getTotalFees();
        if (fees) { setTotalFees(fees); }
    }, [address]);

    React.useEffect(() => {
        if (address) {
            fetchAllDataFromContract();
        }
    }, [address])

    const onDeposit = async (_event: any) => {
        if (address == null || progress) {
            return;
        }
        setProgress(true);
        if (address && tokenContract) {
            const tethNumberValue = new BigNumber(depositNumber);
            const ethValueForuint256 = tethNumberValue.shiftedBy(decimals).toString()
            try {
                const resp = await tokenContract.methods.deposit().send({
                    from: address,
                    value: ((window as any).web3).utils.toWei(depositNumber, 'ether')
                });
                console.warn(depositNumber, ethValueForuint256, resp)
            } catch(e) {
                console.error('ERROR!', e);
                alert(`Error calling contract: ${e?.message}`);
            } finally {
                console.error('finally!');
                setProgress(false);
                fetchAllDataFromContract();
            }
        }
    }

    const onWithdraw = async (_event: any) => {
        if (address == null || progress) {
            return;
        }
        setProgress(true);
        if (address && tokenContract) {
            try {
                const wn = new BigNumber(withdrawNumber)
                if (wn > tokenBalance) {
                    throw new Error('Not enough balance.')
                }
                const resp = await withdraw(address, withdrawNumber);
                console.warn('Withdraw resp ', resp);
            } catch(e) {
                console.error('ERROR!', e);
                alert(`Error calling contract: ${e?.message}`);
            } finally {
                setProgress(false);
                fetchAllDataFromContract();
            }
        }
    }

    if (!address) {
        return (
            <StyledDashboard>
                <div>
                    <h1 className='teth-logo'>
                        <span className="firstlogoletter">T</span>
                        <span>ethereum.</span>
                    </h1>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <span>Unable to connect {networkId === '1' ? 'Main' : 'Test'} Ethereum Network.</span><br />
                    <span>Please change your MetaMask network.</span>
                </div>
            </StyledDashboard>
        )
    }

    const renderValueWithData = (title: string, value: string | JSX.Element) => (
        <div className="dashboard-value">
            <div className="dashboard-value-title">
                {title}
            </div>
            <div className="dashboard-value-data">
                {value}
            </div>
        </div>
    )

    const handleChangeDepositValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e && e.target && e.target.value) {
            setDepositNumber(e.target.value);
        }
    }

    const handleChangeWithdrawValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e && e.target && e.target.value) {
            setWithdrawNumber(e.target.value);
        }
    }
    
    const setMaxDeposit = async () => {
        const balance = await ((window as any).web3).eth.getBalance(address);
        const val = new BigNumber(balance).shiftedBy(-18).toString();
        setDepositNumber(val);
    }

    const setMaxWithdraw = () => {
        setWithdrawNumber(tokenBalance.toString());
    }

    return (
        <StyledDashboard>
            <div>
                <h1 className='teth-logo'>
                    <span className="firstlogoletter">T</span>
                    <span>ethereum.</span>
                </h1>
            </div>
            <div>
                {renderValueWithData('Your Balance:', `${tokenBalance.toFormat(4)} tETH`)}
                {renderValueWithData('Total Supply:', `${totalSupply.toFormat(4)} tETH`)}
                {renderValueWithData('Total ETH:', `${totalSupply.dividedBy(new BigNumber(1000000000)).toFormat(4)} ETH`)}
                {renderValueWithData('Total Fees:', `${totalFees.toFormat(4)} tETH`)}
            </div>

            <div className='dashboard-value'>
                <div className='formaction'>
                    <label>
                        Deposit Amount (ETH):
                        <input type="text" value={depositNumber} onChange={handleChangeDepositValue} />
                    </label>
                    <span className="small-legend" onClick={setMaxDeposit}>(max.)</span>
                    <button className="deposit-button" onClick={onDeposit}>
                        Deposit
                    </button>
                </div>
            </div>

            <div className='dashboard-value'>
                <div className='formaction'>
                    <label>
                        Withdraw Amount (tETH):
                        <input type="text" value={withdrawNumber} onChange={handleChangeWithdrawValue} />
                    </label>
                    <span className="small-legend" onClick={setMaxWithdraw}>(max.)</span>
                    <button className="deposit-button" onClick={onWithdraw}>
                        Withdraw
                    </button>
                </div>
            </div>
        </StyledDashboard>
    );
};
