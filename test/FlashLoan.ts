import { expect } from "chai";
import { ethers } from "hardhat";

describe("Flash Loan", function () {
  it("Deployment should assign the total supply of tokens to the owner", async function () {
    const weth_address = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
    const FlashLoan = await ethers.getContractFactory("FlashLoan");
    const flashLoan = await FlashLoan.deploy(
      // AAVE Mainnet PoolAddressesProvider
      "0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e",
      // uniswap
      "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
      // sushiswap
      "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F",
      // weth
      weth_address,
      // dai
      "0x6b175474e89094c44da98b954eedeac495271d0f",
    );
    console.info("Flash loan contract deployed:", flashLoan.address);
    const tx = await flashLoan.requestFlashLoan(weth_address, 1);
    // wait until the transaction mined
    const result = await tx.wait();
    console.info(result);
  });
});
