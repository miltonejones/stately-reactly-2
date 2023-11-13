import { Collapse, Stack, Typography } from "@mui/material";
import Flex from "./Flex";
import { TinyButton } from "./TinyButton";
import Nowrap from "./Nowrap";

export default function JsonTree({
  value,
  open,
  setOpen,
  ml = 0,
  path = [""],
}) {
  if (!value) return <i />;
  const expand = (key) => {
    setOpen((c) => ({
      ...c,
      [key]: !c[key],
    }));
  };

  if (typeof value !== "object") {
    return value;
  }

  return (
    <>
      {Object.keys(value).map((key) => {
        const relative = [...path].concat(key).join("/");
        const expanded = open[relative];
        return (
          <Stack sx={{ ml }} key={key}>
            <Flex>
              {typeof value[key] === "object" &&
                !!value[key] &&
                !!Object.keys(value[key]).length && (
                  <TinyButton
                    icon={open[relative] ? "Remove" : "Add"}
                    onClick={() => expand(relative)}
                  />
                )}
              <Typography
                variant="body2"
                sx={{ fontWeight: expanded ? 600 : 400 }}
              >
                {key}
              </Typography>
              {typeof value[key] !== "object" &&
                typeof value[key] !== "function" && (
                  <Nowrap variant="body2">
                    : {JSON.stringify(value[key])}
                  </Nowrap>
                )}
              {typeof value[key] === "function" && (
                <Nowrap variant="body2">: {value[key].toString()}</Nowrap>
              )}
            </Flex>

            {typeof value[key] === "object" && expanded && (
              <Collapse in={expanded}>
                <JsonTree
                  ml={ml + 1}
                  path={path.concat(key)}
                  open={open}
                  setOpen={setOpen}
                  value={value[key]}
                />
                {/* <Json>{JSON.stringify(value[key], 0, 2)}</Json> */}
              </Collapse>
            )}
          </Stack>
        );
      })}
    </>
  );
}
