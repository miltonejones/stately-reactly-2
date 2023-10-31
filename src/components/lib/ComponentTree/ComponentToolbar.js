import {
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  IconButton,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import Flex from "../../../styled/Flex";
import { Add, AppRegistration, Settings } from "@mui/icons-material";
import statePath from "../../../util/statePath";
import { TinyButton } from "../../../styled/TinyButton";
import ChipMenu from "../../../styled/ChipMenu";
import { useLibrarian } from "../../../machines/librarianMachine";
import StateBar from "../../../styled/StateBar";

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

export default function ComponentToolbar({ machine, handleSave }) {
  const geek = useLibrarian();
  const { page: currentPage } = machine;
  return (
    <>
      <Card sx={{ p: 1 }}>
        <Flex spacing={1}>
          <AppRegistration color="success" />
          <Typography variant="body2">
            <b>Reactly</b> |
          </Typography>
          {!!machine.appData && (
            <Chip
              color="primary"
              variant="contained"
              size="small"
              label={machine.appData.Name}
            />
          )}
          {!machine.appData && (
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
          <Box
            sx={{
              flexGrow: 1,
              backgroundColor: (theme) => theme.palette.grey[300],
              borderRadius: 2,
              p: (theme) => theme.spacing(0.5, 1),
            }}
          >
            <Typography variant="caption">
              <b>State:</b> {statePath(machine.state.value)}
            </Typography>
          </Box>
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
                disabled={!machine.appData.dirty}
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
          <TinyButton
            icon="Settings"
            onClick={() =>
              machine.send({
                type: "set context",
                name: "debugging",
                value: !machine.debugging,
              })
            }
          />
          <TinyButton icon="Edit" onClick={() => geek.send("open")} />
        </Flex>
      </Card>
      <LibrarianModal geek={geek} />
    </>
  );
}
