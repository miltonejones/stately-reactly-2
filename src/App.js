import "./App.css";
import { useReactly } from "./machines/reactlyMachine";
import ComponentTree from "./components/lib/ComponentTree/ComponentTree";
import MachineDebugger from "./components/lib/MachineDebugger/MachineDebugger";

function App() {
  const main = useReactly();
  return (
    <div>
      <ComponentTree machine={main} />
      {!!main.debugging && <MachineDebugger machines={main.machineList} />}
    </div>
  );
}

export default App;
