import { MossHub__factory, Helpers__factory } from "moss-v5";
import { providers, utils } from "ethers";
const { VITE_MOSS_HUB_CONTRACT, VITE_MOSS_HELPER_CONTRACT, VITE_MOSS_CHAINID } = import.meta.env;

export class MossHub {
  constructor() {
    this.client = MossHub__factory.connect(VITE_MOSS_HUB_CONTRACT, this.signer);
    this.helper = Helpers__factory.connect(VITE_MOSS_HELPER_CONTRACT, this.signer);
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
    const id = VITE_MOSS_CHAINID;
    try {
      await this.getWalletAddr();
      if (this.chainId != id) {
        // throw new Error("Wrong Network");
      }
    } catch (error) {
      throw new Error("Please connect your wallet");
    }
    if (this.chainId != id) {
      // return this.switchNet(id);
    }
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
