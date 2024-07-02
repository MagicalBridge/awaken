const crypto = require('crypto');
const calculateTime = require('./work-01.js')

// generate public key and private key
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048, 
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
});

// generate hash
const { hash } = calculateTime("MagicalBridge", "0000", 4)

console.log("hash", hash);

// generate signature
const signature = crypto.sign('SHA256', Buffer.from(hash), {
  key: privateKey,
  padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
});

// verify signature
const verified = crypto.verify(
  'SHA256',
  Buffer.from(hash),
  {
    key: publicKey,
    padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
  },
  signature 
);

console.log(verified); // true

