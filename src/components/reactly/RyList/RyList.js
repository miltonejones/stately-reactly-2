import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import TextIcon from "../../../styled/TextIcon";

export const RyList = ({ items, invokeEvent, children, ...props }) => {
  const handleListClick = (event, item) => {
    invokeEvent(event, "onItemClick", item);
  };

  let listItems;
  if (typeof items === "string") {
    try {
      listItems = JSON.parse(items);
    } catch (ex) {
      // console.log("unparsable list", items);
    }
  } else {
    listItems = items;
  }

  return (
    <Box sx={{ position: "relative" }}>
      {children}
      <List {...props}>
        {!!listItems &&
          listItems.map((item, i) => (
            <ListItem key={i} onClick={(e) => handleListClick(e, item)}>
              <ListItemAvatar>
                {!!item.avatar && <Avatar src={item.avatar} />}
                {!!item.startIcon && <TextIcon icon={item.startIcon} />}
              </ListItemAvatar>

              <ListItemText primary={item.text} secondary={item.subtext} />
            </ListItem>
          ))}
      </List>
    </Box>
  );
};
