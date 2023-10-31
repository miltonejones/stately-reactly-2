import { Stack, Button, Dialog, TextField } from "@mui/material";
import EditBlock from "../../../styled/EditBlock";
import Spacer from "../../../styled/Spacer";
import Flex from "../../../styled/Flex";
import { PanelHeader } from "../ConfigurationDrawer/ConnectionDrawer";

export default function PageModal({ machine }) {
  if (!machine.createdPage) return <i />;
  const handleChange = (e) => {
    machine.send({
      type: "modify name",
      name: e.target.name,
      value: e.target.value,
    });
  };
  return (
    <Dialog open={machine.state.can("modify name")}>
      <Stack sx={{ p: 2 }} spacing={1}>
        <PanelHeader>Add a new page</PanelHeader>
        <EditBlock
          title="Name"
          description="Name of the page as it appears in the title bar"
        >
          <TextField
            size="small"
            label="Page Name"
            name="PageName"
            onChange={handleChange}
            value={machine.createdPage.PageName}
          />
        </EditBlock>
        <EditBlock
          title="Path"
          description="Path of the page as it appears in the address bar"
        >
          <TextField
            size="small"
            label="Page Path"
            name="PagePath"
            onChange={handleChange}
            value={machine.createdPage.PagePath}
          />
        </EditBlock>
        <Flex spacing={1}>
          <Spacer />
          <Button onClick={() => machine.send("cancel new page")}>close</Button>
          <Button variant="contained" onClick={() => machine.send("done")}>
            save
          </Button>
        </Flex>
      </Stack>
    </Dialog>
  );
}
