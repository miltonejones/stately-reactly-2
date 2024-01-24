import { Box } from "@mui/material";

const incomplete = (action) => (
  <Box>
    {!!action && (
      <>
        "{action.target}/{action.type}" configuration incomplete
      </>
    )}
  </Box>
);

export default function actionTransform(
  action,
  { application, scripts, page, componentReference }
) {
  const pages = application.pages;
  const resources = application.resources;

  const labelTransforms = {
    setState: () => {
      if (!action.hasOwnProperty("value")) {
        return incomplete(action);
      }
      return (
        <Box>
          Set the value of "{action.target}" to{" "}
          <b>{JSON.stringify(action.value)}</b>
        </Box>
      );
    },

    dataExec: () => {
      const obj = resources.find((e) => e.ID === action.target);
      return (
        <>
          Execute "{obj.name} - {obj.method}"
        </>
      );
    },
    openLink: () => {
      return <>Open a link to "{action.target}"</>;
    },
    methodCall: () => <Box>Execute method "{action.methodName}"</Box>,
    execRef: () => (
      <Box>
        Execute method {componentReference[action.target]}.
        <b>{action.method}()</b>
      </Box>
    ),
    modalOpen: () => {
      const dialogName = page?.components?.find((e) => e.ID === action.target);
      const appModal = application?.components?.find(
        (e) => e.ID === action.target
      );
      const modalLabel =
        dialogName?.ComponentName || `application.${appModal?.ComponentName}`;
      const ok = !!dialogName || !!appModal;
      if (!ok) return incomplete();
      return (
        <>
          {action.open ? "Open" : "Close"} component <b>{modalLabel}</b>
        </>
      );
    },
    scriptRun: () => {
      const scr = scripts.find((f) => f.ID === action.target);
      if (!scr) return incomplete();

      return (
        <>
          Run script <b>{scr.page}.</b>
          {scr.name}
        </>
      );
    },
  };
  labelTransforms.pathOpen = labelTransforms.openLink;

  const transformer = labelTransforms[action.type];

  if (!transformer) {
    return {
      content: `No transformer for ${action.type}`,
    };
  }

  return {
    content: transformer(action),
  };
}
