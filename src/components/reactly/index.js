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

const generate =
  (Component) =>
  ({ children, type, faux, ...props }) => {
    const isModalType = ["Collapse", "Dialog", "Drawer"].some(
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
        <>{children}</>
      </Tag>
    );
  };

const RyImage = (props) => {
  return <img {...props} style={props.sx} />;
};

const RyMarquee = ({ children, ...props }) => {
  return <Marquee {...props}>{children}</Marquee>;
};

export const Library = {
  Typography: generate(Typography),
  Box: generate(Box),
  AudioPlayer: RyAudioPlayer,
  Button: RyButton,
  IconButton: RyIconButton,
  Avatar: generate(Avatar),
  Badge: generate(Badge),
  Alert: generate(Alert),
  Backdrop: generate(Backdrop),
  Pagination: RyPagination,
  Drawer: generate(Drawer),
  AppBar: generate(AppBar),
  Breadcrumbs: generate(Breadcrumbs),
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
  Snackbar: generate(Snackbar),
  Tooltip: generate(Tooltip),
  Select: generate(Select),
  Paper: generate(Paper),
  Toolbar: generate(Toolbar),
  Stepper: generate(Stepper),
  Radio: generate(Radio),
  Step: generate(Step),
};
