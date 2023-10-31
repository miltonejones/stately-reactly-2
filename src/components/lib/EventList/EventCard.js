import { Card, Stack, Typography } from "@mui/material";
import Flex from "../../../styled/Flex";
import Spacer from "../../../styled/Spacer";
import { TinyButton } from "../../../styled/TinyButton";
import Nowrap from "../../../styled/Nowrap";
import actionTransform from "../../../util/actionTransform";

const EVENT_DESC = {
  dataLoaded: "the data resource has finished loading",
  loadStarted: "the data resource has started loading",
  onPageLoad: "the page is loaded",
  onPageChange: "the page number of the component changes",
  onCellClick: "a cell in any list row is clicked",
};

const EventCard = ({
  editor,
  handler,
  supported,
  applicationScripts,
  appData,
  page,
  configure,
}) => {
  const handleClick = () => {
    if (!supported) return configure();
    editor.send({
      type: "open",
      step: handler,
      supported,
    });
  };
  const handleDrop = () => {
    editor.send({
      type: "drop",
      ...handler,
    });
  };
  return (
    <Card sx={{ p: 1 }}>
      <Stack>
        <Flex>
          <Typography
            onClick={handleClick}
            color="text.secondary"
            variant="caption"
          >
            {handler.event} 🡒 {handler.action.type}
          </Typography>
          <Spacer />
          <TinyButton
            onClick={handleDrop}
            disabled={!editor.state.can("drop")}
            icon={"Delete"}
          />
        </Flex>

        {!!EVENT_DESC[handler.event] && (
          <Typography variant="body2" onClick={handleClick}>
            <b>When</b> {EVENT_DESC[handler.event]}
          </Typography>
        )}
        <Nowrap width={360} variant="body2" onClick={handleClick}>
          {
            actionTransform(handler.action, {
              application: appData,
              scripts: applicationScripts,
              page,
            }).content
          }
        </Nowrap>
      </Stack>
    </Card>
  );
};

export default EventCard;
