import React from 'react';
import {Nft} from '@metaplex-foundation/js';
import styles from '../../styles/NftDisplay.module.css';
import Image from 'next/image';

interface NFTItemProps {
  nft: {
    json: {
      name?: string;
      description?: string;
      uri?: string;
    };
  };
}
const NFTItem: React.FC<NFTItemProps> = ({nft}) => {
  const imageUrl = nft.json?.uri || '/no-image.png';
  const imageAlt = nft.json?.name || 'NFT Image';
  const imageDescription = nft.json?.description || 'No description available';

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
    </div>
  );
};

export default NFTItem;
