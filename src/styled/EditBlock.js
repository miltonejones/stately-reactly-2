import { Card, Stack, Typography } from "@mui/material";
import Spacer from "./Spacer";
import Flex from "./Flex";

const EditBlock = ({ title, description, action, children }) => {
  return (
    <>
      <Stack direction="column">
        <Flex>
          <Typography variant="caption">
            <b>{title}</b>
          </Typography>
          <Spacer />
          {action}
        </Flex>
        <Typography variant="caption">{description}</Typography>
        {children}
      </Stack>
    </>
  );
};

export default EditBlock;
