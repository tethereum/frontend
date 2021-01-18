import React from "react"
import { createGlobalStyle } from "styled-components";
import { Footer } from './Footer';

const GlobalStyle = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=Jura&display=swap');
    body {
        font-family: 'Jura', sans-serif;
        color: #fff;
        min-height: 100vh;
        min-width: 100vw;
        overflow: hidden;
        width: auto;
        margin:0;
        padding:0;
        background-color: #1a6ce8;
    }
`
export default function Layout({ children }: { children: JSX.Element }) {
  return (
    <React.Fragment>
      <GlobalStyle theme="purple" />
      {children}
      <Footer />
    </React.Fragment>
  )
}