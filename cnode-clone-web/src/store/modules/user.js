import user from "@/api/user";

export default {
  namespaced: true,

  state: {
    max: 10,
    current: -1,
    users: [],
    user_data: []
  },

  mutations: {
    SET_USER_PROFILE(state, username, profile) {
      setData(state, username, "profile", profile);
    },
    SET_USER_TOPICS(state, username, topics) {
      setData(state, username, "topics", topics);
    },
    SET_USER_COLLECTS(state, username, collects) {
      setData(state, username, "collects", collects);
    },
    SET_USER_PARTICIPATES(state, username, participates) {
      setData(state, username, "participates", participates);
    }
  },

  actions: {
    async getUserProfile({ commit, state }, username) {
      let profile = getData(state, username, "profile");
      if (profile) {
        return profile;
      }
      profile = await user.profile(username);
      if (profile) {
        commit("SET_USER_PROFILE", username, profile);
      }
      return profile;
    },

    async getUsersTopics({ commit, state }, username) {
      let topics = getData(state, username, "topics");
      if (topics) {
        return topics;
      }
      topics = await user.topics(username, 1, 5);
      if (topics) {
        commit("SET_USER_TOPICS", username, topics);
      }
      return topics;
    },

    async getUsersCollects({ commit, state }, username) {
      let collects = getData(state, username, "collects");
      if (collects) {
        return collects;
      }
      collects = await user.collects(username, 1, 5);
      if (collects) {
        commit("SET_USER_COLLECTS", username, collects);
      }
      return collects;
    },

    async getUsersParticipates({ commit, state }, username) {
      let participates = getData(state, username, "participates");
      if (participates) {
        return participates;
      }
      participates = await user.participates(username, 1, 5);
      if (participates) {
        commit("SET_USER_PARTICIPATES", username, participates);
      }
      return participates;
    }
  }
};

function setData(state, username, key, data) {
  const { users, user_data, current, max } = state;
  let index = users.indexOf(username);
  if (index !== -1) {
    user_data[index][key] = data;
  } else {
    index = current + 1 / max;
    users[index] = username;
    user_data[index] = {
      [key]: data
    };
    state.current = index;
  }
}

function getData(state, username, key) {
  const { users, user_data } = state;
  const index = users.indexOf(username);
  if (index === -1) return;
  return user_data[index][key];
}
