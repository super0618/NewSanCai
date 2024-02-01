import { Html, Head, Main, NextScript } from 'next/document';

export default function Document () {
    return (
        <Html>
            <Head>
                {process.env.TEST_MODE === 'true' ? <meta name="robots" content="noindex" /> : null}
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
