import { Box, Pagination } from "@mui/material";

export const RyPagination = ({ children, invokeEvent, ...props }) => {
  const handleChangePage = (event, page) => {
    invokeEvent(event, "onPageChange", { page });
  };

  return (
    <Box sx={{ position: "relative" }}>
      {children}
      <Pagination
        {...props}
        onChange={handleChangePage}
        page={Number(props.page)}
      />
    </Box>
  );
};
