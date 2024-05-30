const {
  VITE_OP_BLOCKURL,
  VITE_OP_CHAINID,
  VITE_BLAST_CHAINID,
  VITE_BLAST_BLOCKURL,
  VITE_TAIKO_CHAINID,
  VITE_TK_BLOCKURL,
  VITE_ZK_CHAINID,
  VITE_ZK_BLOCKURL,
  VITE_OPTO_CHAINID,
  VITE_OPTO_BLOCKURL,
} = import.meta.env;

export const netList = [
  {
    name: "Optimism",
    icon: "net-op.png",
    icon2: "net-op-2.svg",
    id: VITE_OP_CHAINID * 1,
    blockUrl: VITE_OP_BLOCKURL,
  },
  {
    name: "Blast",
    icon: "net-blast.png",
    icon2: "net-blast-2.png",
    id: VITE_BLAST_CHAINID * 1,
    blockUrl: VITE_BLAST_BLOCKURL,
  },
  {
    name: "Taiko",
    icon: "net-taiko.png",
    icon2: "net-taiko-2.png",
    id: VITE_TAIKO_CHAINID * 1,
    blockUrl: VITE_TK_BLOCKURL,
  },
];
if (VITE_ZK_CHAINID) {
  netList.push({
    name: "zkSync",
    icon: "net-zk.png",
    icon2: "net-zk-2.png",
    id: VITE_ZK_CHAINID * 1,
    blockUrl: VITE_ZK_BLOCKURL,
  });
}
if (VITE_OPTO_CHAINID) {
  netList.push({
    name: "Optopia",
    icon: "net-opto.png",
    icon2: "net-opto-2.png",
    id: VITE_OPTO_CHAINID * 1,
    blockUrl: VITE_OPTO_BLOCKURL,
  });
}

export function getNetItem(id) {
  return netList.find((it) => it.id == id);
}

export function getNetIcon(id, field = "icon") {
  const row = netList.find((it) => it.id == id);
  if (!row) return "net-switch.svg";
  return row[field];
}

export const chainMap = {
  10: {
    chainId: "0xa",
    chainName: "Optimism LlamaNodes",
    rpcUrls: ["https://optimism.llamarpc.com"],
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorerUrls: ["https://optimistic.etherscan.io"],
  },
  11155420: {
    chainId: "0xaa37dc",
    chainName: "OP Sepolia Testnet",
    rpcUrls: ["https://optimism-sepolia.blockpi.network/v1/rpc/public"],
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
  },
  168587773: {
    chainId: "0xa0c71fd",
    chainName: "Blast Sepolia Testnet",
    rpcUrls: ["https://blast-sepolia.blockpi.network/v1/rpc/public"],
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
  },
  81457: {
    chainId: "0x13e31",
    chainName: "Blast Mainnet",
    rpcUrls: ["https://rpc.blast.io"],
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
  },
  167009: {
    chainId: "0x28c61",
    chainName: "Taiko Hekla L2",
    rpcUrls: ["https://rpc.hekla.taiko.xyz"],
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
  },
  167000: {
    chainId: "0x28c58",
    chainName: "Taiko Mainnet",
    rpcUrls: ["https://rpc.mainnet.taiko.xyz"],
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
  },
  324: {
    chainId: "0x144",
    chainName: "zkSync Mainnet",
    rpcUrls: ["https://mainnet.era.zksync.io"],
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
  },
  62050: {
    chainId: "0xf262",
    chainName: "Optopia Mainnet",
    rpcUrls: ["https://rpc-mainnet.optopia.ai"],
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
  },
};

async function addChain(id) {
  let params = chainMap[id];
  if (!window.ethereum || !params) {
    return false;
  }

  try {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [params],
    });
  } catch (error) {
    console.log("add chain err", error);
  }
}
export async function switchNet(id) {
  const chainId = "0x" + Number(id).toString(16);
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId }],
    });
  } catch (error) {
    console.log("switch error", error);
    console.log(error.code);
    if (error.code == 4902 || error.data?.originalError.code == 4902) {
      await addChain(id);
    } else {
      throw new Error(error.message);
    }
  }
}
