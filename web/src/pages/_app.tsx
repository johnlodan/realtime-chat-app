import { AppContext } from '@/lib/context';
import '../styles/globals.scss'
import type { AppProps } from "next/app";
import StoreProvider from '@/lib/storeProvider';

export default function App({ Component, pageProps, router }: AppProps) {
  return (<AppContext.Provider value={{ socket: {}, theme: "light" }}>
    <StoreProvider>
      <Component {...pageProps} />
    </StoreProvider>
  </AppContext.Provider>)
}

