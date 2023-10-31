import { Chip } from "@mui/material";
import Flex from "./Flex";
import Spacer from "./Spacer";

export default function ChipMenu({ onChange, options, value = 0 }) {
  return (
    <Flex
      spacing={0.5}
      sx={{
        backgroundColor: (theme) => theme.palette.grey[400],
        borderRadius: (theme) => theme.spacing(2),
        padding: 0.25,
      }}
    >
      {options.map((option, i) => (
        <ChipItem
          onClick={() => onChange(i)}
          key={i}
          color={i === value ? "primary" : "default"}
          variant={i !== value ? "outlined" : "filled"}
          label={option}
          size="small"
        />
      ))}
      <Spacer />
    </Flex>
  );
}

function ChipItem({ label, ...props }) {
  if (["string", "number"].some((f) => typeof label === f)) {
    return <Chip {...props} label={label} />;
  }
  return <Chip {...props} {...label} />;
}
