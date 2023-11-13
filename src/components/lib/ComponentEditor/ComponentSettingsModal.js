import {
  Button,
  Dialog,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Flex from "../../../styled/Flex";
import Spacer from "../../../styled/Spacer";
import { Close } from "@mui/icons-material";
import React from "react";
import CommonForm from "../CommonForm/CommonForm";
import { TinyButton } from "../../../styled/TinyButton";

export default function ComponentSettingsModal({ machine }) {
  const { selectedSetting } = machine.state.context;
  if (!selectedSetting) return <i />;

  const formProps = [
    {
      xs: 6,
      title: "title",
      description: "Setting name cannot be changed once it is set",
    },
    {
      xs: 6,
      description: "Setting type or list of options",
      title: "type",
    },
    {
      xs: 6,
      title: "default",
    },
    {
      xs: 6,
      title: "description",
    },
    {
      xs: 6,
      title: "category",
      type: [
        "Visibility",
        "Developer",
        "Unknown",
        "Colors",
        "General",
        "Unused",
        "Behavior",
        "Appearance",
      ],
    },
    {
      xs: 6,
      title: "alias",
    },
  ];

  return (
    <Dialog maxWidth="xl" open={machine.state.can("cancel")}>
      <Stack sx={{ p: 2, width: 600 }}>
        <Flex>
          <Typography variant="subtitle2">Edit Setting</Typography>
          <Spacer />
          <TinyButton onClick={() => machine.send("cancel")} icon="Close" />
        </Flex>
        <CommonForm
          fields={formProps}
          record={selectedSetting}
          onChange={(name, value) => {
            machine.send({
              type: "update",
              name,
              value,
            });
          }}
        />
        <Flex spacing={1}>
          <Spacer />
          {machine.state.can("cancel") && (
            <Button onClick={() => machine.send("cancel")}>cancel</Button>
          )}
          <Button variant="contained" onClick={() => machine.send("save")}>
            save
          </Button>
        </Flex>
      </Stack>
    </Dialog>
  );
}
