import React from "react";
import {
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
import { Link, LinkOff, MoreHoriz, MoreVert } from "@mui/icons-material";
import SearchInput from "../../../styled/SearchInput";
import IconSelect from "../../../styled/IconSelect";
import ChipMenu from "../../../styled/ChipMenu";

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
  keyName = "SettingName",
  valueName = "SettingValue",
  typeKey = "settings",
  hidden,
}) => {
  // const [filter, setFilter] = React.useState("");
  const { boundProps = [] } = component;
  const boundProp = boundProps.find((p) => p.attribute === setting.title);
  const settings = component[typeKey];
  if (!settings) {
    return <>No settings for type "{JSON.stringify(typeKey)}"</>;
  }
  const isSelect = setting.type.indexOf(",") > 0;
  const isFunc = setting.type.indexOf("<") > 0;
  const options = setting.type.split(",");
  const option = settings.find((s) => s[keyName] === setting.title) || {};

  if (hidden) {
    return <i />;
  }

  // const foundState = stateList
  //   .filter((f) => f.toLowerCase().indexOf(filter.toLowerCase()) > -1)
  //   .slice(0, 10);

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
    return (
      <InputBlock {...inputProps}>
        <SearchInput
          options={stateList.concat(repeaterBindings)}
          label={`Binding for "${setting.title}"`}
          value={boundProp.boundTo}
          onChange={(e) => onBind(setting.title, e.target.value)}
        />
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
        />
      </Stack>
    </>
  );
};

function ChipMaybe({ options: untrimmed, ...props }) {
  const options = untrimmed.map((f) => f.trim());
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
  return (
    <TextField {...props}>
      {options.map((option) => (
        <MenuItem key={option} value={option.trim()}>
          {option.trim()}
        </MenuItem>
      ))}
    </TextField>
  );
}
