import { MossHub__factory, Helpers__factory } from "moss-v5";
import { providers, utils } from "ethers";
const { VITE_MOSS_HUB_CONTRACT, VITE_MOSS_HELPER_CONTRACT, VITE_MOSS_CHAINID } = import.meta.env;

console.log(VITE_MOSS_HUB_CONTRACT);
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
  getWalletAddr() {
    return this.signer.getAddress();
  }

  async checkNet() {
    const id = VITE_MOSS_CHAINID;
    if (this.chainId != id) {
      return this.switchNet(id);
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
      throw new Error("No Params");
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

  parseEther(num) {
    return utils.parseEther(num);
  }
  formatEther(num) {
    return utils.formatEther(num);
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
