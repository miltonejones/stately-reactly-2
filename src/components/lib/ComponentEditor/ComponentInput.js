import React from "react";
import {
  Box,
  Chip,
  Dialog,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import Flex from "../../../styled/Flex";
import Spacer from "../../../styled/Spacer";
import { TinyButton } from "../../../styled/TinyButton";
import { Add, Link, LinkOff, MoreHoriz, MoreVert } from "@mui/icons-material";
import SearchInput from "../../../styled/SearchInput";
import IconSelect from "../../../styled/IconSelect";
import ChipMenu from "../../../styled/ChipMenu";
import { useMenu } from "../../../machines/menuMachine";
import Columns from "../../../styled/Columns";
import Nowrap from "../../../styled/Nowrap";
import ParamSelect from "./ParamSelect";
import ListBinder from "./ListBinder";

const InputBlock = ({
  alias,
  title,
  description,
  onConfigure,
  children,
  onBind,
  onUnbind,
  boundProp,
  settingIsBound,
}) => {
  const label = alias || title;
  return (
    <Stack>
      <Flex>
        <Typography sx={{ textTransform: "capitalize" }} variant="caption">
          <b> {label.replace(/-/g, " ")}</b>
        </Typography>
        <Spacer />
        {!!boundProp && (
          <TinyButton
            onClick={() => onUnbind(title)}
            color="error"
            sx={{ border: (theme) => `solid 1px ${theme.palette.error.main}` }}
            icon={LinkOff}
          />
        )}
        {!!onBind && !settingIsBound && !boundProp && (
          <TinyButton onClick={() => onBind(title)} icon={Link} />
        )}
        {!!onConfigure && <TinyButton icon={MoreVert} onClick={onConfigure} />}
      </Flex>
      <Typography variant="caption">{description}</Typography>
      {children}
    </Stack>
  );
};

export const ComponentInput = ({
  component,
  setting,
  onChange,
  onConfigure,
  onBind,
  onUnbind,
  onBindingConfigure,
  repeaterBindings = [],
  stateList = [],
  stateReference = {},
  keyName = "SettingName",
  valueName = "SettingValue",
  typeKey = "settings",
  hidden,
  machine,
}) => {
  // const [filter, setFilter] = React.useState("");
  const { boundProps = [] } = component;
  const boundProp = boundProps.find((p) => p.attribute === setting.title);
  const settings = component[typeKey];
  // if (!settings) {
  //   return <>No settings for type "{JSON.stringify(typeKey)}"</>;
  // }
  const isSelect = setting.type.indexOf(",") > 0;
  const isFunc = setting.type.indexOf("<") > 0;
  const options = setting.type.split(",");
  const option = !settings
    ? {
        [keyName]: setting.title,
      }
    : settings.find((s) => s[keyName] === setting.title) || {};

  if (hidden) {
    return <i />;
  }

  const settingIsBound = ["table binding", "repeater binding"].some(
    (f) => setting.type === f
  );
  const inputProps = {
    ...setting,
    boundProp,
    onBind,
    onUnbind,
    onConfigure,
    stateList,
    settingIsBound,
  };

  if (boundProp) {
    const bindingRef = stateReference[boundProp.boundTo];
    return (
      <InputBlock {...inputProps}>
        <SearchInput
          options={stateList.concat(repeaterBindings)}
          label={`Binding for "${setting.title}"`}
          value={boundProp.boundTo}
          onChange={(e) => onBind(setting.title, e.target.value)}
        />
        {bindingRef?.Type === "boolean" && (
          <Flex>
            <Switch
              onChange={(e) =>
                onBind(setting.title, boundProp.boundTo, !boundProp.oppose)
              }
              checked={boundProp.oppose}
            />{" "}
            <Typography variant="caption">Use opposite value</Typography>
          </Flex>
        )}
      </InputBlock>
    );
  }

  if (setting.type === "icon") {
    return (
      <InputBlock {...inputProps}>
        <IconSelect
          label={setting.title}
          value={option[valueName] || setting.default}
          onChange={(e) => onChange(e)}
        />
      </InputBlock>
    );
  }

  if (setting.type === "bool") {
    return (
      <InputBlock {...inputProps} description="">
        <Flex spacing={1}>
          <Switch
            checked={!!option[valueName]}
            onChange={(e) => onChange(e.target.checked)}
          />
          <Typography variant="caption">{setting.description}</Typography>
        </Flex>
      </InputBlock>
    );
  }

  const endAdornment = settingIsBound ? (
    <InputAdornment position="end">
      <IconButton onClick={() => onBindingConfigure(option[valueName])}>
        <MoreHoriz />
      </IconButton>
    </InputAdornment>
  ) : null;

  return (
    <>
      <Stack>
        <Flex>
          <Typography sx={{ textTransform: "capitalize" }} variant="caption">
            <b> {setting.title.replace(/-/g, " ")}</b>
          </Typography>
          <Spacer />
          {!!onBind && !settingIsBound && (
            <TinyButton onClick={() => onBind(setting.title)} icon={Link} />
          )}
          {!!onConfigure && (
            <TinyButton icon={MoreVert} onClick={onConfigure} />
          )}
        </Flex>
        <Typography variant="caption">{setting.description}</Typography>

        <ChipMaybe
          autoComplete="off"
          disabled={isFunc || settingIsBound}
          select={isSelect}
          size="small"
          label={setting.title}
          onChange={(e) => onChange(e.target.value)}
          value={option[valueName] || setting.default}
          InputProps={{ endAdornment }}
          options={options}
          setting={setting}
          machine={machine}
        />
      </Stack>
    </>
  );
};

function ChipMaybe({ options: untrimmed, setting, machine, ...props }) {
  const options = untrimmed.map((f) => f.trim());
  const menu = useMenu(
    (value) =>
      !!value &&
      props.onChange({
        target: {
          value: JSON.stringify(value),
        },
      })
  );
  if (
    options?.length < 6 &&
    options?.length > 1 &&
    !["number", "string"].some((f) => options.indexOf(f) > -1)
  ) {
    return (
      <Flex>
        <ChipMenu
          options={options}
          value={options.indexOf(props.value)}
          onChange={(index) =>
            props.onChange({
              target: {
                value: options[index].trim(),
              },
            })
          }
        />
      </Flex>
    );
  }

  const endAdornment =
    setting.type === "typolist" ? (
      <InputAdornment position="end">
        <IconButton
          onClick={(e) => menu.handleClick(e, JSON.parse(props.value || "[]"))}
        >
          <MoreHoriz />
        </IconButton>
      </InputAdornment>
    ) : null;

  return (
    <>
      <TextField
        {...props}
        InputProps={{
          endAdornment: props.InputProps.endAdornment || endAdornment,
        }}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option.trim()}>
            {option.trim()}
          </MenuItem>
        ))}
      </TextField>
      <ListBinder machine={machine} setting={setting} menu={menu} {...props} />
    </>
  );
}
