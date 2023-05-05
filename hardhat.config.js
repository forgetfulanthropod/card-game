require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

const { TEST_GOERLI_PRIVATE_KEY, TEST_GOERLI_RPC_URL } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    goerli: {
      url: TEST_GOERLI_RPC_URL,
      accounts: [TEST_GOERLI_PRIVATE_KEY]
    }
  }
};
