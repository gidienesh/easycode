import type { Metadata } from "next";
import Link from 'next/link'; // Import Link for navigation

export const metadata: Metadata = {
  title: "Finance Service",
  description: "EasyCode Finance Service",
};

const sidebarStyle: React.CSSProperties = {
  width: '200px',
  padding: '20px',
  borderRight: '1px solid #ccc',
  height: '100vh',
  position: 'fixed',
  left: 0,
  top: 0,
  backgroundColor: '#f9f9f9',
};

const mainContentStyle: React.CSSProperties = {
  marginLeft: '220px', // Adjust based on sidebar width + padding
  padding: '20px',
};

const navLinkStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '10px',
  color: '#0070f3',
  textDecoration: 'none',
};

const navHeaderStyle: React.CSSProperties = {
  fontSize: '1.1em',
  fontWeight: 'bold',
  marginTop: '15px',
  marginBottom: '5px',
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* You can add global styles or other head elements here */}
        <style jsx global>{`
          body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
              Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
          }
          a {
            text-decoration: none;
            color: inherit;
          }
          * {
            box-sizing: border-box;
          }
        `}</style>
      </head>
      <body>
        <div style={{ display: 'flex' }}>
          <nav style={sidebarStyle}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Finance Menu</h2>

            <div style={navHeaderStyle}>Core</div>
            <Link href="/" style={navLinkStyle}>Dashboard</Link>
            <Link href="/finance/gl/chart-of-accounts" style={navLinkStyle}>Chart of Accounts</Link> {/* Corrected existing link */}
            <Link href="/finance/gl/journal-entries" style={navLinkStyle}>Journal Entries</Link> {/* Corrected existing link */}
            <Link href="/financial-dimensions" style={navLinkStyle}>Financial Dimensions</Link> {/* Assuming this page exists or will be general */}
            <Link href="/finance/gl/settings" style={navLinkStyle}>GL Settings</Link>

            <div style={navHeaderStyle}>Operations</div>
            <Link href="/finance/ap/vendors" style={navLinkStyle}>Vendor Management (AP)</Link>
            <Link href="/finance/ap/purchase-orders" style={navLinkStyle}>Purchase Orders (AP)</Link>
            <Link href="/finance/ap/invoices" style={navLinkStyle}>AP Invoices</Link>
            <Link href="/finance/ap/payments" style={navLinkStyle}>AP Payments</Link>
            <Link href="/finance/ap/expenses" style={navLinkStyle}>Expense Management</Link>
            <Link href="/finance/ap/wht" style={navLinkStyle}>WHT Management (AP)</Link>
            {/* Accounts Receivable Sub-section might be good here if more items are added */}
            <Link href="/finance/ar/customers" style={navLinkStyle}>Customer Management (AR)</Link>
            <Link href="/finance/ar/sales-orders" style={navLinkStyle}>Sales Orders (AR)</Link>
            <Link href="/finance/ar/invoices" style={navLinkStyle}>AR Invoices</Link>
            <Link href="/finance/ar/payments" style={navLinkStyle}>AR Payments/Receipts</Link>
            <Link href="/finance/ar/collections" style={navLinkStyle}>Collections/Dunning (AR)</Link>

            <div style={navHeaderStyle}>Inventory Management</div>
            <Link href="/finance/inventory/items" style={navLinkStyle}>Item Master</Link>
            <Link href="/finance/inventory/stock-levels" style={navLinkStyle}>Stock Levels</Link>
            <Link href="/finance/inventory/stock-transactions" style={navLinkStyle}>Stock Transactions</Link>
            <Link href="/finance/inventory/valuation-report" style={navLinkStyle}>Valuation Report</Link>
            <Link href="/finance/inventory/stock-adjustments" style={navLinkStyle}>Stock Adjustments</Link>

            <div style={navHeaderStyle}>Reporting</div>
            <Link href="/finance/gl/reports/trial-balance" style={navLinkStyle}>Trial Balance</Link>
            <Link href="/finance/gl/reports/financial-statements" style={navLinkStyle}>Financial Statements</Link>


            <div style={navHeaderStyle}>Planning & Assets</div>
            <Link href="/finance/gl/budgeting" style={navLinkStyle}>Budgeting</Link>
            <Link href="/finance/fa/asset-register" style={navLinkStyle}>Asset Register (FA)</Link>
            <Link href="/finance/fa/depreciation" style={navLinkStyle}>Depreciation (FA)</Link>

            {/* Add more links as needed */}
          </nav>
          <main style={mainContentStyle}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
