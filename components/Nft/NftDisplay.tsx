import React, {useEffect, useState} from 'react';
import {useWallet} from '@solana/wallet-adapter-react';
import {Connection, PublicKey} from '@solana/web3.js';
import styles from '../../styles/NftDisplay.module.css';
import NFTItem from './NftItem';
import {Metadata, Metaplex, Nft} from '@metaplex-foundation/js';
const NftDisplay: React.FC = () => {
  console.log('nftDisplay');
  const {publicKey} = useWallet();
  const [nfts, setNfts] = useState<Nft[]>([]);

  useEffect(() => {
    console.log('publick:', publicKey);
    if (publicKey) {
      fetchNFTs(publicKey);
    }
  }, [publicKey]);

  const fetchNFTs = async (walletAddress: PublicKey) => {
    const connection = new Connection(
      process.env.BLOCKCHAIN_URL || 'https://api.devnet.solana.com'
    );
    const metaplex = new Metaplex(connection);

    const nftMetadataList = await metaplex
      .nfts()
      .findAllByOwner({owner: walletAddress});
    const nfts: Nft[] = [];
    for (const nftMetadata of nftMetadataList) {
      const nft = await metaplex
        .nfts()
        .load({metadata: nftMetadata as Metadata});
      nfts.push(nft as Nft);
    }

    setNfts(nfts);
  };

  return (
    <div>
      <h2 className={styles.title}>Your NFTs</h2>
      <div className={styles.nftGrid}>
        {nfts.map((nft, index) => (
          <NFTItem key={index} nft={nft} />
        ))}
      </div>
    </div>
  );
};

export default NftDisplay;
