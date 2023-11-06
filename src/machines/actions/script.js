import { assign } from "xstate";
import generateGuid from "../../util/generateGuid";

const scopeFind = (props) => (f) => !!props[f] && !!props[f].length;
function toCamelCase(str) {
  return str.replace(/\s(.)/g, function (match, group1) {
    return group1.toUpperCase();
  });
}

export const scriptActions = {
  actions: {
    assignScript: assign((_, event) => {
      const scriptProps = {
        page: event.scripts,
        application: event.appScripts,
      };
      const internalProps = { ...scriptProps };

      const scope = Object.keys(scriptProps).find(scopeFind(scriptProps));

      if (scope) {
        return {
          scope,
          scriptProps,
          internalProps,
          scriptID: scriptProps[scope][0].ID,
        };
      }
      return { internalProps, scriptProps };
    }),
    assignProblem: assign((_, event) => {
      return {
        error: event.data.message,
        stack: event.data.stack,
      };
    }),
    assignGPT: assign((_, event) => ({
      gptCode: event.text,
    })),
    acceptGPT: assign((context) => ({
      code: context.gptCode,
    })),
    unSwapId: assign((context) => ({
      scriptID: context.swappedId,
    })),
    swapId: assign((context) => ({
      scriptID: null,
      swappedId: context.scriptID,
    })),
    assignCode: assign((_, event) => ({
      code: event.code,
      gptCode: "Loading...",
    })),
    updateScriptCode: assign((context) => ({
      gptCode: "Loading...",
      scriptProps: {
        ...context.scriptProps,
        [context.scope]: context.scriptProps[context.scope].map((sc) =>
          sc.ID === context.scriptID ? { ...sc, code: context.code } : sc
        ),
      },
    })),
    assignNewName: assign((_, event) => ({
      name: event.name,
    })),
    appendScript: assign((context) => {
      const scriptID = generateGuid();
      return {
        dirty: true,
        scriptID,
        name: "",
        scriptProps: {
          ...context.scriptProps,
          [context.scope]: (context.scriptProps[context.scope] || []).concat({
            ID: scriptID,
            name: context.name,
            code: `function ${toCamelCase(
              context.name
            )} (page, options) {\n  // your code here\n}`,
          }),
        },
      };
    }),
    assignSelectedScript: assign((_, event) => ({
      scriptID: event.ID,
    })),
    assignScope: assign((_, event) => ({
      scope: event.scope,
    })),
    clearSelectedScript: assign((_, event) => ({
      scriptID: null,
      ID: event.ID,
    })),
    sendClose: assign({
      scriptProps: {
        page: [],
        application: [],
      },
    }),
  },
};
