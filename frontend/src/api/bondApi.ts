import type { CalculateBondRequest, BondCalculateResult } from '../types/bond';

const API_BASE = '/bond';

export async function calculateBond(
  body: CalculateBondRequest,
): Promise<BondCalculateResult> {
  const res = await fetch(`${API_BASE}/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    let message = text;
    try {
      const json = JSON.parse(text);
      if (json.message) {
        message = Array.isArray(json.message) ? json.message.join(', ') : json.message;
      }
    } catch {
      // use raw text
    }
    throw new Error(message || `Request failed: ${res.status}`);
  }

  return res.json();
}
