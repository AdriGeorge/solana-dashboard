import {ConnectionProvider, WalletProvider} from '@solana/wallet-adapter-react';
import {FC, ReactNode, useMemo} from 'react';
import * as web3 from '@solana/web3.js';
import {WalletModalProvider} from '@solana/wallet-adapter-react-ui';
require('@solana/wallet-adapter-react-ui/styles.css');

interface WalletContextProviderProps {
  children: ReactNode;
}

const WalletContextProvider: FC<WalletContextProviderProps> = ({children}) => {
  const endpoint = web3.clusterApiUrl('devnet');
  const wallets = useMemo(() => [], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletContextProvider;
