import { fetchPoint } from "@/api/task";

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
      try {
        const { data } = await fetchPoint();
        commit("SET_POINT", data);
      } catch (error) {
        console.log(error);
      }
    },
  },
};

export default taskStore;
