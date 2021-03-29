export const state = () => ({
  queryLevel: null,
  user: null,
  classId: null
});

export const getters = {
  getQueryLevel(state) {
    return state.queryLevel;
  },
  getUser(state) {
    return state.user;
  },
  getClassId(state) {
    return state.classId;
  }
};

export const mutations = {
  setQueryLevel(state, level) {
    console.log("commit setQueryLevel");
    state.queryLevel = level;
  },
  setUser(state, user) {
    // user is email: String
    console.log("commit setUser", user);
    state.user = user;
  },
  setClassId(state, classId) {
    state.classId = classId;
  }
};

export const actions = {
  loadQueryLevel({ commit }, level) {
    commit("setQueryLevel", level);
  },
  loadUser({ commit }, user) {
    commit("setUser", user);
  },
  loadClassId({ commit }, classId) {
    commit("setClassId", classId);
  }
};
