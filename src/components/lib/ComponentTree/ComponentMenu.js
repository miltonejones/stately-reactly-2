import { Card } from "@mui/material";
import Flex from "../../../styled/Flex";
import { TinyButton } from "../../../styled/TinyButton";
import Nowrap from "../../../styled/Nowrap";

export default function ComponentMenu({ create, iconList, current }) {
  const menuSx = {
    backgroundColor: (theme) => theme.palette.primary.main,
    color: (theme) => theme.palette.common.white,
    padding: (theme) => theme.spacing(0.5, 1),
  };

  const tinySx = {
    height: 26,
    width: 26,
    p: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const hoverSx = {
    opacity: 0.2,
    transition: "opacity 0.2s linear",
    "&:hover": {
      opacity: 1,
    },
  };

  return (
    <>
      <Flex
        spacing={0.5}
        sx={{
          position: "absolute",
          left: 10,
          top: -32,
        }}
      >
        <Card
          sx={{
            ...menuSx,
            fontSize: "0.8rem",
          }}
        >
          <Flex spacing={1}>
            {!!iconList[current.ComponentType] && (
              <TinyButton
                sx={{ color: "white" }}
                icon={iconList[current.ComponentType].icon}
              />
            )}
            <Nowrap variant="caption" sx={{ color: "white" }}>
              {current.ComponentName}
            </Nowrap>
          </Flex>
        </Card>

        <Card
          sx={{
            ...menuSx,
            ...tinySx,
          }}
        >
          <TinyButton icon="Close" sx={{ color: "white" }} />
        </Card>
      </Flex>

      <Card
        sx={{
          ...menuSx,
          ...tinySx,
          ...hoverSx,
          position: "absolute",
          left: "50%",
          top: -28,
        }}
      >
        <TinyButton
          icon="Add"
          onClick={() => create(current.componentID, current.order - 10)}
          sx={{ color: "white" }}
        />
      </Card>
      <Card
        sx={{
          ...menuSx,
          ...tinySx,
          ...hoverSx,
          position: "absolute",
          left: "50%",
          bottom: -28,
        }}
      >
        <TinyButton
          icon="Add"
          sx={{ color: "white" }}
          onClick={() =>
            create(current.componentID, Number(current.order) + 10)
          }
        />
      </Card>
    </>
  );
}
