const encryptionHelper = require('./encryptionHelper')

module.exports = async (req, res, next) => {

  /*
  Option 1 - basic encryption :(
  */

  const encryptedValue = req.body.encryptedValue

  const plainValue = encryptionHelper.decrypt(encryptedValue, 'thisisthesecretkey')

  res.json({
    plainValue: plainValue
  })

}
