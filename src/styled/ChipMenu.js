import { Card, Chip, Collapse, Typography } from "@mui/material";
import Flex from "./Flex";
import Spacer from "./Spacer";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import React from "react";
import Nowrap from "./Nowrap";
import { TinyButton } from "./TinyButton";
const PAGE_SIZE = 4;

export default function ChipMenu({
  onChange,
  options: opts,
  value = 0,
  limit,
}) {
  const [index, setIndex] = React.useState(0);
  if (!opts) return <i />;
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
          active={ordinal(i) === value}
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

function ChipCard({ label, icon, active, ...props }) {
  const [el, setEl] = React.useState(0);
  const sx = {
    borderRadius: (theme) => theme.spacing(2),
    padding: (theme) => theme.spacing(0.25, 0.5),
    backgroundColor: (theme) =>
      active || el > 0 ? theme.palette.common.white : theme.palette.grey[400],
  };
  const actions = {
    onMouseEnter: () => setEl(3),
    onMouseLeave: () => setEl(0),
  };
  return (
    <>
      {[active, !active].map((open, i) => (
        <Collapse
          sx={{ minWidth: 0, m: 0, p: 0 }}
          collapsedSize={`0px`}
          orientation="horizontal"
          dir="left"
          key={i}
          in={open}
        >
          <Card
            {...props}
            sx={sx}
            variant="elevation"
            elevation={el}
            {...actions}
          >
            <Flex>
              {typeof icon !== "string" ? (
                <>{icon}</>
              ) : (
                <TinyButton icon={icon} />
              )}
              <Nowrap bold={active} variant="caption">
                {label}
              </Nowrap>
            </Flex>
          </Card>
        </Collapse>
      ))}
    </>
  );
}

function ChipItem({ label, ...props }) {
  if (["string", "number"].some((f) => typeof label === f)) {
    return <ChipCard {...props} label={label} />;
  }
  return <ChipCard {...props} {...label} />;
}
