import {
  Box,
  Button,
  Card,
  Dialog,
  Divider,
  Stack,
  TextField,
} from "@mui/material";
import Flex from "../../../styled/Flex";
import Spacer from "../../../styled/Spacer";
import Nowrap from "../../../styled/Nowrap";
import EditBlock from "../../../styled/EditBlock";
import { TinyButton } from "../../../styled/TinyButton";
import OrderSlider from "../ComponentEditor/OrderSlider";
import StateBar from "../../../styled/StateBar";
import { Library } from "../../reactly";

export default function ComponentModal({ machine }) {
  if (!machine.createdComponent || !machine.Library) return <i />;
  const { page, appData } = machine;

  const sorted = machine.Library.sort((a, b) =>
    a.ComponentName > b.ComponentName ? 1 : -1
  );

  const modify = (name, value) => {
    machine.send({
      type: "modify",
      name,
      value,
    });
  };

  const handleChange = (e) => {
    modify(e.target.name, e.target.value);
  };

  const typeOf = (key) => {
    return machine.Library.find((s) => s.ComponentName === key);
  };

  const iconOf = (key) => {
    const type = typeOf(key);
    return type?.Icon;
  };
  const owner = page || appData;
  const siblings = owner.components.filter(
    (f) => f.componentID === machine.createdComponent.componentID
  );

  const ticks = siblings.concat(machine.createdComponent).map((s) => ({
    value: s.order,
    label: s.ComponentName,
    icon: iconOf(s.ComponentType) || "CheckBoxOutlineBlankRounded",
  }));

  const height = machine.state.can("back") ? 280 : 420;

  return (
    <Dialog open={machine.state.can("modify")}>
      <Stack
        spacing={1}
        sx={{ p: 2, width: 500, height, transition: "height 0.2s linear" }}
      >
        <Flex>
          <StateBar state={machine.state} />
          <TinyButton
            icon="Close"
            onClick={() => machine.send("cancel create")}
          />
        </Flex>

        {/* <Flex>
          <Nowrap variant="body2">
            {machine.createdComponent.ComponentName}
          </Nowrap>
          <Spacer />
        </Flex>
        <Nowrap variant="caption">
          {machine.createdComponent.ComponentType}
        </Nowrap> */}

        <Stack spacing={1}>
          {machine.state.can("back") && (
            <Stack spacing={2}>
              <EditBlock
                title="Component Name"
                description="Name of the component as it appears in Reactly"
              >
                <TextField
                  name="ComponentName"
                  onChange={handleChange}
                  size="small"
                  value={machine.createdComponent.ComponentName}
                />
              </EditBlock>
              {siblings.length > 1 && (
                <EditBlock
                  title="Component Order"
                  description="Sets where the component displays in relation to its sibling components."
                >
                  <OrderSlider
                    onChange={(e) => {
                      machine.send({
                        type: "modify",
                        name: "order",
                        value: e,
                      });
                    }}
                    ticks={ticks}
                    value={machine.createdComponent.order}
                  />
                </EditBlock>
              )}
            </Stack>
          )}

          {!machine.state.can("back") && (
            <Stack spacing={2}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr",
                  justifyContent: "center",
                  gap: 1,
                  p: 1,
                  height: 320,
                  overflow: "auto",
                  outline: "dotted 1px gray",
                }}
              >
                {sorted.map((component, i) => (
                  <Card
                    elevation={
                      machine.createdComponent.ComponentType !==
                      component.ComponentName
                        ? 1
                        : 0
                    }
                    key={component.ComponentName}
                    sx={{
                      p: 1,
                      height: 40,
                      cursor: "pointer",
                      outline: (theme) =>
                        machine.createdComponent.ComponentType ===
                        component.ComponentName
                          ? `solid 2px ${theme.palette.primary.main}`
                          : "",
                    }}
                    onClick={() =>
                      modify("ComponentType", component.ComponentName)
                    }
                  >
                    <Stack sx={{ textAlign: "center" }}>
                      <Flex sx={{ justifyContent: "center" }}>
                        <TinyButton
                          disabled={!Library[component.ComponentName]}
                          icon={
                            component.Icon ||
                            (!Library[component.ComponentName]
                              ? "Error"
                              : "CheckCircle")
                          }
                        />
                      </Flex>
                      <Nowrap
                        bold={
                          machine.createdComponent.ComponentType ===
                          component.ComponentName
                        }
                        muted={!Library[component.ComponentName]}
                        variant="caption"
                      >
                        {component.ComponentName}
                      </Nowrap>
                    </Stack>
                  </Card>
                ))}
              </Box>
            </Stack>
          )}

          <Divider />

          <Flex spacing={1}>
            <Button
              size="small"
              variant="contained"
              disabled={!machine.state.can("back")}
              onClick={() => machine.send("back")}
            >
              back
            </Button>
            <Button
              size="small"
              variant="contained"
              disabled={!machine.createdComponent.ComponentType}
              onClick={() => machine.send("more")}
            >
              create and add
            </Button>
            <Spacer />
            <Button size="small" onClick={() => machine.send("cancel create")}>
              cancel
            </Button>
            <Button
              size="small"
              disabled={!machine.createdComponent.ComponentType}
              variant="contained"
              onClick={() => machine.send("next")}
            >
              next
            </Button>
            {machine.state.can("auto create") && (
              <Button
                size="small"
                variant="contained"
                disabled={!machine.createdComponent.ComponentType}
                onClick={() => machine.send("auto create")}
              >
                create
              </Button>
            )}
          </Flex>
        </Stack>
      </Stack>
    </Dialog>
  );
}
