// app/layout.tsx
import './globals.css'
import AppPrivyProvider from './components/PrivyProvider';

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>
        <AppPrivyProvider>{children}</AppPrivyProvider>
      </body>
    </html>
  );
}