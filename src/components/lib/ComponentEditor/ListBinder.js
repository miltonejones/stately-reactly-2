import React from "react";
import {
  Box,
  Chip,
  Dialog,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import Flex from "../../../styled/Flex";
import Spacer from "../../../styled/Spacer";
import { TinyButton } from "../../../styled/TinyButton";
import { Add } from "@mui/icons-material";
import SearchInput from "../../../styled/SearchInput";
import ChipMenu from "../../../styled/ChipMenu";
import Columns from "../../../styled/Columns";
import Nowrap from "../../../styled/Nowrap";
import ParamSelect from "./ParamSelect";

export default function ListBinder({
  setting,
  menu,
  value,
  machine,
  ...props
}) {
  const handleLabelChange = (index, name, value) => {
    menu.send({
      type: "change",
      name: "value",
      value: menu.value.map((item, i) => {
        return index === i ? { ...item, [name]: value } : item;
      }),
    });
  };
  const textTypes =
    "body1, body2, button, caption, h1, h2, h3, h4, h5, h6, inherit, overline, subtitle1, subtitle2, string"
      .split(",")
      .map((f) => f.trim());
  return (
    <Dialog {...menu.menuProps} maxWidth="xl">
      {!!menu.value && (
        <Box sx={{ p: 2, width: 700 }}>
          <Flex spacing={1} sx={{ mb: 2 }}>
            <Typography variant="body2">
              {setting.alias || setting.title}
            </Typography>
            <Chip
              icon={<Add />}
              size="small"
              color="primary"
              label="Add"
              onClick={() => {
                menu.send({
                  type: "change",
                  name: "value",
                  value: menu.value.concat({
                    label: "List item " + menu.value.length,
                    variant: "body2",
                    type: "Link",
                  }),
                });
              }}
            />
            <Spacer />
            <TinyButton icon="Close" onClick={menu.handleClose(menu.value)} />
          </Flex>

          <Stack spacing={1}>
            <Columns columns="40px 80px 1fr 1fr 1fr">
              <Nowrap variant="caption">Bind</Nowrap>
              <Nowrap variant="caption">Type</Nowrap>
              <Nowrap variant="caption">Label</Nowrap>
              <Nowrap variant="caption">Variant</Nowrap>
              <Nowrap variant="caption">Value</Nowrap>
            </Columns>
            {menu.value.map((prop, i) => (
              <Columns key={i} columns="40px 80px 1fr 1fr 1fr">
                <Switch
                  onChange={(e) =>
                    handleLabelChange(i, "binding", e.target.checked)
                  }
                  size="small"
                  checked={!!prop.binding}
                />
                <Nowrap>
                  <ChipMenu
                    onChange={(e) =>
                      handleLabelChange(i, "type", ["Link", "Text"][e])
                    }
                    options={["Link", "Text"]}
                    value={["Link", "Text"].indexOf(prop.type)}
                  />
                </Nowrap>
                <Nowrap>
                  {!prop.binding && (
                    <TextField
                      size="small"
                      value={prop.label}
                      onChange={(e) =>
                        handleLabelChange(i, "label", e.target.value)
                      }
                    />
                  )}

                  {!!prop.binding && (
                    <ParamSelect
                      label="binding"
                      name="binding"
                      onChange={(e) => {
                        handleLabelChange(i, "binding", e.target.value);
                      }}
                      value={prop.binding}
                      machine={machine}
                    />
                  )}
                </Nowrap>
                <Nowrap>
                  <SearchInput
                    options={textTypes}
                    value={prop.variant}
                    onChange={(e) =>
                      handleLabelChange(i, "variant", e.target.value)
                    }
                  />
                </Nowrap>
                <TextField
                  size="small"
                  value={prop.value}
                  onChange={(e) =>
                    handleLabelChange(i, "value", e.target.value)
                  }
                />
              </Columns>
            ))}
          </Stack>
          {/* <pre>{JSON.stringify(setting, 0, 2)}</pre>
          <pre>{JSON.stringify(value, 0, 2)}</pre> */}
          {/* <pre>{JSON.stringify(menu.value, 0, 2)}</pre> */}
        </Box>
      )}
    </Dialog>
  );
}
