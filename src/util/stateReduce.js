const stateReduce = (state) => {
  if (!state) return {};
  return state.reduce((out, st) => {
    out[st.Key] = st.Value;
    return out;
  }, {});
};

export default stateReduce;
