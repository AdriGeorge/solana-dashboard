import {NextPage} from 'next';
import styles from '../styles/Home.module.css';
import {AppBar} from '../components/AppBar';
import Head from 'next/head';
import WalletContextProvider from '../components/WalletContextProvider';
import NftDisplay from '../components/Nft/NftDisplay';

const Home: NextPage = props => {
  return (
    <div className={styles.App}>
      <Head>
        <title>NFT Dashboard</title>
        <meta name='description' content='NFT Dashboard' />
      </Head>
      <WalletContextProvider>
        <AppBar />
        <div className={styles.AppBody}>
          <NftDisplay />
        </div>
      </WalletContextProvider>
    </div>
  );
};

export default Home;
