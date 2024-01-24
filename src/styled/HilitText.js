const HilitText = ({ value, values = [], children }) => {
  if (!children) return <i />;
  if (!values.length && !value) return children;
  const content = children.toString();
  const param = values.find(
    (str) => content?.toLowerCase().indexOf(str.toLowerCase()) > -1
  );
  const str = param || value;

  const parts = content?.split(new RegExp(str, "ig"));
  if (!parts?.length) {
    return <i />;
  }

  const index = content.toLowerCase().indexOf(str);
  const original = content.substr(index, index + str.length);

  return (
    <>
      {parts.reduce((out, res, i) => {
        if (!(i < parts.length - 1)) return out.concat(res);
        return out.concat(res, <b style={{ color: "red" }}>{original}</b>);
      }, [])}
    </>
  );
};
export default HilitText;
