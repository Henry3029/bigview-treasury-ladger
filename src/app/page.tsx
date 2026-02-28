// app/page.tsx
'use client';

import {usePrivy} from '@privy-io/react-auth';

export default function HomePage() {
  const {ready, authenticated, login, logout, user} = usePrivy();

  // Wait for Privy to initialize
  if (!ready) {
    return <div>Loading...</div>;
  }

  return (
    <main style={{padding: '2rem'}}>
      <h1>Welcome to Privy Integration</h1>
      
      {authenticated ? (
        <div>
          <p>Logged in as: {user?.id}</p>
          <button onClick={logout}>Log Out</button>
        </div>
      ) : (
        <button onClick={login}>Log In</button>
      )}
    </main>
  );
}