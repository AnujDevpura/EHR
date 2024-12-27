require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");

const { mnemonic } = require('./secrets.json');

/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      chainId: 31337, // Local Hardhat network
    },
    sepolia: {
      url: "https://opt-sepolia.g.alchemy.com/v2/xD6U8XVSJ1DEXI2poVpw0ZW2jfb6ZMKu",
      accounts: [`0xbafdaebf810e1931929b0104422c196d4f291367b55689b5d403395e7f485da3`]
    }
  },
};
