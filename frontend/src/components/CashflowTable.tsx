import type { ScheduleRow } from '../types/bond';
import styles from './CashflowTable.module.css';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatMoney(value: number): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

interface CashflowTableProps {
  schedule: ScheduleRow[];
}

export default function CashflowTable({ schedule }: CashflowTableProps) {
  return (
    <div className={styles.wrapper}>
      <h3 className={styles.tableTitle}>Cash flow schedule</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Period</th>
            <th>Payment date</th>
            <th className={styles.num}>Coupon payment</th>
            <th className={styles.num}>Cumulative interest</th>
            <th className={styles.num}>Remaining principal</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((row) => (
            <tr key={row.period}>
              <td>{row.period}</td>
              <td>{formatDate(row.paymentDate)}</td>
              <td className={styles.num}>{formatMoney(row.couponPayment)}</td>
              <td className={styles.num}>{formatMoney(row.cumulativeInterest)}</td>
              <td className={styles.num}>{formatMoney(row.remainingPrincipal)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
