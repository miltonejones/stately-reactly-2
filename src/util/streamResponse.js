export const streamResponse = async (response, fn) => {
  // Read the response as a stream of data
  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let innerText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    // Massage and parse the chunk of data
    const chunk = decoder.decode(value);
    const lines = chunk.split("\n");

    const filteredLines = lines
      .map((line) => line.replace(/data: /, "").trim())
      .filter((line) => line !== "" && line !== "[DONE]");

    const parsedLines = filteredLines.map((line) => JSON.parse(line));

    for (const parsedLine of parsedLines) {
      const { choices } = parsedLine;
      const { delta } = choices[0];
      const { content } = delta;
      // Update the UI with the new content
      if (content) {
        innerText += content;
        fn && fn(innerText);
        // console.log({ innerText });
      }
    }
  }

  return { innerText };
};
