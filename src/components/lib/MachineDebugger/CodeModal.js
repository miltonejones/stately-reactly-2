import React from "react";
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Collapse,
  Dialog,
  Divider,
  LinearProgress,
  Link,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import Flex from "../../../styled/Flex";
import { ArrowBack, Code, CopyAll, CopyAllRounded } from "@mui/icons-material";
import StateBar from "../../../styled/StateBar";
import TabBody from "../../../styled/TabBody";
import TabMenu from "../../../styled/TabMenu";
import Nowrap from "../../../styled/Nowrap";
import Columns from "../../../styled/Columns";
import { MachineButton, TinyButton } from "../../../styled/TinyButton";
import Spacer from "../../../styled/Spacer";
import CodePane from "../ConfigurationDrawer/CodePane";

export default function CodeModal({ name, coder }) {
  const can = (str) => coder.state.can(str);
  const checkCode = (name, check, code) => {
    coder.send({
      type: !!check ? "check" : "view",
      name,
      code: code || coder.machineActions[name].assignment.toString(),
    });
  };

  const OUTER_WIDTH = ["view", "nag", "yes"].some(can) ? 640 : 960;
  const INNER_WIDTH = OUTER_WIDTH - 16;
  const paused = JSON.stringify(coder.state.value).includes("pause");

  return (
    <Dialog
      maxWidth="xl"
      open={can("close")}
      onClose={() => coder.send("close")}
    >
      <Box
        sx={{
          width: OUTER_WIDTH,
          height: 600,
          overflow: "auto",
          p: 2,
          transition: "width 0.4s linear",
        }}
      >
        <Flex spacing={2}>
          {!can("check") && !coder.curatedCode && (
            <CircularProgress size={18} />
          )}
          <StateBar state={coder.state} />
        </Flex>

        {can("retry") && (
          <Flex spacing={1} sx={{ mt: 1 }}>
            <Typography variant="caption">An error occured</Typography>
            <Button onClick={() => coder.send("cancel")}>cancel</Button>
            <Button variant="contained" onClick={() => coder.send("retry")}>
              retry
            </Button>
          </Flex>
        )}

        {can("nag") && (
          <Card elevation={4} sx={{ m: 2 }}>
            <Stack spacing={1} sx={{ p: 2 }}>
              <Flex>
                <Typography variant="caption">
                  <b>Wait a minute!</b>
                </Typography>
                <Spacer />
                <MachineButton message="yes" icon="Close" machine={coder} />
              </Flex>
              <Typography variant="body2">{coder.confirmText}</Typography>

              <Typography
                sx={{
                  transition: "opacity 0.2s linear",
                  opacity: can("yes") ? 1 : 0,
                }}
                color="error"
                variant="caption"
              >
                <b> You will lose all generated code if you continue!</b>
              </Typography>

              <Flex spacing={1} sx={{ mt: 1 }}>
                <Spacer />
                <Button size="small" onClick={() => coder.send("no")}>
                  cancel
                </Button>
                <Button
                  size="small"
                  disabled={!can("yes")}
                  color="error"
                  variant="contained"
                  onClick={() => coder.send("yes")}
                >
                  leave anyway
                </Button>
              </Flex>
            </Stack>
          </Card>
        )}

        <Collapse in={!!coder.progress && !can("copy all")}>
          <Stack spacing={1} sx={{ mt: 1 }}>
            <Flex spacing={1}>
              <Nowrap variant="caption">{coder.message}</Nowrap>
              <Chip
                disabled={!can("skip")}
                size="small"
                label="Skip"
                onClick={() => coder.send("skip")}
                color="primary"
              />
            </Flex>
            <LinearProgress variant="determinate" value={coder.progress} />
          </Stack>
        </Collapse>

        <Stack direction="row">
          <TabBody in={can("view") && !coder.curatedCode}>
            <Box
              sx={{ height: 540, overflow: "auto", width: INNER_WIDTH, p: 2 }}
            >
              <Flex spacing={1}>
                <Nowrap variant="body2">
                  Actions in the <b>{name}</b> state machine
                </Nowrap>
                <Chip
                  size="small"
                  color="primary"
                  variant={!!coder.selectedItems.length ? "outlined" : "filled"}
                  label={
                    !!coder.selectedItems.length ? "Unselect All" : "Select All"
                  }
                  onClick={() => coder.send("select all")}
                />
                <Chip
                  onClick={() => coder.send("batch")}
                  disabled={!coder.selectedItems.length}
                  size="small"
                  color="primary"
                  label="Rewrite selected items"
                  icon={<Code />}
                />
              </Flex>
              <Divider sx={{ m: (theme) => theme.spacing(1, 0) }} />

              <Columns columns="300px 120px 80px 1fr">
                <Nowrap bold variant="caption">
                  Name
                </Nowrap>
                <Nowrap bold variant="caption">
                  Size
                </Nowrap>
                <Nowrap bold variant="caption">
                  chatGPT
                </Nowrap>
                <Nowrap bold variant="caption">
                  Select
                </Nowrap>
              </Columns>
              {Object.keys(coder.machineActions).map((action) => (
                <Columns columns="300px 120px 80px 1fr" key={action}>
                  <Flex spacing={1}>
                    <TinyButton icon="Code" />
                    <Nowrap
                      muted={
                        typeof coder.machineActions[action].assignment ===
                        "object"
                      }
                      onClick={() =>
                        typeof coder.machineActions[action].assignment !==
                          "object" && checkCode(action)
                      }
                      variant="body2"
                      hover
                    >
                      {action}
                    </Nowrap>
                  </Flex>
                  <Nowrap variant="body2">
                    {coder.machineActions[action].assignment.toString().length}b
                  </Nowrap>
                  <TinyButton
                    disabled={
                      typeof coder.machineActions[action].assignment ===
                      "object"
                    }
                    icon="Launch"
                    onClick={() => checkCode(action, true)}
                  />
                  <Switch
                    disabled={
                      typeof coder.machineActions[action].assignment ===
                      "object"
                    }
                    size="small"
                    checked={coder.selectedItems.includes(action)}
                    onChange={() =>
                      coder.send({
                        type: "select",
                        name: action,
                      })
                    }
                  />
                </Columns>
              ))}
            </Box>
          </TabBody>

          <TabBody
            fullWidth
            in={can("back") || !!coder.curatedCode}
            sx={{ width: INNER_WIDTH }}
          >
            {!!can("back") && (
              <Flex spacing={1} sx={{ p: 1 }}>
                <Button
                  startIcon={<ArrowBack />}
                  onClick={() => coder.send("back")}
                  disabled={!can("back")}
                >
                  back
                </Button>
                <Spacer />
                {coder.tab === 0 && can("copy") && (
                  <TinyButton
                    icon="CopyAll"
                    onClick={() => coder.send("copy")}
                  />
                )}
                {can("copy all") && (
                  <Chip
                    size="small"
                    color="primary"
                    icon={<CopyAll />}
                    label="Copy All"
                    onClick={() => coder.send("copy all")}
                  />
                )}
                {!!can("check") && (
                  <TinyButton
                    icon="Launch"
                    variant="contained"
                    onClick={() =>
                      checkCode(coder.selectedName, true, coder.selectedCode)
                    }
                  />
                )}
              </Flex>
            )}
            <Box sx={{ width: INNER_WIDTH }}>
              {can("retab") && (
                <TabMenu
                  onClick={(tab) =>
                    coder.send({
                      type: "retab",
                      tab,
                    })
                  }
                  tabs={[{ label: "updated" }, { label: "existing" }]}
                  value={coder.tab}
                />
              )}
              <Stack direction="row">
                <TabBody
                  sx={{ width: INNER_WIDTH }}
                  in={
                    coder.tab === 0 &&
                    ["retab", "stream"].some((f) => can(f)) &&
                    !can("copy all")
                  }
                >
                  <Box
                    sx={{
                      height: 540,
                      overflow: "auto",
                    }}
                  >
                    <CodePane
                      onClick={() => coder.send("copy")}
                      className={can("stream") ? "code busy" : "code"}
                    >
                      {coder.curatedCode}
                    </CodePane>
                  </Box>
                </TabBody>

                {!!coder.curatedItems && (
                  <TabBody sx={{ width: INNER_WIDTH }} in={can("copy all")}>
                    <Stack sx={{ p: 2 }}>
                      <Flex>
                        <TinyButton icon="CheckCircle" color="success" />{" "}
                        <Nowrap variant="body2">
                          <b>Success!</b>
                        </Nowrap>
                      </Flex>
                      <Nowrap variant="body2">
                        {coder.curatedItems.length} items were successfully
                        rewritten. Click{" "}
                        <Link onClick={() => coder.send("copy all")}>
                          copy all
                        </Link>{" "}
                        to copy the code to your clipboard.
                      </Nowrap>
                    </Stack>
                    {coder.curatedItems.map((item) => (
                      <Stack sx={{ m: 2 }} spacing={1} key={item.name}>
                        <Nowrap variant="caption">
                          New code for <b>{item.name}</b>:
                        </Nowrap>
                        <CodePane>{item.code}</CodePane>
                      </Stack>
                    ))}
                  </TabBody>
                )}

                <TabBody in={paused}>
                  <Nowrap variant="caption">One moment...</Nowrap>
                </TabBody>

                <TabBody
                  sx={{ width: INNER_WIDTH }}
                  in={
                    !paused &&
                    (coder.tab === 1 ||
                      !["retab", "stream", "copy all", "yes", "nag"].some(can))
                  }
                >
                  <CodePane
                    className="code eval"
                    onClick={() =>
                      checkCode(coder.selectedName, true, coder.selectedCode)
                    }
                    sx={{
                      height: 440,
                    }}
                  >
                    {coder.selectedCode}
                  </CodePane>
                </TabBody>
              </Stack>
            </Box>
          </TabBody>
        </Stack>
      </Box>
    </Dialog>
  );
}
