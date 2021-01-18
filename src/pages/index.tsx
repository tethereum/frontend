import * as React from 'react';
import { isMobile } from 'react-device-detect';
import { web3, connector } from "../util/web3";
import Dashboard from '../components/Dashboard';
import Layout from '../components/Layout';

export default class App extends React.Component<{}, { clientAddress: string | null; }> {
    public state = { clientAddress: null };

    public componentDidMount() {
        let clientAddress = null;
        if (typeof window !== 'undefined') {
            if (isMobile) {
                if (connector.connected) {
                    clientAddress = connector.accounts[0];
                }
            } else {
                const win = window as any;
                if (win.ethereum) {
                    win.web3 = web3;
                    if (win.ethereum.isConnected() && win.ethereum.selectedAddress) {
                        clientAddress = win.ethereum.selectedAddress;
                    } else {
                        win.ethereum.enable()
                            .then(((addresses: string[]) => { this.setClientAddress(addresses[0]); }))
                            .catch((err: any) => window.alert(err.message));
                    }
                    win.ethereum.on("accountsChanged", (accounts: string[]) => {
                        console.log("accountsChanged", accounts)
                        this.setClientAddress(accounts[0])
                    });
                } else if (win.web3) {
                    win.web3 = web3;
                } else {
                    win.web3 = null;
                }
            }
        }
        if (clientAddress) {
            this.setState({ clientAddress });
        }
    }


    public setClientAddress = (clientAddress: string) => {
        if (typeof window !== 'undefined' && (window as any).ethereum) {
            this.setState({ clientAddress })
        }
    };

    public render() {
        return (
            <Layout>
                <Dashboard address={this.state.clientAddress || ''} />
            </Layout>
        );
    }
}
