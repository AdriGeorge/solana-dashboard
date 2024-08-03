import React, {useState} from 'react';
import {useWallet} from '@solana/wallet-adapter-react';
import {Connection} from '@solana/web3.js';
import {
  bundlrStorage,
  Metaplex,
  toMetaplexFile,
  walletAdapterIdentity,
} from '@metaplex-foundation/js';
import styles from '../../styles/CreateNFT.module.css';
import {useWalletContext} from '../Context';

const CreateNFT: React.FC = () => {
  const {publicKey, signTransaction, signAllTransactions, signMessage} =
    useWallet();
  const {fetchNFTs} = useWalletContext();

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [symbol, setSymbol] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey) {
      setError('Please connect your wallet.');
      return;
    }
    if (!title || !description || !symbol || !image) {
      setError('Please fill all fields and upload an image.');
      return;
    }

    setLoading(true);
    setError(null);

    const connection = new Connection(
      process.env.NEXT_PUBLIC_BLOCKCHAIN_URL || 'https://api.devnet.solana.com'
    );
    const metaplex = new Metaplex(connection)
      .use(
        walletAdapterIdentity({
          publicKey,
          signMessage,
          signTransaction,
          signAllTransactions,
        })
      )
      .use(
        bundlrStorage({
          address: 'https://devnet.bundlr.network',
          providerUrl:
            process.env.NEXT_PUBLIC_BLOCKCHAIN_URL ||
            process.env.NEXT_PUBLIC_BLOCKCHAIN_URL ||
            'https://api.devnet.solana.com',
        })
      );

    try {
      const buffer = await image.arrayBuffer();
      const file = toMetaplexFile(new Uint8Array(buffer), image.name);

      // Upload the image
      console.log('Uploading image...');
      const imageUri = await metaplex.storage().upload(file);
      console.log('Image uploaded:', imageUri);

      // Upload metadata
      console.log('Uploading metadata...');
      const {uri: metadataUri} = await metaplex.nfts().uploadMetadata({
        name: title,
        symbol,
        description,
        image: imageUri,
      });
      console.log('Metadata uploaded:', metadataUri);

      // Create the NFT
      console.log('Creating NFT...');
      const {nft} = await metaplex.nfts().create(
        {
          uri: metadataUri,
          name: title,
          sellerFeeBasisPoints: 0,
          symbol,
        },
        {commitment: 'finalized'}
      );
      console.log('NFT created:', nft);

      fetchNFTs(publicKey);
      alert('NFT created successfully!');
    } catch (err) {
      console.error('Error creating NFT:', err);
      setError('Failed to create NFT.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Create New NFT</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          Title:
          <input
            type='text'
            value={title}
            onChange={e => setTitle(e.target.value)}
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          Description:
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className={styles.textarea}
          />
        </label>
        <label className={styles.label}>
          Symbol:
          <input
            type='text'
            value={symbol}
            onChange={e => setSymbol(e.target.value)}
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          Image:
          <input
            type='file'
            accept='image/*'
            onChange={handleImageChange}
            className={styles.fileInput}
          />
        </label>
        <button
          type='submit'
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create NFT'}
        </button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
};

export default CreateNFT;
