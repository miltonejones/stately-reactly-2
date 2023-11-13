import "./App.css";
import { useReactly } from "./machines/reactlyMachine";
import ComponentTree from "./components/lib/ComponentTree/ComponentTree";
import MachineDebugger from "./components/lib/MachineDebugger/MachineDebugger";
import { AppStateContext } from "./context";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { useViewer } from "./machines/viewerMachine";
import React from "react";
import ComponentPreview from "./components/lib/ComponentTree/ComponentPreview";
import ComponentView from "./components/lib/ComponentView/ComponentView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppEdit />} />
        <Route path="/app/:appname" element={<AppView />} />
        <Route path="/app/:appname/*" element={<AppView />} />
      </Routes>
    </BrowserRouter>
  );
}

function AppView() {
  const main = useViewer();

  return (
    // context provider proved to be useless :-(
    <AppStateContext.Provider value={{ ...main.state.context }}>
      <ComponentView machine={main} />
    </AppStateContext.Provider>
  );
}

function AppEdit() {
  const main = useReactly();
  return (
    // context provider proved to be useless :-(
    <AppStateContext.Provider value={{ ...main.state.context }}>
      <ComponentTree machine={main} />
      {!!main.debugging && <MachineDebugger machines={main.machineList} />}
    </AppStateContext.Provider>
  );
}

export default App;
