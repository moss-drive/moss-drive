const { VITE_OP_CHAINID, VITE_BLAST_CHAINID } = import.meta.env;

export const netList = [
  {
    name: "Optimism",
    icon: "net-op.png",
    icon2: "net-op-2.svg",
    id: VITE_OP_CHAINID * 1,
  },
  {
    name: "Blast",
    icon: "net-blast.png",
    icon2: "net-blast-2.png",
    id: VITE_BLAST_CHAINID * 1,
  },
];

export function getNetItem(id) {
  return netList.find((it) => it.id == id);
}

export function getNetIcon(id, field = "icon") {
  const row = netList.find((it) => it.id == id);
  if (!row) return "net-error.svg";
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
    if (error.code == 4902 || error.data?.originalError.code == 4902) {
      await addChain(id);
    } else {
      throw new Error(error.message);
    }
  }
}
