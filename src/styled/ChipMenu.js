import { Chip } from "@mui/material";
import Flex from "./Flex";
import Spacer from "./Spacer";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import React from "react";
const PAGE_SIZE = 4;

export default function ChipMenu({
  onChange,
  options: opts,
  value = 0,
  limit,
}) {
  const [index, setIndex] = React.useState(0);
  const options = !limit ? opts : opts.slice(index, index + limit);
  const ordinal = (i) => Number(i) + index;

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
          onClick={() => onChange(ordinal(i))}
          key={i}
          color={ordinal(i) === value ? "primary" : "default"}
          variant={ordinal(i) !== value ? "outlined" : "filled"}
          label={option}
          size="small"
        />
      ))}
      {!!limit && (
        <Chip
          disabled={index < 1}
          onClick={() => setIndex(Number(index) - PAGE_SIZE)}
          icon={<ArrowBack />}
          size="small"
        />
      )}
      {!!limit && (
        <Chip
          disabled={index > opts.length - 4}
          onClick={() => setIndex(Number(index) + PAGE_SIZE)}
          icon={<ArrowForward />}
          size="small"
        />
      )}
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
