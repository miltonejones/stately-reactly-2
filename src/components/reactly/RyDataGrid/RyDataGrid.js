import { Avatar, Box, Button } from "@mui/material";
import Nowrap from "../../../styled/Nowrap";
import TextIcon from "../../../styled/TextIcon";
import moment from "moment";

export const RyDataGrid = ({
  invokeEvent,
  selectedColumn,
  selectedID,
  selectedRowIcon,
  selected_indicator_col,
  children,
  selectedProp,
  ...props
}) => {
  if (!props.bindings) return <>no bindings detected</>;
  const bindings = JSON.parse(props.bindings);
  if (!props.resourceData) {
    return <>No results to display.</>;
  }
  const response = props.resourceData[bindings.resourceID];
  const rowItems = response?.rows || response;

  const handleChangePage = (event, column, row, index, items) => {
    invokeEvent(event, "onCellClick", {
      ID: row[selectedProp],
      column,
      ...row,
      row: index,
      items,
      rowItems,
    });
  };

  if (!bindings.columnMap || !rowItems || !rowItems.map) {
    return <>No results to display. {JSON.stringify(rowItems)}</>;
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
      {/* {children}[{selectedProp}][{selectedID}] */}
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
      {rowItems.map((row, index) => (
        <Box
          key={index}
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
                <img
                  style={{
                    width: datatype.settings.Width,
                    height: datatype.settings.Height,
                    borderRadius: datatype.settings.Radius,
                  }}
                  src={row[f]}
                  alt="row icon"
                />
              );
            }
            return (
              <Nowrap
                bold={!!selectedProp && row[selectedProp] === selectedID}
                variant="body2"
                onClick={(e) => handleChangePage(e, f, row, index, rowItems)}
                sx={{ display: "flex", alignItems: "center" }}
                key={f}
              >
                {!!selectedRowIcon &&
                  !!selectedColumn &&
                  row[selectedColumn] === selectedID &&
                  i === Number(selected_indicator_col) && (
                    <TextIcon icon={selectedRowIcon} />
                  )}
                {parseProp(row[f], datatype)}
              </Nowrap>
            );
          })}
        </Box>
      ))}
    </Box>
  );
};

function parseProp(value, datatype) {
  if (datatype?.type === "Time") {
    return moment(value).format(datatype.settings.format);
  }
  if (!value) return null;
  if (["string", "number"].some((f) => typeof value === f)) {
    return value;
  }
  if (typeof value === "object") {
    const values = Object.values(value);
    return values[0];
  }
  return JSON.stringify(value);
}
