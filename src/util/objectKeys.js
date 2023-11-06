const objectKeys = (array) => {
  // alert(JSON.stringify(array));
  const object = array.reduce((out, node) => {
    Object.keys(node).map((key) => {
      out[key] = key;
    });
    return out;
  }, {});
  return Object.keys(object);
};

export default objectKeys;
