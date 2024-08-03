import React, {useEffect, useMemo, useState} from 'react';
import {useWallet} from '@solana/wallet-adapter-react';
import styles from '../../styles/NftDisplay.module.css';
import NFTItem from './NftItem';
import {useWalletContext} from '../Context';

const NftDisplay: React.FC = () => {
  const {publicKey} = useWallet();
  const {nfts, loadingNfts, fetchNFTs} = useWalletContext();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const nftsPerPage = 6;

  useEffect(() => {
    if (publicKey && nfts.length === 0) {
      fetchNFTs(publicKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey, nfts]);

  const indexOfLastNft = currentPage * nftsPerPage;
  const indexOfFirstNft = indexOfLastNft - nftsPerPage;
  const currentNfts = useMemo(
    () => nfts.slice(indexOfFirstNft, indexOfLastNft),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nfts, currentPage]
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      {!publicKey ? (
        <p className={styles.message}>Connect your wallet</p>
      ) : loadingNfts ? (
        <div className={styles.loadingSpinner}>Loading...</div>
      ) : nfts.length === 0 ? (
        <p className={styles.message}>No NFTs</p>
      ) : (
        <div>
          <h2 className={styles.title}>Your NFTs</h2>
          <div className={styles.nftGrid}>
            {currentNfts.map((nft, index) => (
              <NFTItem key={index} nft={nft} />
            ))}
          </div>
          <div className={styles.pagination}>
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage * nftsPerPage >= nfts.length}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NftDisplay;
