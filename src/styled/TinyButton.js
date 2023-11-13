import { CircularProgress, IconButton } from "@mui/material";
import * as Icons from "@mui/icons-material";

export const TinyButton = ({ icon: Icon, hidden, ...props }) => {
  if (typeof Icon === "string") {
    const Tiny = Icons[Icon];

    return (
      <IconButton
        {...props}
        sx={{ width: 18, height: 18, opacity: hidden ? 0 : 1, ...props.sx }}
      >
        <Tiny sx={{ width: 16, height: 16, ...props.sx }} />
      </IconButton>
    );
  }

  if (!Icon) {
    return <>?</>;
  }

  return (
    <IconButton
      {...props}
      sx={{ width: 18, height: 18, opacity: hidden ? 0 : 1, ...props.sx }}
    >
      <Icon sx={{ width: 16, height: 16 }} />
    </IconButton>
  );
};

export const MachineButton = ({
  machine,
  message,
  payload,
  hide,
  icon: smiley,
  ...props
}) => {
  const icon = machine.state.can(message) ? smiley : "Error";
  if (!machine.state.can(message)) {
    if (hide) return <i />;
    return <CircularProgress size={16} color="error" />;
  }
  return (
    <TinyButton
      {...props}
      disabled={props.disabled || !machine.state.can(message)}
      icon={icon}
      onClick={() =>
        machine.send({
          type: message,
          ...payload,
        })
      }
    />
  );
};
