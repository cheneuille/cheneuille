import './styles/globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Cheneuille Ultimate Casino',
  description: 'Classement automatique via API Roobet',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}