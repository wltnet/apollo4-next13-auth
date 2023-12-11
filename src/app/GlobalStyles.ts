'use client'
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  // your global styles
  body[data-font-size=\"default\"] {
    --font-size-m1: 0.8333333333rem;
    --font-size-0: 1rem;
    --font-size-p1: 1.2rem;
    --font-size-p2: 1.44rem;
    --font-size-p3: 1.728rem;
  }

  body[data-font-size=\"medium\"] {
    --font-size-m1: 0.8432539683rem;
    --font-size-0: 1.0625rem;
    --font-size-p1: 1.33875rem;
    --font-size-p2: 1.686825rem;
    --font-size-p3: 2.1253995rem;
  }

  body[data-font-size=\"large\"] {
    --font-size-m1: 0.8272058824rem;
    --font-size-0: 1.125rem;
    --font-size-p1: 1.53rem;
    --font-size-p2: 2.0808rem;
    --font-size-p3: 2.829888rem;
  }
`;

export default GlobalStyles;
