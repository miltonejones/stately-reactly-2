import React from "react";
import {
  Button,
  Card,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Flex from "../../../styled/Flex";
import Nowrap from "../../../styled/Nowrap";
import Spacer from "../../../styled/Spacer";
import { TinyButton } from "../../../styled/TinyButton";
import { Close, Code, Save } from "@mui/icons-material";
import EditBlock from "../../../styled/EditBlock";
import { PanelHeader } from "./ConnectionDrawer";
import { red } from "@mui/material/colors";
import Warning from "../../../styled/Warning";
import CodePane from "./CodePane";

function ClientScriptNode({ machine, submachine, node, scriptID, handleSave }) {
  return (
    <Flex
      sx={{
        p: 0.5,
        borderLeft: (theme) =>
          `solid 8px ${
            node.ID === scriptID
              ? theme.palette.warning.dark
              : theme.palette.common.white
          }`,
        backgroundColor: (theme) =>
          node.ID === scriptID ? "#FFFFCC" : theme.palette.common.white,
      }}
    >
      {" "}
      <TinyButton icon={Code} />
      <Nowrap
        variant="body2"
        hover
        muted={node.ID !== scriptID && !!scriptID}
        bold={node.ID === scriptID}
        onClick={() => {
          submachine.send({
            type: "set script",
            ID: node.ID,
          });
        }}
        key={node.name}
      >
        {node.name}
      </Nowrap>
      <Spacer />
      <TinyButton
        hidden={node.ID !== scriptID}
        icon={Close}
        onClick={() => submachine.send("close script")}
      />
      <TinyButton
        hidden={node.ID !== scriptID}
        icon={Save}
        onClick={handleSave}
      />
    </Flex>
  );
}

export default function ClientScriptrawer(props) {
  const ref = React.useRef(null);
  const [innerText, setInnerText] = React.useState("");
  const { submachine } = props;

  const handleSave = () => {
    submachine.send({
      type: "commit changes",
      code: innerText,
    });
  };

  const setScript = (ID) => {
    submachine.send({
      type: "set script",
      ID,
    });
  };

  if (!submachine) return <i />;

  const { scriptID, scope } = submachine.state.context;
  const { page = [], application = [] } = submachine.scriptProps;
  const combined = [...page, ...application];

  const nodes = {
    page,
    application,
  };

  const openReferer = (ID) => {
    props.machine.send({
      type: "quit",
    });
  };

  const isValid = (ref) => !!nodes[scope].some((item) => item.ID === ref.ID);

  const scriptProp = combined.find((f) => f.ID === scriptID);
  const referers = props.machine.appEvents.filter(
    (f) => f.action.target === scriptID
  );

  const references = !scriptProp
    ? []
    : props.machine.applicationScripts.filter(
        (f) => f.code?.indexOf(scriptProp.name) > 0
      );

  const height = submachine.expanded ? "80vh" : "40vh";

  return (
    <>
      <Grid
        container
        spacing={1}
        sx={{ m: 1, width: (theme) => `calc(100% - ${theme.spacing(2)})` }}
      >
        <Grid item xs={3}>
          <Stack spacing={1} sx={{ p: 1, height, overflow: "auto" }}>
            <PanelHeader
              onAdd={
                submachine.state.can("add")
                  ? () => submachine.send("add")
                  : null
              }
              onClose={
                !submachine.state.can("cancel")
                  ? null
                  : () => submachine.send("cancel")
              }
            >
              <b> {scope} Scripts</b>
            </PanelHeader>

            {!nodes[scope].length && (
              <Warning>No scripts in {scope} scope.</Warning>
            )}

            <Stack>
              {nodes[scope].map((key) => (
                <ClientScriptNode
                  handleSave={handleSave}
                  node={key}
                  key={key.ID}
                  submachine={submachine}
                  scriptID={scriptID}
                />
              ))}
            </Stack>
          </Stack>
        </Grid>

        {!!scriptProp && !submachine.expanded && (
          <Grid item xs={3}>
            <Card sx={{ height, overflow: "auto", p: 1 }}>
              <EditBlock
                title="Script Name"
                description="Name of the script as it is refered to by other scripts"
              >
                <TextField
                  size="small"
                  fullWidth
                  label="name"
                  value={scriptProp.name}
                />
              </EditBlock>

              <Divider
                sx={{ width: "100%", m: (theme) => theme.spacing(2, 0) }}
              />

              <Stack spacing={2}>
                {!!referers.length && (
                  <Stack spacing={1}>
                    <Nowrap bold variant="body2">
                      Component references
                    </Nowrap>
                    {referers.map((ref) => (
                      <Flex key={ref.ID}>
                        <TinyButton icon="Launch" />
                        <Nowrap
                          hover={!!ref.componentID}
                          muted={!ref.componentID}
                          variant="body2"
                          onClick={() =>
                            !!ref.componentID &&
                            submachine.send({
                              type: "close",
                              ID: ref.componentID,
                            })
                          }
                        >
                          {ref.page}.{ref.owner}.{ref.event}
                        </Nowrap>
                      </Flex>
                    ))}
                  </Stack>
                )}

                {!!references.length && (
                  <Stack spacing={1}>
                    <Nowrap bold variant="body2">
                      Script references
                    </Nowrap>
                    {references.map((ref) => (
                      <Flex key={ref.ID}>
                        <TinyButton icon="Code" />
                        <Nowrap
                          muted={!isValid(ref)}
                          hover={!!isValid(ref)}
                          onClick={() => !!isValid(ref) && setScript(ref.ID)}
                          variant="body2"
                        >
                          {ref.page}.{ref.name}
                        </Nowrap>
                      </Flex>
                    ))}
                  </Stack>
                )}
              </Stack>
            </Card>
          </Grid>
        )}
        {/*  contentEditable */}
        <Grid item xs={submachine.expanded ? 9 : 6}>
          {submachine.state.can("close script") && (
            <Card sx={{ height, overflow: "auto", m: 1 }}>
              <CodePane setInnerText={setInnerText}>{scriptProp.code}</CodePane>
            </Card>
          )}
          {submachine.state.can("ok") && (
            <Stack>
              <Warning>There was an error saving the script</Warning>
              <Flex sx={{ p: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => submachine.send("ok")}
                >
                  ok
                </Button>
              </Flex>
              <Typography variant="caption">
                <b>Error</b>
              </Typography>
              <Typography variant="body2"> {submachine.error}</Typography>
              <pre>{scriptProp.code}</pre>
              <Typography variant="caption">
                <b>Stack</b>
              </Typography>
              <Typography variant="caption"> {submachine.stack}</Typography>
            </Stack>
          )}
        </Grid>
      </Grid>
    </>
  );
}
