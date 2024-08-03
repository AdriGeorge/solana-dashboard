import React, {createContext, useContext, useState, useEffect} from 'react';
import {
  Connection,
  PublicKey,
  ParsedConfirmedTransaction,
} from '@solana/web3.js';
import {Metaplex, Metadata, Nft} from '@metaplex-foundation/js';

interface ContextType {
  nfts: Nft[];
  loadingNfts: boolean;
  transactions: ParsedConfirmedTransaction[];
  loadingTransactions: boolean;
  fetchNFTs: (walletAddress: PublicKey) => void;
  fetchTransactions: (walletAddress: PublicKey) => void;
  balance: number | null;
  fetchBalance: (walletAddress: PublicKey) => void;
}

const Context = createContext<ContextType | undefined>(undefined);

export const WalletProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [nfts, setNfts] = useState<Nft[]>([]);
  const [loadingNfts, setLoadingNfts] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<
    ParsedConfirmedTransaction[]
  >([]);
  const [loadingTransactions, setLoadingTransactions] =
    useState<boolean>(false);
  const [balance, setBalance] = useState<number | null>(null);

  const fetchNFTs = async (walletAddress: PublicKey) => {
    setLoadingNfts(true);
    const connection = new Connection(
      process.env.NEXT_PUBLIC_BLOCKCHAIN_URL || 'https://api.devnet.solana.com'
    );
    const metaplex = new Metaplex(connection);

    try {
      const nftMetadataList = await metaplex
        .nfts()
        .findAllByOwner({owner: walletAddress});
      const fetchedNfts: Nft[] = [];
      for (const nftMetadata of nftMetadataList) {
        const nft = await metaplex
          .nfts()
          .load({metadata: nftMetadata as Metadata});
        fetchedNfts.push(nft as Nft);
      }
      setNfts(fetchedNfts);
    } catch (error) {
      console.error('Error fetching NFTs: ', error);
      setNfts([]);
    } finally {
      setLoadingNfts(false);
    }
  };

  const fetchTransactions = async (walletAddress: PublicKey) => {
    setLoadingTransactions(true);
    const connection = new Connection(
      process.env.NEXT_PUBLIC_BLOCKCHAIN_URL || 'https://api.devnet.solana.com'
    );

    try {
      const transactions = await connection.getConfirmedSignaturesForAddress2(
        walletAddress
      );
      const detailedTransactions = await Promise.all(
        transactions.map(
          async tx =>
            await connection.getParsedConfirmedTransaction(tx.signature)
        )
      );
      setTransactions(
        detailedTransactions.filter(
          tx => tx !== null
        ) as ParsedConfirmedTransaction[]
      );
    } catch (error) {
      console.error('Error fetching transactions: ', error);
      setTransactions([]);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const fetchBalance = async (walletAddress: PublicKey) => {
    const connection = new Connection(
      process.env.NEXT_PUBLIC_BLOCKCHAIN_URL || 'https://api.devnet.solana.com'
    );

    try {
      const balance = await connection.getBalance(walletAddress);
      setBalance(balance / 1e9); // Convert lamports to SOL
    } catch (error) {
      console.error('Error fetching balance: ', error);
      setBalance(null);
    }
  };

  return (
    <Context.Provider
      value={{
        nfts,
        loadingNfts,
        transactions,
        loadingTransactions,
        fetchNFTs,
        fetchTransactions,
        balance,
        fetchBalance,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useWalletContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }
  return context;
};
