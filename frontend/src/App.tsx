import { useState } from 'react';
import BondForm from './components/BondForm';
import ResultsPanel from './components/ResultsPanel';
import type { BondCalculateResult } from './types/bond';
import { calculateBond } from './api/bondApi';
import type { CalculateBondRequest } from './types/bond';
import styles from './App.module.css';

function App() {
  const [result, setResult] = useState<BondCalculateResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async (data: CalculateBondRequest) => {
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await calculateBond(data);
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Calculation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <h1 className={styles.title}>Bond Yield Calculator</h1>
      <BondForm onSubmit={handleCalculate} disabled={loading} />
      {loading && <p className={styles.loading}>Calculating…</p>}
      {error && <p className={styles.error}>{error}</p>}
      {result && !loading && (
        <ResultsPanel result={result} />
      )}
    </div>
  );
}

export default App;
