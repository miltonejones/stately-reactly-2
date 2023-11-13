import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

export default function CodePane({ children, setInnerText, ...props }) {
  const sx = {
    minHeight: "calc(100% - 40px)",
  };
  return (
    <SyntaxHighlighter
      contentEditable
      spellCheck="false"
      onKeyUp={(e) => !!setInnerText && setInnerText(e.target.innerText)}
      {...props}
      customStyle={{
        overflow: "auto",
        fontSize: "0.9em",
        minWidth: "100%",
      }}
      language="javascript"
      style={docco}
    >
      {children}
    </SyntaxHighlighter>
  );
}
