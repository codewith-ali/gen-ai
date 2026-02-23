import { useState, FormEvent } from 'react';
import type { CalculateBondRequest, CouponFrequency } from '../types/bond';
import styles from './BondForm.module.css';

interface BondFormProps {
  onSubmit: (data: CalculateBondRequest) => void;
  disabled?: boolean;
}

const FREQUENCIES: { value: CouponFrequency; label: string }[] = [
  { value: 'annual', label: 'Annual' },
  { value: 'semi-annual', label: 'Semi-annual' },
];

export default function BondForm({ onSubmit, disabled }: BondFormProps) {
  const [faceValue, setFaceValue] = useState('1000');
  const [annualCouponRate, setAnnualCouponRate] = useState('8');
  const [marketPrice, setMarketPrice] = useState('950');
  const [yearsToMaturity, setYearsToMaturity] = useState('5');
  const [couponFrequency, setCouponFrequency] = useState<CouponFrequency>('semi-annual');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      faceValue: Number(faceValue),
      annualCouponRate: Number(annualCouponRate),
      marketPrice: Number(marketPrice),
      yearsToMaturity: Number(yearsToMaturity),
      couponFrequency,
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label className={styles.label}>
          Face value
          <input
            type="number"
            step="any"
            min="0.01"
            value={faceValue}
            onChange={(e) => setFaceValue(e.target.value)}
            required
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          Annual coupon rate (%)
          <input
            type="number"
            step="any"
            min="0"
            value={annualCouponRate}
            onChange={(e) => setAnnualCouponRate(e.target.value)}
            required
            className={styles.input}
          />
        </label>
      </div>
      <div className={styles.row}>
        <label className={styles.label}>
          Market price
          <input
            type="number"
            step="any"
            min="0.01"
            value={marketPrice}
            onChange={(e) => setMarketPrice(e.target.value)}
            required
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          Years to maturity
          <input
            type="number"
            step="any"
            min="0.01"
            value={yearsToMaturity}
            onChange={(e) => setYearsToMaturity(e.target.value)}
            required
            className={styles.input}
          />
        </label>
      </div>
      <div className={styles.row}>
        <label className={styles.label}>
          Coupon frequency
          <select
            value={couponFrequency}
            onChange={(e) => setCouponFrequency(e.target.value as CouponFrequency)}
            className={styles.select}
          >
            {FREQUENCIES.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <button type="submit" className={styles.button} disabled={disabled}>
        Calculate
      </button>
    </form>
  );
}
