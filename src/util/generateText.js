import { streamResponse } from "./streamResponse";

/**
 * Generates text using OpenAI's GPT-3 API
 * @async
 * @function
 * @param {string[]} messages - Array of strings representing the conversation history
 * @param {number} temperature - A number between 0 and 1 representing the creativity of the generated text
 * @returns {Promise<Object>} - A Promise that resolves with an object representing the generated text
 */
export const generateText = async (
  messages,
  temperature,
  max_tokens = 512,
  fn
) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.REACT_APP_CHAT_GPT_API_KEY}`,
    },
    body: JSON.stringify({
      messages,
      temperature,
      model: "gpt-3.5-turbo",
      max_tokens,
      stream: !!fn, // Convert fn to a boolean value
    }),
  };

  /**
   * Sends a POST request to OpenAI's API and returns a Promise that resolves with the response JSON
   * @async
   * @function
   * @param {string} url - The URL to send the request to
   * @param {Object} options - The options to include in the request
   * @returns {Promise<Object>} - A Promise that resolves with the response JSON
   */
  const response = await fetch(
    "https://api.openai.com/v1/chat/completions",
    requestOptions
  );

  // If the response is not ok, throw an error
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message);
  }
  // If fn is not defined, return the response as JSON
  if (!fn) {
    return await response.json();
  }

  // If fn is defined, stream the response and return it as JSON
  return streamResponse(response, fn);
};

const create = (content, name) => {
  const assignCmd = !name
    ? ""
    : `Format the returned code thusly:
  const ${name} = assign(/* GENERATED CODE GOES HERE */);
  
  So that the function you create is actually an argument in the "assign" 
  function and returned to the variable declared as "${name}"`;

  return [
    {
      role: "system",
      content: `You are a verbose and meticulous software development assistant. 
     Take any code you are given and rewrite it to be more legible and efficient.
     add verbose comments in JSDoc format.

     ${assignCmd}
      `,
    },
    { role: "user", content },
  ];
};

const confirm = () => [
  {
    role: "system",
    content: `You are an over-dramatic and sarcastic software development assistant. 
     You have just spent many expensive tokens generating code.`,
  },
  {
    role: "user",
    content: `Create a polemic confirmation message asking the user 
  if they are sure they want to exit without copying the generated code first. 
  Use 50 words or less but be sure to mention the amount of effort wasted`,
  },
];

const codeCheck = async (code, name, fn) => {
  return await generateText(create(code, name), 0.1, 2048, fn);
};

export const confirmClose = async (fn) => {
  return await generateText(confirm(), 1, 256, fn);
};

export default codeCheck;
