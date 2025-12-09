# Retail Sales Management System

## 1. Overview
A high-performance full-stack application to manage and analyze retail transaction data. It handles over **1,000,000 records** efficiently using server-side processing. The dashboard provides real-time insights with sub-second search, multi-filtering, and sorting capabilities, wrapped in a professional Material-UI design.

**Live Application**: [https://csv-loader-neondb-mxqi.vercel.app/](https://csv-loader-neondb-mxqi.vercel.app/)

## 2. Tech Stack
- **Frontend**: React (Vite), Material-UI (MUI), Axios.
- **Backend**: Node.js, Express.
- **Database**: **PostgreSQL (Neon Cloud)** - Chosen to handle the 235MB dataset without splitting/trimming.
- **Deployment**: Vercel (Frontend & Backend).

## 3. Search Implementation Summary
- **Full-Text Search**: Implemented on `Customer Name` and `Phone Number` using PostgreSQL `ILIKE` for case-insensitive matching.
- **Optimization**: Backend dynamically generates SQL parameters (`$1`, `$2`), ensuring security and performance.
- **UX**: Search works instantly alongside any active filters or sorting rules.

## 4. Filter Implementation Summary
- **Multi-Select**: Supports selecting multiple Regions, Product Categories, and Payment Methods simultaneously (`WHERE x IN (...)`).
- **Range Filtering**: Custom logic for **Age Ranges** (e.g., "18-25") translates to SQL `BETWEEN` clauses.
- **Strategy**: Filters are applied on the server-side to minimize data transfer and memory usage on the client.

## 5. Sorting Implementation Summary
- **Fields**: Date, Quantity, Customer Name, Total Amount.
- **Mechanism**: Dynamic `ORDER BY` clause generation in the backend service.
- **State**: Preserves current search and filter criteria while sorting (e.g., "Sort by Price" *within* "North Region" *and* "Electronics").

## 6. Pagination Implementation Summary
- **Logic**: Server-side pagination using `LIMIT` and `OFFSET`.
- **Performance**: Returns only 10 items per page, keeping the frontend fast regardless of total dataset size (1M+ rows).
- **Navigation**: "Next/Previous" buttons respect the active filtered subset of data.

## 7. Setup Instructions
1.  **Clone Repository**: `git clone <repo-url>`
2.  **Dataset**: The system uses a **Streaming Loader** to handle the 235MB dataset. No manual splitting required.
3.  **Backend Setup**:
    - `cd backend`
    - `npm install`
    - create `.env` with `DATABASE_URL=your_neon_postgres_string`
    - `npm start` (Automatically streams data to DB if empty).
4.  **Frontend Setup**:
    - `cd frontend`
    - `npm install`
    - create `.env` with `VITE_API_URL=http://localhost:5000/api`
    - `npm run dev`

