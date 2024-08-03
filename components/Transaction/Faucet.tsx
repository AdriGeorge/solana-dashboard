import React, {useState} from 'react';
import {Connection, LAMPORTS_PER_SOL} from '@solana/web3.js';
import {useWallet} from '@solana/wallet-adapter-react';
import styles from '../../styles/Faucet.module.css';
import {useWalletContext} from '../Context';

const Faucet: React.FC = () => {
  const {publicKey} = useWallet();
  const {fetchBalance} = useWalletContext();
  const [amount, setAmount] = useState<number>(0.1); // Default to 0.1 SOL
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAirdrop = async () => {
    if (!publicKey) {
      setError('Please connect your wallet.');
      return;
    }

    setLoading(true);
    setError(null);

    const connection = new Connection(
      process.env.NEXT_PUBLIC_BLOCKCHAIN_URL || 'https://api.devnet.solana.com'
    );

    try {
      const signature = await connection.requestAirdrop(
        publicKey,
        amount * LAMPORTS_PER_SOL
      );
      await connection.confirmTransaction(signature);

      fetchBalance(publicKey);

      alert(`Airdropped ${amount} SOL successfully!`);
    } catch (err) {
      console.error('Error during airdrop: ', err);
      setError('Failed to airdrop SOL.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>SOL Faucet</h2>
      <div className={styles.form}>
        <label className={styles.label}>
          Amount (SOL):
          <input
            type='number'
            value={amount}
            onChange={e => setAmount(parseFloat(e.target.value))}
            className={styles.input}
            min='0.01'
            step='0.01'
          />
        </label>
        <button
          onClick={handleAirdrop}
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? 'Requesting Airdrop...' : 'Request Airdrop'}
        </button>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
};

export default Faucet;
