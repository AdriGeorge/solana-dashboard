import {WalletProvider} from '../components/Context';

import '../styles/globals.css';

function MyApp({Component, pageProps}) {
  return (
    <WalletProvider>
      <Component {...pageProps} />
    </WalletProvider>
  );
}

export default MyApp;
