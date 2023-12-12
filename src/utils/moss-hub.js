import { MossHub__factory, Helpers__factory } from "moss-v5";
import { providers, utils } from "ethers";

export class MossHub {
  constructor() {
    const signer = this.getSigner();
    console.log(signer);
    this.client = MossHub__factory.connect("0xdB4350aaBF0Cb4c159A9cC1FA33d355Fc241BE53", signer);
    this.helper = Helpers__factory.connect("0x6b146C52bf279d14c5F88f206a8211cB037b3737", signer);
  }
  getSigner() {
    if (!window.ethereum) {
      throw "window.ethereum not found";
    }
    return new providers.Web3Provider(window.ethereum).getSigner();
  }

  parseEther(num) {
    return utils.parseEther(num);
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
