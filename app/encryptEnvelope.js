const encryptionHelper = require('./encryptionHelper')

module.exports = async (req, res, next) => {

  const plainValue = req.body.plainValue

  /*
  Option 2 - envelope encryption :)
  */

  const envelope = await encryptionHelper.encryptEnvelope(plainValue)

  res.json({
    envelope
  })

}
