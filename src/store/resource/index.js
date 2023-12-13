import { BigNumber } from "ethers";
import { fetchLand, fetchUsage, fetchPrice } from "../../api/resource";
import { formatLand, getFileSize } from "../../utils/helper";

const resourceStore = {
  namespaced: true,
  state: () => {
    return {
      land: "0",
      usage: [
        {
          percent: 0,
          total: 0,
          type: "IPFS_STORAGE",
          used: 0,
        },
        {
          percent: 0,
          total: 0,
          type: "AR_STORAGE",
          used: 0,
        },
        {
          percent: 0,
          total: 0,
          type: "BUILD_TIME",
          used: 0,
        },
        {
          percent: 0,
          total: 0,
          type: "TRAFFIC",
          used: 0,
        },
      ],
      resourcePrice: {
        AR_STORAGE: {
          data: "5593523383000000",
          unitPrice: BigNumber.from("5593523383000000"),
        },
        BUILD_TIME: {
          data: "500000000000000000000",
          unitPrice: BigNumber.from("500000000000000000000"),
        },
        TRAFFIC: {
          data: "93132257000000",
          unitPrice: BigNumber.from("93132257000000"),
        },
        COMPUTE_UNIT: {
          data: "200000000000000000",
          unitPrice: BigNumber.from("200000000000000000"),
        },
        IPFS_STORAGE: {
          data: "28744524",
          unitPrice: BigNumber.from("28744524"),
        },
      },
    };
  },
  getters: {
    formatLand(state) {
      return formatLand(state.land, true);
    },
    land2Resource(state) {
      const land = BigNumber.from(state.land);
      const IPFS_STORAGE = land.div(state.resourcePrice["IPFS_STORAGE"].unitPrice.mul(86400 * 30));
      const TRAFFIC = land.div(state.resourcePrice["TRAFFIC"].unitPrice);
      return {
        IPFS_STORAGE: {
          size: IPFS_STORAGE,
          transformSize: getFileSize(IPFS_STORAGE),
        },
        TRAFFIC: {
          size: TRAFFIC,
          transformSize: getFileSize(TRAFFIC),
        },
      };
    },
  },
  mutations: {
    SET_LAND(state, land) {
      state.land = land;
    },
    SET_USAGE(state, usage) {
      state.usage = usage;
    },
    SET_UNIT_PRICE(state, price) {
      state.resourcePrice = price;
    },
  },
  actions: {
    async getPrice({ commit }) {
      try {
        const { data } = await fetchPrice();
        let resourcePrice = {};
        data.items.forEach((it) => {
          resourcePrice[it.resourceType] = {
            data: it.data,
            unitPrice: BigNumber.from(it.data),
          };
        });
        commit("SET_UNIT_PRICE", resourcePrice);
      } catch (error) {
        window.$alert(error.message);
      }
    },
    async getLand({ commit }) {
      try {
        const { data } = await fetchLand();
        commit("SET_LAND", data.land);
      } catch (error) {
        window.$alert(error.message);
      }
    },
    async getUsage({ commit }) {
      try {
        const { data } = await fetchUsage();
        const { combo, realTimeItems, totalIpfsStorage } = data;
        const curResourceItems = combo.resourceItems
          .filter((it) => it.resourceType !== "COMPUTE_UNIT")
          .map((it, i) => {
            let total = it.size * 1;
            let used = Number(combo.consumeItems[i].size) + Number(realTimeItems[i].size);
            if (it.resourceType == "IPFS_STORAGE") {
              used = Number(combo.consumeItems[i].size) + Number(totalIpfsStorage);
            }
            return {
              type: it.resourceType,
              total,
              used,
              percent: used / total,
            };
          });
        commit("SET_USAGE", curResourceItems);
      } catch (error) {
        window.$alert(error.message);
      }
    },
  },
};

export default resourceStore;
