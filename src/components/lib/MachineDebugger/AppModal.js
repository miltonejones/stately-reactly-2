import { useCode } from "../../../machines/codeMachine";
import { TinyButton } from "../../../styled/TinyButton";
import CodeModal from "./CodeModal";

export default function AppModal({ actions, tag }) {
  const coder = useCode();

  return (
    <>
      <TinyButton
        icon="Code"
        onClick={() => {
          coder.send({
            type: "load",
            actions,
          });
        }}
      />

      {!!coder.machineActions && (
        <CodeModal tag={tag} name="Util" coder={coder} />
      )}
    </>
  );
}
