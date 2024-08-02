import React, {useEffect, useState} from 'react';
import {useWallet} from '@solana/wallet-adapter-react';
import {Connection, PublicKey} from '@solana/web3.js';
import styles from '../../styles/NftDisplay.module.css';
import NFTItem from './NftItem';
import {Metadata, Metaplex, Nft} from '@metaplex-foundation/js';

const NftDisplay: React.FC = () => {
  const {publicKey} = useWallet();
  const [nfts, setNfts] = useState<Nft[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasFetched, setHasFetched] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);

  // Ensure that client-specific code runs only after the initial render
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && publicKey) {
      fetchNFTs(publicKey);
    } else {
      setNfts([]);
      setHasFetched(false);
    }
  }, [isClient, publicKey]);

  const fetchNFTs = async (walletAddress: PublicKey) => {
    setLoading(true);
    const connection = new Connection(
      process.env.NEXT_PUBLIC_BLOCKCHAIN_URL || 'https://api.devnet.solana.com'
    );
    const metaplex = new Metaplex(connection);

    try {
      const nftMetadataList = await metaplex
        .nfts()
        .findAllByOwner({owner: walletAddress});
      const nfts: Nft[] = [];
      for (const nftMetadata of nftMetadataList) {
        const nft = await metaplex
          .nfts()
          .load({metadata: nftMetadata as Metadata});
        console.log('nft:', nft);
        nfts.push(nft as Nft);
      }

      setNfts(nfts);
    } catch (error) {
      console.error('Error fetching NFTs: ', error);
      setNfts([]);
    } finally {
      setLoading(false);
      setHasFetched(true);
    }
  };

  if (!isClient) {
    return null; // Render nothing on the server
  }

  return (
    <div>
      {!publicKey ? (
        <p className={styles.message}>Click connect</p>
      ) : loading ? (
        <div className={styles.loadingSpinner}>Loading...</div>
      ) : !hasFetched || nfts.length === 0 ? (
        <p className={styles.message}>No NFTs</p>
      ) : (
        <div>
          <h2 className={styles.title}>Your NFTs</h2>
          <div className={styles.nftGrid}>
            {nfts.map((nft, index) => (
              <NFTItem key={index} nft={nft} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NftDisplay;
