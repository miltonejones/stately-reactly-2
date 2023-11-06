import { TextField } from "@mui/material";

export default function SubmitField({ onSubmit, ...props }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <TextField {...props} />
    </form>
  );
}
