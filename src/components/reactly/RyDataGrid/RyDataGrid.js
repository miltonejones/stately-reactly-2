import { Avatar, Box, Button } from "@mui/material";
import Nowrap from "../../../styled/Nowrap";
import TextIcon from "../../../styled/TextIcon";

export const RyDataGrid = ({
  invokeEvent,
  selectedColumn,
  selectedID,
  selectedRowIcon,
  selected_indicator_col,
  children,
  ...props
}) => {
  if (!props.bindings) return <>no bindings detected</>;
  const bindings = JSON.parse(props.bindings);
  if (!props.resourceData) {
    return <>No results to display.</>;
  }
  const rowItems = props.resourceData[bindings.resourceID];
  const json = JSON.stringify(rowItems, 0, 2);

  const handleChangePage = (event, column, row, index) => {
    // alert(column);
    invokeEvent(event, "onCellClick", {
      column,
      ...row,
      row: index,
      rows: rowItems,
    });
  };

  if (!bindings.columnMap || !rowItems) {
    return <>No results to display.</>;
  }
  const fr = bindings.columnMap
    .map((f) =>
      ["Image", "Icon"].some((p) => bindings.typeMap[f].type === p)
        ? "32px"
        : "1fr"
    )
    .join(" ");
  return (
    <Box sx={props.sx}>
      {children}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: fr,
          gap: 1,
          width: "100%",
        }}
      >
        {bindings.columnMap?.map((f) => (
          <Nowrap variant="body2" key={f}>
            <b>{bindings.bindings[f]}</b>
          </Nowrap>
        ))}
      </Box>
      {rowItems.map((row, i) => (
        <Box
          key={i}
          sx={{
            display: "grid",
            gridTemplateColumns: fr,
            gap: 1,
            width: "100%",
            mb: 1,
          }}
        >
          {bindings.columnMap.map((f, i) => {
            const datatype = bindings.typeMap[f];
            if (datatype.type === "Image") {
              return (
                <Avatar
                  sx={{ width: 30, height: 30 }}
                  src={row[f]}
                  alt="row icon"
                />
              );
            }
            return (
              <Nowrap
                bold={!!selectedColumn && row[selectedColumn] === selectedID}
                variant="body2"
                onClick={(e) => handleChangePage(e, f, row, i)}
                sx={{ display: "flex", alignItems: "center" }}
                key={f}
              >
                {!!selectedRowIcon &&
                  !!selectedColumn &&
                  row[selectedColumn] === selectedID &&
                  i === Number(selected_indicator_col) && (
                    <TextIcon icon={selectedRowIcon} />
                  )}
                {parseProp(row[f])}
              </Nowrap>
            );
          })}
        </Box>
      ))}
    </Box>
  );
};

function parseProp(value) {
  if (["string", "number"].some((f) => typeof value === f)) {
    return value;
  }
  if (typeof value === "object") {
    const values = Object.values(value);
    return values[0];
  }
  return JSON.stringify(value);
}
