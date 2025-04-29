import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" data-theme="light">
      <Head>
        <title>Awesome Real-Time Chat</title>
        <meta name="description" content="Awesome Real-Time Chat is a fast, secure, and responsive messaging platform that enables users to connect instantly across devices. Enjoy seamless communication with real-time updates, typing indicators, and modern UI." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
