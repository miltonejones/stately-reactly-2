import React from "react";
import { Box, TextField, Typography } from "@mui/material";
import * as Icons from "@mui/icons-material";
import Flex from "./Flex";
import { TinyButton } from "./TinyButton";
import Nowrap from "./Nowrap";
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
