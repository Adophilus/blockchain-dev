const Token = require('./Token')
const moment = require('moment')

const { accounts, config, provider } = Token

async function main() {
  const token = { address: config.tokens.erc20.bsc.METAROBOX }
  const account = accounts.secondary

  try {
    token.contract = await Token.initContract(
      token.address,
      'METAROBOX',
      account.address
    )
    console.log('Instantiated contract object!')
  } catch (err) {
    console.log('Failed to instantiate token contract')
    console.log(err)
    return false
  }

  try {
    token.balance = await Token.fetchBalance(token.contract, account.address)
    console.log(`Balance of the ${account.address} is ${token.balance}`)
  } catch (err) {
    console.log("Couldn't fetch balance")
    console.log(err)
  }

  try {
    token.unlockTime = moment.unix(
      await token.contract.methods.unlockTime().call()
    )
    console.log(`The token is unlocking at: ${token.unlockTime}`)
  } catch (err) {
    console.log(`Token unlock date could not be determined!`)
    console.log(err)
  }

  try {
    const res = await token.contract.methods
      .getAvailableBalance(account.address)
      .call()
    console.log(`Available balance of ${account.address} is ${res}`)
  } catch (err) {
    console.log("Couldn't fetch balance")
    console.log(err)
  }

  try {
    const unlockPerSecond = await token.contract.methods
      .unlockPerSecond()
      .call()
    const secondsRequired = token.balance / unlockPerSecond
    const totalUnlockTime = moment(token.unlockTime).add(
      secondsRequired,
      'seconds'
    ) // .fromNow()
    console.log(secondsRequired)
    console.log(`Your token will be completely unlocked on ${totalUnlockTime}`)
  } catch (err) {
    console.log(`Couldn't determine total unlock time of the token`)
    console.log(err)
  }
}

main()
  .then(() => {
    provider.engine.stop()
    console.log('Execution completed!')
  })
  .catch((err) => {
    provider.engine.stop()
    console.log('An error occurred')
    console.log(err)
  })
