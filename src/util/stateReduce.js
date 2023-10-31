const stateReduce = (state, prefix = "") => {
  if (!state) return {};
  return state.reduce((out, st) => {
    out[`${prefix}${st.Key}`] = st.Value;
    return out;
  }, {});
};

export default stateReduce;
