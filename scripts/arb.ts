import Web3 from 'web3'
import WebSocketProvider from 'web3-providers-ws'
import { BlockHeaderOutput } from 'web3-types'
import IFactory from '@uniswap/v2-core/build/IUniswapV2Factory.json'
import IPair from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import tunnel from 'tunnel'
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()

const agent = tunnel.httpsOverHttp({
  proxy: {
    host: process.env.TUNNEL_HOST!,
    port: parseInt(process.env.TUNNEL_PORT!, 10),
  }
})
const provider = new WebSocketProvider(process.env.INFURA_MAINNET_WS_ENDPOINT!, {
  agent,
})
const web3 = new Web3(provider)
const FlashLoan = JSON.parse(fs.readFileSync('./artifacts/contracts/FlashLoan.sol/FlashLoan.json').toString())
const uniswapFactory = new web3.eth.Contract(IFactory.abi, process.env.UNISWAP_FACTORY_ADDRESS) as any
const sushiFactory = new web3.eth.Contract(IFactory.abi, process.env.SUSHISWAP_FACTORY_ADDRESS) as any

async function main() {
  const balance = await web3.eth.getBalance(process.env.ACCOUNT_ADDRESS!)
  console.log('Balance Eth: ' + web3.utils.fromWei(balance.toString(10), 'ether'))

  const uniswapPair = await uniswapFactory.methods.getPair(process.env.WETH_ADDRESS, process.env.DAI_ADDRESS).call()
  const uniswapPairContract = new web3.eth.Contract(IPair.abi, uniswapPair)
  const sushiPair = await sushiFactory.methods.getPair(process.env.WETH_ADDRESS, process.env.DAI_ADDRESS).call()
  const sushiPairContract = new web3.eth.Contract(IPair.abi, sushiPair)

  const subscription = await web3.eth.subscribe('newHeads')
  subscription.on('data', async (blockhead: BlockHeaderOutput) => {
    console.log('New block header: ', blockhead)
    const result = await uniswapPairContract.methods.getReserves().call() as any[]
    const {
      '0': reserveTokenA1,
      '1': reserveTokenB1,
    } = result
    console.info(result)
    console.info(`Uniswap: 1 ETH = ${reserveTokenA1 / reserveTokenB1} DAI`)
    const {
      '0': reserveTokenA2,
      '1': reserveTokenB2,
    } = await sushiPairContract.methods.getReserves().call() as any[]
    console.info(`SushiSwap: 1 ETH = ${reserveTokenA2 / reserveTokenB2} DAI`)
  })
  subscription.on('error', error =>
    console.log('Error when subscribing to New block header: ', error),
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
