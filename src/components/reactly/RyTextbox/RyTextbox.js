import { TextField } from "@mui/material";

export const RyTextbox = ({ boundSettings, invokeEvent, ...props }) => {
  const handleEnter = (event) => {
    invokeEvent(event, "onEnterPress", {});
  };
  return (
    <>
      <TextField
        {...props}
        onKeyUp={(e) => e.keyCode === 13 && handleEnter(e)}
      />
      {/* <pre>{JSON.stringify(boundSettings, 0, 2)}</pre> */}
    </>
  );
};
