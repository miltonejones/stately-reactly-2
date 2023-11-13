import {
  Button,
  Grid,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import Flex from "../../../styled/Flex";
import Spacer from "../../../styled/Spacer";

export default function CommonForm({
  fields,
  record,
  disabled,
  onChange,
  onSave,
  onCancel,
  onDelete,
  buttons,
  // onBind,
  // onConfigure,
}) {
  return (
    <Grid container>
      {fields.map((prop) => (
        <DynamoGrid prop={prop} record={record} onChange={onChange} />
      ))}
      <Grid item xs={12}>
        <Flex spacing={1}>
          <Spacer />
          {!!onCancel && (
            <Button size="small" onClick={onCancel}>
              cancel
            </Button>
          )}
          {!!onSave && (
            <Button
              size="small"
              disabled={disabled}
              variant="contained"
              onClick={onSave}
            >
              save
            </Button>
          )}
          {!!onDelete && (
            <Button
              size="small"
              disabled={disabled}
              color="error"
              variant="contained"
              onClick={onDelete}
            >
              delete
            </Button>
          )}
          {buttons}
        </Flex>
      </Grid>
    </Grid>
  );
}

const DynamoGrid = ({ prop, record, onChange }) => {
  const value = !prop.types ? record[prop.title] : prop.types[prop.title];
  if (prop.type === "boolean") {
    return (
      <Grid item xs={12}>
        <Flex>
          <Typography sx={{ textTransform: "capitalize" }} variant="caption">
            <b> {prop.title.replace(/-/g, " ")}</b>
          </Typography>
          <Spacer />
        </Flex>
        <Flex spacing={1}>
          {" "}
          <Switch
            checked={Boolean(value)}
            onChange={(e) =>
              onChange(prop.field || prop.title, e.target.checked, prop.key)
            }
          />
          <Typography variant="caption">{prop.description}</Typography>
        </Flex>
      </Grid>
    );
  }
  return (
    <Grid xs={prop.xs || 12} item>
      <Stack sx={{ p: 1 }}>
        <Flex>
          <Typography sx={{ textTransform: "capitalize" }} variant="caption">
            <b> {(prop.alias || prop.title).replace(/-/g, " ")}</b>
          </Typography>
          <Spacer />
        </Flex>
        <Typography variant="caption">{prop.description}</Typography>

        <DynamoField
          prop={prop}
          record={record}
          select={!!prop.type}
          size="small"
          key={prop.title}
          label={prop.title}
          value={!prop.of ? record[prop.title] : record[prop.of][prop.title]}
          onChange={(e) =>
            onChange(prop.field || prop.title, e.target.value, prop.key)
          }
        >
          {!!prop.type &&
            prop.type.map &&
            prop.type.map((key) => (
              <MenuItem value={key.value || key}>{key.label || key}</MenuItem>
            ))}
        </DynamoField>
      </Stack>
    </Grid>
  );
};

const DynamoField = ({ prop, record, children, ...props }) => {
  if (prop.component) {
    const Tag = prop.component;
    return (
      <Tag
        {...prop.props}
        value={!prop.of ? record[prop.title] : record[prop.of][prop.title]}
      />
    );
  }
  return <TextField {...props}>{children}</TextField>;
};
