import type { BondCalculateResult } from '../types/bond';
import CashflowTable from './CashflowTable';
import styles from './ResultsPanel.module.css';

function formatPercent(value: number, decimals = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

function formatMoney(value: number): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

interface ResultsPanelProps {
  result: BondCalculateResult;
}

export default function ResultsPanel({ result }: ResultsPanelProps) {
  return (
    <section className={styles.panel}>
      <h2 className={styles.heading}>Results</h2>
      <div className={styles.metrics}>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Current yield</span>
          <span className={styles.metricValue}>{formatPercent(result.currentYield, 4)}</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>YTM</span>
          <span className={styles.metricValue}>{formatPercent(result.ytmAnnual, 4)}</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Total interest</span>
          <span className={styles.metricValue}>{formatMoney(result.totalInterest)}</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Price</span>
          <span className={`${styles.badge} ${styles[result.premiumDiscount]}`}>
            {result.premiumDiscount}
          </span>
        </div>
      </div>
      <CashflowTable schedule={result.schedule} />
    </section>
  );
}
