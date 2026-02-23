# Bond Yield Calculator

Full-stack web app to calculate bond yields and cash flow schedules.

## Tech Stack

- **Frontend**: React + TypeScript (Vite), minimal CSS
- **Backend**: NestJS + TypeScript

## Setup

```bash
npm run install:all
```

Or manually:

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

## Run

**Both apps (recommended):**

```bash
npm run dev
```

- Backend: http://localhost:3000
- Frontend: http://localhost:5173

**Separately:**

```bash
npm run backend   # NestJS on :3000
npm run frontend  # Vite on :5173
```

## API

### POST /bond/calculate

**Body:**

| Field | Type | Description |
|-------|------|-------------|
| faceValue | number | Face value of bond (> 0) |
| annualCouponRate | number | Annual coupon rate in percent, e.g. 8 for 8% (≥ 0) |
| marketPrice | number | Current market price (> 0) |
| yearsToMaturity | number | Years to maturity (> 0) |
| couponFrequency | string | `"annual"` or `"semi-annual"` |

**Response:** `currentYield`, `ytmAnnual`, `totalInterest`, `premiumDiscount`, `schedule` (array of period, paymentDate, couponPayment, cumulativeInterest, remainingPrincipal).

**YTM:** Returned as a decimal (e.g. 0.0927). Frontend displays as percentage.

## Formulas

- **Current yield:** `annualCoupon / marketPrice` where `annualCoupon = faceValue * (annualCouponRate/100)`.
- **Total interest:** `couponPerPeriod * N` with `N = yearsToMaturity * freq`, `freq = 1` (annual) or `2` (semi-annual).
- **Premium/discount:** `marketPrice > faceValue` → premium, `<` → discount, else par.
- **YTM:** Periodic rate `r` solved from  
  `marketPrice = Σ(couponPerPeriod/(1+r)^t) + faceValue/(1+r)^N`  
  via bisection; then `ytmAnnual = r * freq`. Zero-coupon bonds supported.

## Sample Input

| Field | Value |
|-------|--------|
| faceValue | 1000 |
| annualCouponRate | 8 |
| marketPrice | 950 |
| yearsToMaturity | 5 |
| couponFrequency | semi-annual |

**Expected:** currentYield ≈ 8.42%, totalInterest = 400, ytmAnnual ≈ 0.0927 (9.27%).

## Tests

```bash
npm test
```

Runs backend Jest tests (bond math and controller).

## Deployment (live link)

The app is deployment-ready: backend uses `process.env.PORT`, frontend uses `VITE_API_BASE` for the API URL.

**Backend (e.g. Render)**  
- Root: `backend`  
- Build: `npm install && npm run build`  
- Start: `npm run start:prod`  

**Frontend (e.g. Vercel)**  
- Root: `frontend`  
- Set env: `VITE_API_BASE = https://your-backend-url.onrender.com/bond` (your actual backend base URL including `/bond`)  

Local dev unchanged: without `VITE_API_BASE`, the frontend uses `/bond` and the Vite proxy.

## Assumptions

- First coupon payment date: today + (12/freq) months (12 for annual, 6 for semi-annual).
- `yearsToMaturity * freq` must be an integer (e.g. 2.5 years with semi-annual is rejected).
- No auth, no database; stateless calculation only.
