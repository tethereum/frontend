import React from "react"
import styled from 'styled-components';

const FooterStyled = styled.div`
    display:flex;
    margin: 2rem 0 0 0;
    align-items: center;
    justify-content: center;
    > a {
        font-size: 14px;
        font-family: sans-serif;
        text-decoration: none;
        background-color: #99f0a6;
        color: #2370e5;
        transition: all 0.2s ease, visibility 0s;
        padding: .6rem 1.4rem;
        border: none;
        margin: 0 1.2rem;
        cursor: pointer;
        :hover {
            color: #000;
            background: #FFFFFF;
            text-decoration: none;
        }
    }
`
export function Footer() {
    return (
        <FooterStyled>
            <a href="https://etherscan.io/address/0x9d4642e97b21fD1CBF73446dD51D7E0245505DeD#code" target="_blank">
                Contract
            </a>
            <a href="https://app.uniswap.org/#/swap?inputCurrency=0x6b175474e89094c44da98b954eedeac495271d0f&outputCurrency=0x9d4642e97b21fd1cbf73446dd51d7e0245505ded" target="_blank">
                Uniswap
            </a>
            <a href="https://twitter.com/tethereum3" target="_blank">
                Twitter
            </a>
        </FooterStyled>
    )
}