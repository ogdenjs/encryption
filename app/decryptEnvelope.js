const encryptionHelper = require('./encryptionHelper')

module.exports = async (req, res, next) => {

  /*
  Option 2 - envelope encryption :)
  */

  const envelope = req.body.envelope

  const plainValue = await encryptionHelper.decryptEnvelope(envelope)

  res.json({
    plainValue: plainValue
  })

}
