import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Typography,
} from "@mui/material";
import moment from "moment";

export default function AppGrid({ appKeys, machine }) {
  return (
    <Stack sx={{ p: 2 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        {appKeys
          .filter((item) => !!item)
          .map((item) => (
            <Card
              sx={{ cursor: "pointer" }}
              onClick={() =>
                machine.send({
                  type: "open",
                  key: item.objectKey,
                })
              }
            >
              <CardMedia
                sx={{ height: 180 }}
                image={item.photo}
                title={item.name}
              />
              <CardContent>
                <Typography gutterBottom variant="body2">
                  {item.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Last changed:{" "}
                  {moment(Number(item.timestamp)).format("DD-MM-yyyy HH:mm")}
                </Typography>
              </CardContent>
            </Card>
          ))}
      </Box>
    </Stack>
  );
}
