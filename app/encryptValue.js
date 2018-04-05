const encryptionHelper = require('./encryptionHelper')

module.exports = async (req, res, next) => {

  const plainValue = req.body.plainValue

  /*
  Option 1 - basic encryption :(
  */

  const encryptedValue = encryptionHelper.encrypt(plainValue, 'thisisthesecretkey')

  res.json({
    encryptedValue: encryptedValue
  })

}
