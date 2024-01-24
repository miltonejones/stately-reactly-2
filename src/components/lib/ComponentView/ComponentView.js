import { useParams } from "react-router-dom";
import ComponentPreview from "../ComponentTree/ComponentPreview";
import React from "react";
import Panel from "../../../styled/Panel";
import { Card, Typography } from "@mui/material";
import { Columns, Flex, Nowrap, Spacer, TinyButton } from "../../../styled";
import { Helmet } from "react-helmet";
import { reduceStyles } from "../../../util";
import InvokeErrorModal from "../InvokeErrorModal/InvokeErrorModal";

const recursivePath = (page, pages, outputPath = []) => {
  if (!page) return outputPath;
  outputPath.push(page.PageName);
  const ancestor = pages.find((p) => p.ID === page.pageID);
  if (ancestor) {
    recursivePath(ancestor, pages, outputPath);
  }
  return outputPath;
};

export default function ComponentView({ machine }) {
  const params = useParams();

  const { appname } = params;

  React.useEffect(() => {
    machine.send({
      type: "load app",
      name: appname,
      routeParams: params["*"],
    });
  }, [params, appname]);

  // extract useful properties from the state machine
  const { page: currentPage, appData } = machine;

  if (!appData) return <>Loading...</>;

  const pageList = recursivePath(currentPage, appData?.pages).reverse();
  const titleParts = ["Reactly", appData?.Name, ...pageList].filter(Boolean);

  const previewProps = {
    // reference to the applicaion state machine
    machine: machine,

    // reference to the current applicaion
    application: machine.appData,

    // reference to the current page
    page: machine.page,

    // helper method to get state value from current context
    getStateValue: machine.getStateValue,

    // helper method to invoke component events
    invoke: machine.invokeEvent,

    // helper method to register component DOM references
    register: machine.register,

    bindText: machine.bindText,
  };

  // get list of components from the currently loaded page, or application if no page is detected
  const componentItems = !currentPage
    ? appData.components
    : currentPage.components;

  // sort components by their order property
  const pageComponents = componentItems?.sort((a, b) =>
    a.order > b.order ? 1 : -1
  );
  // const applicationComponents = appData.components.sort((a, b) =>
  //   a.order > b.order ? 1 : -1
  // );

  const sx = reduceStyles(currentPage.styles);

  return (
    <>
      <InvokeErrorModal invoker={machine.invoker} />
      <Helmet>
        <title>{titleParts.join(" | ")}</title>
      </Helmet>
      {/* // context provider proved to be useless :-( */}
      <Panel>
        <Card
          sx={{
            height: (theme) => `calc(100vh - ${theme.spacing(5)})`,
            overflow: "auto",
            ...sx,
          }}
          spacing={1}
        >
          {!!pageComponents && (
            <ComponentPreview
              {...previewProps}
              componentList={pageComponents}
              components={pageComponents.filter(
                (f) => !pageComponents.find((p) => p.ID === f.componentID)
              )}
            />
          )}
        </Card>
        <Columns columns="1fr 1fr" sx={{ height: 32 }}>
          <Flex>
            <TinyButton sx={{ color: "white" }} icon="Apps" />
            <Nowrap variant="caption" sx={{ color: "white" }}>
              Built with Reactly
            </Nowrap>
          </Flex>
          <Flex>
            <Spacer />
            <Typography sx={{ color: "white" }} variant="caption">
              An xstate web application
            </Typography>
          </Flex>
        </Columns>
      </Panel>
    </>
  );
}
