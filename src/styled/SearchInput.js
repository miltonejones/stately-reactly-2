import React from "react";
import Flex from "./Flex";
import { InputAdornment, MenuItem, TextField } from "@mui/material";
import Nowrap from "./Nowrap";
import TextIcon from "./TextIcon";
import { TinyButton } from "./TinyButton";

const SearchInput = ({
  options: opts,
  optionIcons,
  field,
  id,
  icons,
  icon,
  exclusive,
  ...props
}) => {
  const [filter, setFilter] = React.useState("");
  const [show, setShow] = React.useState(false);

  const stringlist = !field ? opts : opts.map((f) => f[field]);
  const keylist = !field ? opts : opts.map((f) => f[id]);
  const object = !field
    ? {}
    : opts.reduce((out, item) => {
        out[item[id]] = item[field];
        return out;
      }, {});

  const options = stringlist.filter(
    (f) => f.toLowerCase().indexOf(filter.toLowerCase()) > -1
  );

  const first10 = options.slice(0, 10);
  const delta = options.length - first10.length;
  const missing =
    !show &&
    !!props.value &&
    first10.indexOf(props.value) < 0 &&
    keylist.slice(0, 10).indexOf(props.value) < 0;

  const startAdornment = !icon ? null : (
    <InputAdornment position="start">
      <TextIcon icon={icon} />
    </InputAdornment>
  );

  const adornment = {
    startAdornment,
  };

  return (
    <>
      <TextField
        select
        autoComplete="off"
        size="small"
        fullWidth
        {...props}
        InputProps={adornment}
      >
        {!!delta && (
          <Flex
            sx={{ p: 2 }}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
          >
            <TextField
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              autoFocus
              onKeyDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              size="small"
              fullWidth
              placeholder="Search!"
            />
          </Flex>
        )}
        {(show ? options : first10).map((item, k) => (
          <MenuItem key={item} value={!field ? item : keylist[k]}>
            <Flex>
              {!!optionIcons && (
                <TinyButton icon={optionIcons[k] || "CheckCircle"} />
              )}
              {!!icons && <TextIcon icon={item} />}
              {item}
            </Flex>
          </MenuItem>
        ))}

        {!!missing && !exclusive && (
          <MenuItem value={props.value}>
            {object[props.value] || props.value}
          </MenuItem>
        )}
        {!!delta && (
          <Nowrap bold onMouseDown={() => setShow(!show)} hover sx={{ pl: 2 }}>
            {delta} more items...
          </Nowrap>
        )}
      </TextField>
    </>
  );
};

export default SearchInput;
