import React, {useEffect, useState, useMemo} from 'react';
import {useWallet} from '@solana/wallet-adapter-react';
import styles from '../../styles/TransactionHistory.module.css';
import {useWalletContext} from '../Context';

const TransactionHistory: React.FC = () => {
  const {publicKey} = useWallet();
  const {transactions, loadingTransactions, fetchTransactions} =
    useWalletContext();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const transactionsPerPage = 10;

  useEffect(() => {
    if (publicKey && transactions.length === 0) {
      fetchTransactions(publicKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey, transactions]);

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = useMemo(
    () => transactions.slice(indexOfFirstTransaction, indexOfLastTransaction),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [transactions, currentPage]
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className={styles.container}>
      {!publicKey ? (
        <p className={styles.message}>Connect your wallet</p>
      ) : loadingTransactions ? (
        <div className={styles.loadingSpinner}>Loading...</div>
      ) : transactions.length === 0 ? (
        <p className={styles.message}>No Transactions</p>
      ) : (
        <div>
          <h2 className={styles.title}>Transaction History</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Signature</th>
                <th>Block Time</th>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.map((tx, index) => (
                <tr key={index} className={styles.transaction}>
                  <td>
                    <a
                      href={`https://explorer.solana.com/tx/${tx.transaction.signatures[0]}${process.env.NEXT_PUBLIC_CLUSTER}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className={styles.link}
                    >
                      {tx.transaction.signatures[0]}
                    </a>
                  </td>
                  <td>
                    {tx.blockTime ? (
                      <a
                        href={`https://explorer.solana.com/block/${tx.slot}${process.env.NEXT_PUBLIC_CLUSTER}`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className={styles.link}
                      >
                        {new Date(tx.blockTime * 1000).toLocaleString()}
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.pagination}>
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={indexOfLastTransaction >= transactions.length}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
