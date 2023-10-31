import { Helmet } from "react-helmet";

export default function PageTitle({ machine }) {
  const title = [
    "Reactly",
    machine.appData?.Name,
    machine.page?.PageName,
    machine.selectedComponent?.ComponentName,
  ].filter((f) => !!f);

  return (
    <>
      <Helmet>
        <title>{title.join(" - ")}</title>
      </Helmet>
    </>
  );
}
