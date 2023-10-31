export default function stateCompare(state1, state2) {
  const comparison = state1.reduce((out, state) => {
    const sibling = state2.find((s) => s.Key === state.Key);
    if (sibling?.Value !== state.Value) {
      out.push({
        ...state,
        change: sibling.Value,
      });
    }
    return out;
  }, []);

  return comparison;
}
