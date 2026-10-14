const fs = require('fs');
const path = require('path');

const configuredUrl = process.env.CHATTER_BACKEND_URL;

if (!configuredUrl) {
  throw new Error('Set the CHATTER_BACKEND_URL GitHub Actions variable to the HTTPS Render service URL.');
}

let backendUrl;
try {
  backendUrl = new URL(configuredUrl);
} catch (error) {
  throw new Error('CHATTER_BACKEND_URL must be a valid HTTPS URL.');
}

if (
  backendUrl.protocol !== 'https:' ||
  !backendUrl.hostname ||
  backendUrl.username ||
  backendUrl.password ||
  backendUrl.pathname !== '/' ||
  backendUrl.search ||
  backendUrl.hash
) {
  throw new Error('CHATTER_BACKEND_URL must be an HTTPS origin without a path, query, or fragment.');
}

const outputDirectory = path.join(__dirname, '..', 'dist', 'chat');
const assetsDirectory = path.join(outputDirectory, 'assets');
const indexPath = path.join(outputDirectory, 'index.html');

if (!fs.existsSync(indexPath) || !fs.existsSync(assetsDirectory)) {
  throw new Error('Angular build output was not found at dist/chat.');
}

fs.writeFileSync(
  path.join(assetsDirectory, 'config.js'),
  'window.CHATTER_CONFIG = ' + JSON.stringify({ backendUrl: backendUrl.origin }) + ';\n'
);
fs.copyFileSync(indexPath, path.join(outputDirectory, '404.html'));
