import React from "react";
import * as Icons from "@mui/icons-material";
import SearchInput from "./SearchInput";

const IconSelect = ({ onChange, value }) => {
  const [filter, setFilter] = React.useState("");
  const iconList = !filter
    ? []
    : Object.keys(Icons).filter(
        (key) => key.toLowerCase().indexOf(filter.toLowerCase()) > -1
      );

  const first = iconList.slice(0, 40);
  return (
    <SearchInput
      sx={{ minWidth: 300 }}
      icons
      icon={value}
      options={Object.keys(Icons)}
      label="Choose icon"
      size="small"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default IconSelect;
