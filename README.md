# Node.js Authentication Template
Simple Node.js template that features JWT-based authentication using mongodb, mongoose, passport and express.

## Generating a Self-Signed Certificate

(This implementation assumes that the private key file and 
the certificate are located in the `/cert` folder)

1. Generate a new RSA private key using
`openssl genrsa 2048 > privatekey.pem`

2. Generate a certificate signing request using
`openssl req -new -key privatekey.pem -out cert.csr`
(and fill in the required data)

3. Usually, you would submit this signing request to a certification 
authority (CA), but here we are self-signing the certificate. 
Hence, we proceed by using
`openssl x509 -req -in cert.csr -signkey privatekey.pem -out certificate.pem`

**Note**: When you open your browser and visit the https-version of 
your site, the browser will flash a warning that this site is not 
secure, which is because obviously no CA has signed our certificate 
but we did that ourselves. For development purposes though, a 
self-signed certificate will do.

## Installation

1. make sure you have node and npm installed
2. run `npm install` in the root directory 
3. edit the `config.js` file to suit your needs / configuration
4. make sure the mongodb server referenced by `dbUrl` in `config.js` is running
5. run `npm start` to start the server