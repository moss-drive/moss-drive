import { MossHub__factory, Helpers__factory } from "moss-v5";
import { providers, utils } from "ethers";
const {
  VITE_OP_CONTRACT,
  VITE_OP_HELPER_CONTRACT,

  VITE_BLAST_CHAINID,
  VITE_BL_CONTRACT,
  VITE_BL_HELPER_CONTRACT,

  VITE_TAIKO_CHAINID,
  VITE_TK_CONTRACT,
  VITE_TK_HELPER_CONTRACT,

  VITE_ZK_CHAINID,
  VITE_ZK_CONTRACT,
  VITE_ZK_HELPER_CONTRACT,

  VITE_OPTO_CHAINID,
  VITE_OPTO_CONTRACT,
  VITE_OPTO_HELPER_CONTRACT,

  VITE_OPBNB_CHAINID,
  VITE_OPBNB_CONTRACT,
  VITE_OPBNB_HELPER_CONTRACT,
} = import.meta.env;

const map1 = {
  OP: VITE_OP_CONTRACT,
  BL: VITE_BL_CONTRACT,
  TK: VITE_TK_CONTRACT,
  ZK: VITE_ZK_CONTRACT,
  OPTO: VITE_OPTO_CONTRACT,
  OPBNB: VITE_OPBNB_CONTRACT,
};
const map2 = {
  OP: VITE_OP_HELPER_CONTRACT,
  BL: VITE_BL_HELPER_CONTRACT,
  TK: VITE_TK_HELPER_CONTRACT,
  ZK: VITE_ZK_HELPER_CONTRACT,
  OPTO: VITE_OPTO_HELPER_CONTRACT,
  OPBNB: VITE_OPBNB_HELPER_CONTRACT,
};

export class MossHub {
  constructor(chainId) {
    let type = "OP";
    if (chainId == VITE_BLAST_CHAINID) type = "BL";
    else if (chainId == VITE_TAIKO_CHAINID) type = "TK";
    else if (chainId == VITE_ZK_CHAINID) type = "ZK";
    else if (chainId == VITE_OPTO_CHAINID) type = "OPTO";
    else if (chainId == VITE_OPBNB_CHAINID) type = "OPBNB";
    this.client = MossHub__factory.connect(map1[type], this.signer);
    this.helper = Helpers__factory.connect(map2[type], this.signer);
  }
  get provider() {
    return new providers.Web3Provider(window.ethereum);
  }
  get signer() {
    if (!window.ethereum) {
      throw new Error("Wallet not found");
    }
    return this.provider.getSigner();
  }
  get chainId() {
    return Number(window.ethereum.chainId);
  }
  async getWalletAddr() {
    const addr = await this.signer.getAddress();
    return (addr || "").toLowerCase();
  }

  async checkNet() {
    await this.getWalletAddr();
  }

  genChainId(id) {
    return "0x" + Number(id).toString(16);
  }
  async switchNet(id) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: this.genChainId(id) }],
      });
    } catch (error) {
      if (error.code == 4902 || error.data?.originalError.code == 4902) {
        await this.addChainById(id);
        return this.switchNet(id);
      } else {
        throw error;
      }
    }
  }

  addChainById(id) {
    const config = {
      80001: {
        chainName: "polygon mumbai",
        rpcUrls: ["https://rpc.ankr.com/polygon_mumbai"],
        nativeCurrency: {
          name: "matic Coin",
          symbol: "MATIC",
          decimals: 18,
        },
      },
    };
    const params = config[id];
    if (!params) {
      throw window.$toast("No Wallet Connected");
    }
    params.chainId = this.genChainId(id);
    return this.addChain(params);
  }

  addChain(params) {
    console.log(params);
    return window.ethereum.request(
      {
        method: "wallet_addEthereumChain",
        params: [params],
      }
      // this.connectAddr
    );
  }

  parseEther(val) {
    return utils.parseEther(val);
  }
  formatEther(val) {
    return (utils.formatEther(val) * 1).toFixed(5);
  }

  create(arr) {
    console.log(arr);
    return this.client.create(...arr);
  }
  mint(arr) {
    return this.client.mint(...arr);
  }
  burn(arr) {
    return this.client.burn(...arr);
  }
  stoneMint(arr) {
    return this.helper.stoneMint(...arr);
  }
  stoneBurn(arr) {
    return this.helper.stoneBurn(...arr);
  }
}
