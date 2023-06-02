import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.10",
  networks: {
    goerli: {
      url: process.env.INFURA_GOERLI_ENDPOINT,
      accounts: [process.env.PRIVATE_KEY!],
    },
    hardhat: {
      forking: {
        url: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
      }
    },
  },
};

export default config;
