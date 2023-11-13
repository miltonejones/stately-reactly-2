import {
  Alert,
  AppBar,
  Avatar,
  Backdrop,
  Badge,
  Breadcrumbs,
  Card,
  Checkbox,
  Chip,
  CircularProgress,
  Collapse,
  Dialog,
  Divider,
  Drawer,
  Icon,
  LinearProgress,
  Link,
  Paper,
  Radio,
  Rating,
  Select,
  Skeleton,
  Slider,
  Snackbar,
  Stack,
  Step,
  Stepper,
  Switch,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import Spacer from "../../styled/Spacer";
import { RyButton } from "./RyButton/RyButton";
import { RyIconButton } from "./RyIconButton/RyIconButton";
import { RyAudioPlayer } from "./RyAudioPlayer/RyAudioPlayer";
import { RyDataGrid } from "./RyDataGrid/RyDataGrid";
import { RyRepeater } from "./RyRepeater/RyRepeater";
import { RyTextbox } from "./RyTextbox/RyTextbox";
import { RyPagination } from "./RyPagination/RyPagination";
import { RyList } from "./RyList/RyList";
import Marquee from "react-fast-marquee";
import { RyInfoCard } from "./RyInfoCard/RyInfoCard";
import { ChipMenu } from "../../styled";

const generate =
  (Component) =>
  ({ children, type, faux, ...props }) => {
    const isModalType = ["Collapse", "Dialog", "Drawer", "Snackbar"].some(
      (f) => type === f
    );
    const pretend = isModalType && faux;
    const Tag = pretend ? Card : Component;
    const opener = !pretend ? {} : { open: true, elevation: 0 };
    const sx = !pretend
      ? {}
      : { width: "fit-content", minWidth: 100, maxWidth: "30vw" };
    return (
      <Tag {...props} {...opener} sx={{ ...props.sx, ...sx }}>
        {children}
      </Tag>
    );
  };

const RyImage = (props) => {
  return <img {...props} style={props.sx} />;
};

const RyMarquee = ({ children, ...props }) => {
  return <Marquee {...props}>{children}</Marquee>;
};

const RySnackbar = ({ children, faux, ...props }) => {
  const Tag = faux ? Card : Snackbar;
  const opener = !faux ? {} : { open: true, elevation: 0 };
  const sx = !faux
    ? {}
    : { width: "fit-content", minWidth: 300, maxWidth: "30vw" };

  return (
    <Tag {...props} {...opener} sx={{ ...props.sx, ...sx }}>
      <Box>{children}</Box>
    </Tag>
  );
};

const RyBreadcrumbs = ({
  children,
  crumbs,
  invokeEvent,
  getStateValue,
  ...props
}) => {
  const bread = !crumbs ? [] : JSON.parse(crumbs);
  const handleClick = (event, value) => {
    invokeEvent(event, "onCrumbClick", {
      value,
    });
  };
  return (
    <>
      <Breadcrumbs {...props}>
        {bread.map((c) => {
          const Tag = c.type === "Link" ? Link : Typography;
          return (
            <Tag
              sx={{ cursor: "pointer" }}
              onClick={(e) => handleClick(e, c.value)}
              variant={c.variant}
              key={c.label}
            >
              {!c.binding ? c.label : getStateValue(c.binding)}
            </Tag>
          );
        })}
      </Breadcrumbs>
    </>
  );
};

const RxChipMenu = ({ invokeEvent, ...props }) => {
  const options = props.options?.split(","); // ["left", "right"];
  const handleClick = (event, value) => {
    invokeEvent(event, "onChipChange", {
      value,
    });
  };
  return (
    <Box sx={{ width: "fit-content" }}>
      <ChipMenu
        {...props}
        options={options}
        onChange={(val) => handleClick(null, val)}
        value={Number(props.value)}
      />
    </Box>
  );
};

export const Library = {
  Typography: generate(Typography),
  Box: generate(Box),
  AudioPlayer: RyAudioPlayer,
  Button: RyButton,
  ChipMenu: RxChipMenu,
  IconButton: RyIconButton,
  Avatar: generate(Avatar),
  Badge: generate(Badge),
  Alert: generate(Alert),
  Backdrop: generate(Backdrop),
  Pagination: RyPagination,
  Drawer: generate(Drawer),
  AppBar: generate(AppBar),
  Breadcrumbs: RyBreadcrumbs, //generate(Breadcrumbs),
  Link: generate(Link),
  Collapse: generate(Collapse),
  Divider: generate(Divider),
  List: RyList,
  Textbox: RyTextbox,
  Card: generate(Card),
  Slider: generate(Slider),
  LinearProgress: generate(LinearProgress),
  CircularProgress: generate(CircularProgress),
  Switch: generate(Switch),
  Dialog: generate(Dialog),
  Spacer: Spacer,
  Image: RyImage,
  Chip: Chip,
  Icon: Icon,
  Checkbox: Checkbox,
  DataGrid: RyDataGrid,
  Repeater: RyRepeater,
  InfoCard: RyInfoCard,
  Marquee: RyMarquee, //generate(Marquee),
  Stack: generate(Stack),
  Skeleton: generate(Skeleton),
  Rating: generate(Rating),
  Snackbar: RySnackbar,
  Tooltip: generate(Tooltip),
  Select: generate(Select),
  Paper: generate(Paper),
  Toolbar: generate(Toolbar),
  Stepper: generate(Stepper),
  Radio: generate(Radio),
  Step: generate(Step),
};
