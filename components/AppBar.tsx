// components/AppBar.tsx
import {FC, useEffect, useState} from 'react';
import styles from '../styles/Home.module.css';
import Image from 'next/image';
import {WalletMultiButton as OriginalWalletMultiButton} from '@solana/wallet-adapter-react-ui';
import {useWallet} from '@solana/wallet-adapter-react';
import {useWalletContext} from './Context';

const WalletMultiButton: FC = () => {
  const {publicKey} = useWallet();
  const {balance, fetchBalance} = useWalletContext();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (publicKey) {
      fetchBalance(publicKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey, balance]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className={styles.walletContainer}>
      {publicKey && balance !== null && (
        <div className={styles.balance}>
          <span>Balance: {balance.toFixed(2)} SOL</span>
        </div>
      )}
      <OriginalWalletMultiButton />
    </div>
  );
};

export const AppBar: FC = () => {
  return (
    <div className={styles.AppHeader}>
      <Image src='/solanaLogo.png' height={30} width={200} alt='' />
      <span>Wallet NFT Dashboard</span>
      <WalletMultiButton />
    </div>
  );
};
