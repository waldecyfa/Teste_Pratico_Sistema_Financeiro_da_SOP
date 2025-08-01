import { Inter } from 'next/font/google';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { Providers } from './providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'SOP Financial Control System',
  description: 'A system for managing expenses, commitments, and payments',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <ToastContainer position="top-right" autoClose={5000} />
        </Providers>
      </body>
    </html>
  );
}