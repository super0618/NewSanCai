const withImages = require('next-images');
const withFonts = require('next-fonts');

const LOCALES = ['zh-cn', 'zh-tw', 'en'];
const DEFAULT_LOCALE = LOCALES[0];

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const NODE_ENV = process.env.NODE_ENV;

const isProd = NODE_ENV === 'production';

module.exports = withFonts(withImages({
    i18n: {
        locales: LOCALES,
        defaultLocale: DEFAULT_LOCALE,
        localeDetection: false
    },
    swcMinify: true,
    images: {
        disableStaticImages: true
    },
    webpack (config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: [
                {
                    loader: '@svgr/webpack',
                    options: {
                        svgoConfig: {
                            plugins: [
                                {
                                    name: 'preset-default',
                                    params: {
                                        overrides: {
                                            removeViewBox: false
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            ]
        });

        config.module.rules.forEach((rule) => {
            if (rule.test !== undefined && rule.test.source.includes('|svg|')) {
                rule.test = new RegExp(rule.test.source.replace('|svg|', '|'));
            }
        });

        return config;
    },
    ...(!isProd
        ? {
            async rewrites () {
                return [
                    {
                        source: '/api/:slug*',
                        destination: `${API_URL}/api/:slug*`
                    },
                    {
                        source: '/server/files/:slug*',
                        destination: `${API_URL}/server/files/:slug*`
                    },
                    {
                        source: '/server/oldFiles/:slug*',
                        destination: `${API_URL}/server/oldFiles/:slug*`
                    },
                    {
                        source: '/server/seeds/:slug*',
                        destination: `${API_URL}/server/seeds/:slug*`
                    }
                ];
            }
        }
        : {}),
    async headers () {
        return [
            {
                // Apply these headers to all routes in your application.
                source: '/:path*{/}?',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        // eslint-disable-next-line max-len
                        value: "default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob: 'unsafe-inline'; frame-src *; style-src * 'unsafe-inline';"
                    }
                ]
            }
        ];
    }
}));
