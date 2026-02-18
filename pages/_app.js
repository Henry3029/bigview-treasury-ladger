import { PrivyProvider } from '@privy-io/react-auth';
import '../styles/globals.css'; // This keeps your styling working

function MyApp({ Component, pageProps }) {
  return (
      <PrivyProvider
            appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID} // PASTE YOUR PRIVY APP ID HERE
                  config={{
                          loginMethods: ['email', 'wallet', 'google'],
                                  appearance: {
                                            theme: 'light',
                                                      accentColor: '#676FFF',
                                                                logo: 'https://your-logo-url.com/logo.png',
                                                                        },
                                                                                embeddedWallets: {
                                                                                          createOnLogin: 'users-without-wallets',
                                                                                                  },
                                                                                                        }}
                                                                                                            >
                                                                                                                  <Component {...pageProps} />
                                                                                                                      </PrivyProvider>
                                                                                                                        );
                                                                                                                        }

                                                                                                                        export default MyApp;

                                                                                                                        