/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  // async redirects() {
  //   return [
  //     {
  //       source: '/',
  //       has: [
  //         {
  //           type: 'cookie',
  //           key: 'i18next',
  //           value: 'zh'
  //         },
  //       ],
  //       permanent: true,
  //       destination: '/en/dashbaord',
  //     },
  //     {
  //       // this gets converted to /(en|fr|de)/(.*) so will not match the top-level
  //       // `/` or `/fr` routes like /:path* would
  //       source: '/(.*)',
  //       destination: '/dashboard',
  //       permanent: false,
  //     },
  //   ]
  // },
};

module.exports = {
  nextConfig,
};
