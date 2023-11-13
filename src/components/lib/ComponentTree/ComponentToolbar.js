import {
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  Menu,
  MenuItem,
  Popover,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import Flex from "../../../styled/Flex";
import { Add, AppRegistration, Launch } from "@mui/icons-material";
import { TinyButton } from "../../../styled/TinyButton";
import ChipMenu from "../../../styled/ChipMenu";
import { useLibrarian } from "../../../machines/librarianMachine";
import StateBar from "../../../styled/StateBar";
import * as utils from "../../../util";
import * as styled from "../../../styled";
import { Spacer, Nowrap, SubmitField, EditBlock } from "../../../styled";
import { useMenu } from "../../../machines/menuMachine";
import { useCode } from "../../../machines/codeMachine";
import CodeModal from "../MachineDebugger/CodeModal";

function LibrarianModal({ geek }) {
  return (
    <Dialog open={geek.state.can("close")}>
      {!!geek.componentItems && (
        <Stack
          spacing={1}
          sx={{ width: 500, height: 500, overflow: "auto", p: 2 }}
        >
          <Flex>
            <StateBar state={geek.state} />
            <TinyButton icon="Close" onClick={() => geek.send("close")} />
          </Flex>
          {/* <pre>{JSON.stringify(geek.componentItems, 0, 2)}</pre> */}
          {geek.componentItems.map((item) => (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "32px 1fr 200px 1fr",
                alignItems: "center",
                gap: 2,
              }}
            >
              <TinyButton icon={item.Icon || "Error"} />
              <Flex>{item.ComponentName}</Flex>
              <Flex>
                <TextField
                  size="small"
                  value={item.Icon}
                  onChange={(e) => {
                    geek.send({
                      type: "change",
                      name: item.ComponentName,
                      key: "Icon",
                      value: e.target.value,
                    });
                  }}
                />
              </Flex>
              <Switch
                onChange={(e) => {
                  geek.send({
                    type: "change",
                    name: item.ComponentName,
                    key: "allowChildren",
                    value: e.target.checked,
                  });
                }}
                checked={!!item.allowChildren}
              />
            </Box>
          ))}
        </Stack>
      )}
    </Dialog>
  );
}

const recursivePath = (page, pages, outputPath = []) => {
  if (!page) return outputPath;
  outputPath.push(page.PagePath);
  const ancestor = pages.find((p) => p.ID === page.pageID);
  if (ancestor) {
    recursivePath(ancestor, pages, outputPath);
  }
  return outputPath;
};

function ParametersMenu({ page }) {
  const menu = useMenu((val) => !!val && window.alert(val.param));
  if (!page?.parameters) return <i />;

  const keys = Object.keys(page.parameters);

  const handleChange = (event) => {
    menu.send({
      type: "change",
      name: "value",
      value: {
        ...menu.value,
        param: event.target.value,
      },
    });
  };

  return (
    <>
      {" "}
      <b>/</b>{" "}
      {keys.map((key) => (
        <Nowrap
          bold
          hover
          key={key}
          color="success"
          variant="caption"
          onClick={(e) =>
            menu.handleClick(e, {
              param: page.parameters[key],
              key,
            })
          }
        >
          {" "}
          {page.parameters[key]}{" "}
        </Nowrap>
      ))}
      <Popover {...menu.menuProps}>
        <Stack spacing={1} sx={{ p: 2, width: 300 }}>
          <EditBlock
            title="Edit page parameter"
            description={`Edit parameters to open the ${page.PageName} page.`}
          >
            <SubmitField
              fullWidth
              size="small"
              autoFocus
              onChange={handleChange}
              onSubmit={window.alert}
              label={menu.value?.key}
              value={menu.value?.param}
            />
          </EditBlock>
          <Flex>
            <Button startIcon={<Launch />} size="small">
              launch
            </Button>
            <Spacer />
            <Button onClick={menu.handleClose()} size="small">
              Cancel
            </Button>
            <Button
              onClick={menu.handleClose(menu.value)}
              size="small"
              variant="contained"
            >
              Save
            </Button>
          </Flex>
        </Stack>
      </Popover>
    </>
  );
}

export default function ComponentToolbar({ machine, handleSave }) {
  const geek = useLibrarian();
  const coder = useCode();
  const { appData, page: currentPage } = machine;
  const menuProps = { machine, geek, coder };

  const pageList = recursivePath(currentPage, appData?.pages).reverse();
  const addressParts = [" ", "app", appData?.path, ...pageList].filter(Boolean);

  return (
    <>
      <Card sx={{ p: 1 }}>
        <Flex spacing={1}>
          <AppRegistration color="success" />
          <Typography variant="body2">
            <b>Reactly</b> |
          </Typography>
          {!!appData && (
            <Chip
              color="primary"
              variant="contained"
              size="small"
              label={appData.Name}
            />
          )}
          {!appData && (
            <Chip
              color="primary"
              variant="outlined"
              size="small"
              label="Choose application"
            />
          )}
          {!!currentPage && (
            <Typography variant="caption">
              <b>Page:</b> {currentPage.PageName}
            </Typography>
          )}
          <Spacer
            sx={{
              backgroundColor: (theme) => theme.palette.grey[300],
              borderRadius: 2.5,
              p: (theme) => theme.spacing(0.5, 1),
            }}
          >
            <Typography variant="caption">
              <b>URL</b>
            </Typography>
            <Nowrap
              hover
              onClick={() => {
                window.open(addressParts.join("/"));
              }}
              variant="caption"
            >
              {addressParts.join(" / ")}
            </Nowrap>
            <ParametersMenu page={currentPage} />
            {/* {JSON.stringify(pageList)} */}
          </Spacer>
          {/* <StateBar state={machine.state} /> */}
          {!!handleSave && (
            <>
              <ChipMenu
                value={!machine.preview ? 1 : 0}
                onChange={(val) =>
                  machine.send({
                    type: "set context",
                    name: "preview",
                    value: val === 0,
                  })
                }
                options={[
                  {
                    icon: <TinyButton icon="InsertPhoto" />,
                    label: "preview",
                  },
                  { icon: <TinyButton icon="Code" />, label: "JSON" },
                ]}
              />
              <Button
                size="small"
                variant="contained"
                disabled={!appData.dirty}
                onClick={handleSave}
              >
                save
              </Button>
            </>
          )}{" "}
          {!handleSave && (
            <Button
              disabled={!machine.state.can("new app")}
              size="small"
              onClick={() => machine.send("new app")}
              variant="contained"
              endIcon={<Add />}
            >
              create
            </Button>
          )}
          <AppMenu {...menuProps} />
        </Flex>
      </Card>
      <LibrarianModal geek={geek} />

      {!!coder.machineActions && <CodeModal name="Util" coder={coder} />}
    </>
  );
}

const AppMenu = ({ machine, geek, coder }) => {
  const menuItems = [
    {
      icon: "Settings",
      label: "Debug state machines",
      onClick: () =>
        machine.send({
          type: "set context",
          name: "debugging",
          value: !machine.debugging,
        }),
    },
    {
      icon: "Edit",
      label: "Edit component library",
      onClick: () => geek.send("open"),
    },
    {
      icon: "Code",
      label: "View utility functions",
      onClick: () =>
        coder.send({
          type: "load",
          actions: utils,
        }),
    },
    {
      icon: "Palette",
      label: "View styled components",
      onClick: () =>
        coder.send({
          type: "load",
          actions: styled,
        }),
    },
  ];

  const menu = useMenu((i) => {
    const action = menuItems[i].onClick;
    action();
  });
  return (
    <>
      <TinyButton icon="Settings" onClick={menu.handleClick} />
      <Menu {...menu.menuProps}>
        {menuItems.map((item, i) => (
          <MenuItem onClick={menu.handleClose(i)} key={item.label}>
            <Flex spacing={1}>
              <TinyButton icon={item.icon} /> {item.label}
            </Flex>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
