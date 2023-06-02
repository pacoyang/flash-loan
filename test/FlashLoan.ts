import { expect } from "chai";
import { ethers } from "hardhat";

describe("Flash Loan", function () {
  it("Deployment should assign the total supply of tokens to the owner", async function () {
    const FlashLoan = await ethers.getContractFactory("FlashLoan");
    const flashLoan = await FlashLoan.deploy("0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e");
    console.info("Flash loan contract deployed:", flashLoan.address);
    const balance = await flashLoan.getBalance("0x98C23E9d8f34FEFb1B7BD6a91B7FF122F4e16F5c");
    console.info("AAVE USDC balance:", balance);
    expect(balance).to.equal(0);
  });
});
