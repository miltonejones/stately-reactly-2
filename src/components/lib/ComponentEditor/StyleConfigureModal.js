import React from "react";
import {
  Button,
  Dialog,
  IconButton,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import Flex from "../../../styled/Flex";
import { STYLEBIT } from "../../../constants";
import Spacer from "../../../styled/Spacer";
import { Settings } from "@mui/icons-material";
import IconSelect from "../../../styled/IconSelect";
import { TinyButton } from "../../../styled/TinyButton";
import TextIcon from "../../../styled/TextIcon";
import { TabList } from "../../../styled/TabList";
import { TabButton } from "../../../styled/TabButton";
import TabBody from "../../../styled/TabBody";
import EditBlock from "../../../styled/EditBlock";

export default function StyleConfigureModal(props) {
  const { component, machine } = props;
  const [tab, setTab] = React.useState(0);
  const { componentData } = machine.state.context;
  if (!componentData) return <i />;
  const bit = componentData?.Styles || 0;
  return (
    <>
      {" "}
      <Dialog open={machine.state.can("cancel style")}>
        <Stack spacing={1} sx={{ p: 2, width: 400 }}>
          <Stack>
            <Typography variant="subtitle2">Component settings</Typography>
            <Typography variant="caption">{component.ComponentType}</Typography>
          </Stack>

          <Flex sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList value={tab} variant="scrollable">
              <TabButton
                onClick={() => setTab(0)}
                label="Styles"
                iconPosition="end"
              />
              <TabButton
                onClick={() => setTab(1)}
                label="Settings"
                iconPosition="end"
              />
            </TabList>
          </Flex>

          <Stack direction="row">
            <TabBody in={tab === 0}>
              {Object.keys(STYLEBIT).map((key) => (
                <Flex key={key} spacing={1}>
                  <Switch
                    size="small"
                    onClick={() =>
                      machine.send({
                        type: "update",
                        value:
                          bit & STYLEBIT[key]
                            ? bit - STYLEBIT[key]
                            : Number(bit) + Number(STYLEBIT[key]),
                      })
                    }
                    checked={bit & STYLEBIT[key]}
                  />
                  <Typography sx={{ textTransform: "capitalize" }}>
                    {key.toLowerCase()}
                  </Typography>
                </Flex>
              ))}{" "}
            </TabBody>
            <TabBody in={tab === 1}>
              <Stack spacing={1}>
                {!!componentData && (
                  <EditBlock
                    title="Allow children"
                    description="Sets whether child components can be added inside this component"
                  >
                    <Flex>
                      <Switch
                        checked={componentData.allowChildren}
                        onChange={(e) => {
                          machine.send({
                            type: "update",
                            allow: !componentData.allowChildren
                              ? "true"
                              : "false",
                          });
                        }}
                      />
                      Component allows children
                    </Flex>
                  </EditBlock>
                )}

                <EditBlock
                  title="Supported events"
                  description="Sets which events this component supports"
                >
                  <TextField
                    size="small"
                    fullWidth
                    value={componentData.Events}
                    label="Supported Events"
                    onChange={(e) =>
                      machine.send({
                        type: "update",
                        actions: e.target.value,
                      })
                    }
                  />
                </EditBlock>

                <EditBlock
                  title="Icon"
                  description="Sets which icon is used for this component in the Reactly editor."
                >
                  <Flex baseline spacing={1}>
                    <IconSelect
                      value={componentData.Icon}
                      onChange={(icon) =>
                        machine.send({
                          type: "update",
                          icon,
                        })
                      }
                    />

                    {!!componentData?.Icon && (
                      <TextIcon icon={componentData.Icon} />
                    )}
                  </Flex>
                </EditBlock>
              </Stack>
            </TabBody>
          </Stack>

          <Flex spacing={1}>
            <Spacer />
            {machine.state.can("cancel style") && (
              <Button onClick={() => machine.send("cancel style")}>
                cancel
              </Button>
            )}
            <Button variant="contained" onClick={() => machine.send("save")}>
              save
            </Button>
          </Flex>
        </Stack>
      </Dialog>
    </>
  );
}
