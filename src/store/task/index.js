import { fetchPoint } from "@/api/task";
import { fetchBlastPoint } from "../../api/task";

const taskStore = {
  namespaced: true,
  state: () => {
    return {
      pointInfo: {},
    };
  },
  mutations: {
    SET_POINT(state, pointInfo) {
      state.pointInfo = pointInfo;
    },
  },
  actions: {
    async getPoint({ commit }) {
      const { data } = await fetchPoint();
      let blast;
      try {
        blast = await fetchBlastPoint();
        console.log({ blast });
      } catch (error) {
        console.log("blast", error);
      }
      commit("SET_POINT", {
        ...data,
        blast,
      });
    },
  },
};

export default taskStore;
