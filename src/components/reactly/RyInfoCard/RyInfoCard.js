import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";

export const RyInfoCard = ({
  children,
  truncate,
  title,
  subtitle,
  image,
  ...props
}) => {
  const of = (value) => {
    if (!truncate || !value || value.length < truncate) {
      return value;
    }

    return value.substr(0, truncate) + "...";
  };

  return (
    <Box sx={{ position: "relative" }}>
      {children}
      <Card {...props}>
        <CardMedia sx={{ height: 140 }} image={image} title={title} />
        <CardContent>
          <Typography gutterBottom variant="body2">
            {of(title)}
          </Typography>
          {!!subtitle && (
            <Typography variant="caption" color="text.secondary">
              {of(subtitle)}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
