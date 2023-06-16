import { ethers } from "hardhat";

async function main() {
  const contract_address = "0x1Fc4cf07eD72Ab0c58693763516d064122487bA0";
  const FlashLoan = await ethers.getContractFactory("FlashLoan");
  const flashLoan = await FlashLoan.attach(contract_address);
  const uniswapPrice = await flashLoan.getUniswapPrice(
    "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", // router address
    "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6", // weth
    "0x5c221e77624690fff6dd741493d735a17716c26b", // dai
    1,
  )
  console.info(uniswapPrice);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
