import Flex from "./Flex";
import { TinyButton } from "./TinyButton";

export default function Warning({ children, ...props }) {
  return (
    <Flex {...props}>
      <TinyButton icon="Error" />
      {children}
    </Flex>
  );
}
