import Binance from '../assets/img/BSC.png';
import Polygon from '../assets/img/Polygon.png';
import Ethereum from '../assets/img/Ethereum.png';
import Fantom from '../assets/img/Fantom.png';

export const networkConfigs = {
  "0x1": {
    currencySymbol: "ETH",
    blockExplorerUrl: "https://etherscan.io/",
    wrapped: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  },
  "0x3": {
    currencySymbol: "ETH",
    blockExplorerUrl: "https://ropsten.etherscan.io/",
  },
  "0x2a": {
    currencySymbol: "ETH",
    blockExplorerUrl: "https://kovan.etherscan.io/",
  },
  "0x4": {
    currencySymbol: "ETH",
    blockExplorerUrl: "https://rinkeby.etherscan.io/",
  },
  "0x5": {
    currencySymbol: "ETH",
    blockExplorerUrl: "https://goerli.etherscan.io/",
  },
  "0x539": {
    chainName: "Local Chain",
    currencyName: "ETH",
    currencySymbol: "ETH",
    rpcUrl: "http://127.0.0.1:8545",
  },
  "0xa86a": {
    chainId: 43114,
    chainName: "Avalanche Mainnet",
    currencyName: "AVAX",
    currencySymbol: "AVAX",
    rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
    blockExplorerUrl: "https://cchain.explorer.avax.network/",
  },

  //BSC main
  "0x38": {
    chainId: 56,
    chainName: "Smart Chain",
    currencyName: "BNB",
    currencySymbol: "BNB",
    rpcUrl: "https://bsc-dataseed.binance.org/",
    blockExplorerUrl: "https://bscscan.com/",
    wrapped: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
  },
  "0x61": {
    chainId: 97,
    chainName: "Smart Chain - Testnet",
    currencyName: "BNB",
    currencySymbol: "BNB",
    rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545/",
    blockExplorerUrl: "https://testnet.bscscan.com/",
  },

  //polygon main
  "0x89": {
    chainId: 137,
    chainName: "Polygon Mainnet",
    currencyName: "MATIC",
    currencySymbol: "MATIC",
    rpcUrl: "https://rpc-mainnet.maticvigil.com/",
    blockExplorerUrl: "https://explorer-mainnet.maticvigil.com/",
    wrapped: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
  },
  "0x13881": {
    chainId: 80001,
    chainName: "Mumbai",
    currencyName: "MATIC",
    currencySymbol: "MATIC",
    rpcUrl: "https://rpc-mumbai.matic.today/",
    blockExplorerUrl: "https://mumbai.polygonscan.com/",
  },

  //fantom main
  "0xfa": {
    chainId: 250,
    chainName: "Fantom Mainnet",
    currencyName: "FTM",
    currencySymbol: "FTM",
    rpcUrl: "https://rpc.ftm.tools/",
    blockExplorerUrl: "https://ftmscan.com/"
  },

  "0xfa2": {
    chainId: 4002,
    chainName: "Fantom Testnet",
    currencyName: "FTM",
    currencySymbol: "FTM",
    rpcUrl: "https://rpc.testnet.fantom.network/",
    blockExplorerUrl: "https://faucet.fantom.network/"
  }

};

export const getNativeByChain = (chain) =>
  networkConfigs[chain]?.currencySymbol || "NATIVE";

export const getChainById = (chain) => networkConfigs[chain]?.chainId || null;

export const getExplorer = (chain) => networkConfigs[chain]?.blockExplorerUrl;

export const getWrappedNative = (chain) =>
  networkConfigs[chain]?.wrapped || null;

// export const chainNum = {
//   "Ethereum": '0x1',
//   "Polygon": '0x89',
//   "Binance": '0x38',
//   "Fantom": '0xfa'
// };

export const chainNum = {
  "Ethereum": '0x3',
  "Polygon": '0x13881',
  "Binance": '0x61',
  "Fantom": '0xfa2'
};

// export const chainUrl = {
//   "Binance": "https://bscscan.com/",
//   "Ethereum": "https://etherscan.io/",
//   "Fantom": "https://ftmscan.com/",
//   "Polygon": "https://polygonscan.com/"
// };

export const chainUrl = {
  "Binance": "https://testnet.bscscan.com/",
  "Ethereum": "https://ropsten.etherscan.io/",
  "Fantom": "https://testnet.ftmscan.com/",
  "Polygon": "https://explorer-mumbai.maticvigil.com/"
};


export const chain = {
  "Binance": Binance,
  "Ethereum": Ethereum,
  "Fantom": Fantom,
  "Polygon": Polygon
};