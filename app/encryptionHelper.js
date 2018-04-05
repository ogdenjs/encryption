/**
https://andreas.github.io/2015/02/04/envelope-encryption-with-amazon-kms/

Generate a data key with the GenerateDataKey endpoint to obtain a key both as plaintext and ciphertext (encrypted).
Use the plaintext key to encrypt the payload.
Transmit the encrypted key along with the encrypted payload.
To decrypt the data, use KMS to decrypt the encrypted key and then decrypt the payload with the plaintext key.

https://www.linkedin.com/pulse/security-service-nodejs-aws-kms-ricky-sanders/

https://blog.koan.co/securing-customer-data-with-kms-and-envelope-encryption-in-node-js-b61983ddaa98
https://github.com/arendn/envelope_encryption


 */

/*
This module uses envelope encryption, which uses aws KMS to generate an encrypted key which
is used to encrypt the value, then both are to be stored (along with the
AWS KMS CMKID (customer master key ID, in case we ever use multiple CMKs)).

To decrypt the envelope, the key is decrypted by AWS KMS, and then the decrypted key
is used to decrypt the value
*/
const { KMS } = require('aws-sdk')
const crypto = require('crypto')
const ALGO = 'aes256'

// Global configuration for aws sdk
// aws credentials are not needed if my environment variables are named AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
const kms = new KMS({ apiVersion: '2014-11-01', region: 'us-east-1' })

module.exports = {
  encrypt,
  decrypt,
  encryptEnvelope,
  decryptEnvelope
}

function encrypt(plainText, plainKey){
  const cipher = crypto.createCipher(ALGO, plainKey)
  const encryptedStr = cipher.update(plainText, 'utf8', 'base64')
  return encryptedStr + cipher.final('base64')
}

function decrypt(encryptedValue, plainKey){
  const decipher = crypto.createDecipher(ALGO, plainKey)
  const decryptedStr = decipher.update(encryptedValue, 'base64', 'utf8')
  return decryptedStr + decipher.final('utf8')
}

/**
 * Created an encryption envelope with a plain value, using AWS KMS to create a
 * key which is used to encrypt the value, and then stored with the encrypted value
 * @param  {string} plainValue]
 * @return {object}            Envelope object
 */
async function encryptEnvelope(plainValue){
  const dataKeyResult = await kms.generateDataKey({
    KeyId: process.env.AWS_KMS_ARN,
    KeySpec: 'AES_256',
  }).promise()
  const {CiphertextBlob, Plaintext} = dataKeyResult

  const encryptedKey = CiphertextBlob.toString('base64')
  const plainKey = Plaintext.toString('base64')
  const encryptedValue = encrypt(plainValue, plainKey)

  return {
    awsKmsArn: process.env.AWS_KMS_ARN, //full arn of the key used to encrypt the encryptedKey (in case we ever have multiple AWS keys)
    encryptedValue, //encrypted by the plain text key that comes from the encryptedKey
    encryptedKey //encrypted by AWS KMS
  }
}

/**
 * Decrypt an envelope by first decrypting the encryptedKey using AWS KMS, then decrypt the value using that key
 * @param  {object} envelope We need at least the encryptedValue and encryptedKey
 * @return {string}          The plain text value
 */
async function decryptEnvelope(envelope){
  const {encryptedValue, encryptedKey} = envelope

  const keyDecryptResult = await kms.decrypt({
    CiphertextBlob: Buffer.from(encryptedKey, 'base64'),
  }).promise()

  const plainKey = keyDecryptResult.Plaintext.toString('base64')
  const decryptedValue = decrypt(encryptedValue, plainKey)
  const plainValue = decryptedValue.toString('utf8')
  return plainValue
}
