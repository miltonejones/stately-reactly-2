import { Button, MenuItem, Stack, TextField, Typography } from "@mui/material";
import Flex from "../../../styled/Flex";
import Spacer from "../../../styled/Spacer";

export default function CommonForm({
  fields,
  record,
  disabled,
  onChange,
  onSave,
  onCancel,
  // onBind,
  // onConfigure,
}) {
  return (
    <Stack spacing={1}>
      {fields.map((prop) => (
        <Stack>
          <Flex>
            <Typography sx={{ textTransform: "capitalize" }} variant="caption">
              <b> {prop.title.replace(/-/g, " ")}</b>
            </Typography>
            <Spacer />
          </Flex>
          <Typography variant="caption">{prop.description}</Typography>

          <TextField
            select={!!prop.type}
            size="small"
            key={prop.title}
            label={prop.title}
            value={record[prop.title]}
            onChange={(e) => onChange(prop.title, e.target.value)}
          >
            {!!prop.type &&
              prop.type.map((key) => <MenuItem value={key}>{key}</MenuItem>)}
          </TextField>
        </Stack>
      ))}
      <Flex spacing={1}>
        <Spacer />
        {!!onCancel && <Button onClick={onCancel}>cancel</Button>}
        {!!onSave && (
          <Button disabled={disabled} variant="contained" onClick={onSave}>
            save
          </Button>
        )}
      </Flex>
    </Stack>
  );
}
