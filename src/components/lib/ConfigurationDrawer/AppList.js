import React from "react";
import { Box, Stack, Typography, Avatar } from "@mui/material";
import Nowrap from "../../../styled/Nowrap";
import moment from "moment";

export default function AppList({ appKeys, machine }) {
  return (
    <Stack sx={{ p: 2 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "40px 240px 400px 1fr 1fr 1fr",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <Box />
        <Nowrap variant="caption" bold>
          Name
        </Nowrap>
        <Nowrap variant="caption" bold>
          File
        </Nowrap>
        <Nowrap variant="caption" bold>
          Path
        </Nowrap>
        <Nowrap variant="caption" bold>
          Size
        </Nowrap>
        <Nowrap variant="caption" bold>
          Date
        </Nowrap>
      </Box>
      {appKeys.map((item) => (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "40px 240px 400px 1fr 1fr 1fr",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Box
            sx={{
              backgroundColor: "white",
            }}
          >
            <Avatar src={item.photo} alt={item.name} />
          </Box>
          <Nowrap
            variant="body2"
            hover
            onClick={() =>
              machine.send({
                type: "open",
                key: item.objectKey,
              })
            }
          >
            {item.name}
          </Nowrap>

          <Typography variant="body2">{item.objectKey}</Typography>
          <Typography variant="body2">{item.path}</Typography>
          <Typography variant="body2">{item.objectSize}</Typography>
          <Typography variant="body2">
            {moment(Number(item.timestamp)).format("DD MMM yyyy HH:mm")}
          </Typography>
        </Box>
      ))}
    </Stack>
  );
}
