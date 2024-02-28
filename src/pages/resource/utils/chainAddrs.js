const inDev = process.env.NODE_ENV != "production";
export const optimismRecharge = inDev
  ? "0x3cA298d7A98262C0598dd91Ce926f23e51c4b293"
  : "0x19f240DD39FEF12D139a4E0Ae81f44945c06092f";

export const MumbaiUSDC = inDev
  ? "0x673Df4EF6C1e3994f502325a3181a0b4175F1333"
  : "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";
export const MumbaiUSDT = inDev
  ? "0xC76aC6e0C9E86B08AcF334b2CC10A784165Ae3B9"
  : "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
export const MumbaiDAI = inDev
  ? "0x9f2a131036dFb7f6809C49E084d52e836d31e79d"
  : "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063";
export const MumbaiUSDCE = inDev
  ? "0x673Df4EF6C1e3994f502325a3181a0b4175F1333"
  : "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
export const GoerliUSDC = inDev
  ? "0x8f02889d36d01BdF95b3B7B63a32629fc46e643E"
  : "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
export const GoerliUSDT = inDev
  ? "0x94AaF8D29b814149A97489124Ac940d34096EB72"
  : "0xdAC17F958D2ee523a2206206994597C13D831ec7";
export const GoerliDAI = inDev
  ? "0x568237585b8a3edFF837ef9Ab10cCF08C383C884"
  : "0x6B175474E89094C44Da98b954EedeAC495271d0F";
export const ChapelUSDC = inDev
  ? "0x0092190380bAD586d68fB788D62CdB7300Af1c2c"
  : "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d";
export const ChapelUSDT = inDev
  ? "0x5e338E7a9C3Be53a3e494Bb753104C480FeeDe7D"
  : "0x55d398326f99059fF775485246999027B3197955";
export const ChapelDAI = inDev
  ? "0x80A3F669B88c053b53BFa7c8b14139842e7573DA"
  : "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3";
export const ArbitrumUSDC = inDev
  ? "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8"
  : "0xaf88d065e77c8cC2239327C5EDb3A432268e5831";
export const ArbitrumUSDT = inDev
  ? "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8"
  : "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9";
export const ArbitrumDAI = inDev
  ? "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8"
  : "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1";
export const zkSyncUSDC = inDev
  ? "0x1CBFB107555fBa8DB2DaDfC00413405750B045dC"
  : "0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4";
export const zkSyncUSDT = inDev
  ? "0x4c314a3Bf152d86bE8D9c4447509D0D063F901D8"
  : "0x493257fD37EDB34451f62EDf8D2a0C418852bA4C";
export const zkSyncDAI = inDev
  ? "0xFa8A53251FFfa08E1771CF10735FD7237e3bcBF4"
  : "0x4B9eb6c0b6ea15176BBF62841C6B2A8a398cb656";
export const optimisUSDC = inDev
  ? "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85"
  : "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85";
export const optimisUSDT = inDev
  ? "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58"
  : "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58";
export const optimisDAI = inDev
  ? "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1"
  : "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1";
export const optimisETH = inDev
  ? "0x4200000000000000000000000000000000000006"
  : "0x4200000000000000000000000000000000000006";

export const chainAddrList = [
  {
    name: "Optimism",
    coin: {
      eth: optimisETH,
      usdc: optimisUSDC,
      usdt: optimisUSDT,
      dai: optimisDAI,
    },
    landRecharge: optimismRecharge,
    chainId: 10,
  },
  {
    name: "everPay",
    coin: {
      usdc: optimisUSDC,
      usdt: optimisUSDT,
      dai: optimisDAI,
    },
    landRecharge: optimismRecharge,
    chainId: 99999999,
  },
];
