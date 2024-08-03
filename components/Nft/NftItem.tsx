import React from 'react';
import {Nft, PublicKey} from '@metaplex-foundation/js';
import styles from '../../styles/NftDisplay.module.css';
import Image from 'next/image';

interface NFTItemProps {
  nft: {
    address: PublicKey;
    json: {
      name?: string;
      description?: string;
      uri?: string;
      image?: string;
    };
  };
}
const NFTItem: React.FC<NFTItemProps> = ({nft}) => {
  const imageUrl = nft.json?.uri || nft.json?.image || '/no-image.png';
  const imageAlt = nft.json?.name || 'NFT Image';
  const imageDescription = nft.json?.description || 'No description available';
  const nftAddress = nft.address.toString();
  const explorerUrl = nftAddress
    ? `https://solscan.io/token/${nftAddress}${process.env.NEXT_PUBLIC_CLUSTER}`
    : '#';

  return (
    <div className={styles.nftItem}>
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={imageAlt}
          width={200}
          height={200}
          className={styles.nftImage}
        />
      )}

      <h3>{imageAlt}</h3>

      <p>{imageDescription}</p>
      <a
        href={explorerUrl}
        target='_blank'
        rel='noopener noreferrer'
        className={styles.link}
      >
        <p>See on explorer</p>
      </a>
    </div>
  );
};

export default NFTItem;
