import {NextPage} from 'next';
import {useState} from 'react';
import styles from '../styles/Home.module.css';
import {AppBar} from '../components/AppBar';
import Head from 'next/head';
import WalletContextProvider from '../components/WalletContextProvider';
import NftDisplay from '../components/Nft/NftDisplay';
import TransactionHistory from '../components/Transaction/TransactionHistory';
import CreateNFT from '../components/Nft/CreateNFT';
import Faucet from '../components/Transaction/Faucet';

const Home: NextPage = () => {
  const [activeTab, setActiveTab] = useState('nft');

  const handleTabSwitch = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className={styles.App}>
      <Head>
        <title>NFT Dashboard</title>
        <meta name='description' content='NFT Dashboard' />
      </Head>
      <WalletContextProvider>
        <AppBar />
        <div className={styles.AppBody}>
          <div className={styles.TabContainer}>
            <button
              className={`${styles.TabButton} ${
                activeTab === 'nft' ? styles.ActiveTab : ''
              }`}
              onClick={() => handleTabSwitch('nft')}
            >
              NFT Display
            </button>
            <button
              className={`${styles.TabButton} ${
                activeTab === 'transactions' ? styles.ActiveTab : ''
              }`}
              onClick={() => handleTabSwitch('transactions')}
            >
              Transaction History
            </button>
            <button
              className={`${styles.TabButton} ${
                activeTab === 'create' ? styles.ActiveTab : ''
              }`}
              onClick={() => handleTabSwitch('create')}
            >
              Create NFT
            </button>
            <button
              className={`${styles.TabButton} ${
                activeTab === 'faucet' ? styles.ActiveTab : ''
              }`}
              onClick={() => handleTabSwitch('faucet')}
            >
              Faucet
            </button>
          </div>
          {activeTab === 'nft' && <NftDisplay />}
          {activeTab === 'transactions' && <TransactionHistory />}
          {activeTab === 'create' && <CreateNFT />}
          {activeTab === 'faucet' && <Faucet />}
        </div>
      </WalletContextProvider>
    </div>
  );
};

export default Home;
