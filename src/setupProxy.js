// const { createProxyMiddleware } = require('http-proxy-middleware');

// module.exports = function(app) {
//   app.use(
//     '/api',
//     createProxyMiddleware({
//       target: 'https://careerfus.azurewebsites.net',
//       changeOrigin: true,
//       secure: false,
//       pathRewrite: {
//         '^/api': '',
//       },
//     })
//   );
// };
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://jobcareer.azurewebsites.net',
      changeOrigin: true,
    })
  );
};
// https://jobcareer.azurewebsites.net/api/Auth/register
