import invokeResource from "../../connector/invokeResource";
import getScriptList from "../../util/getScriptList";
import stateCompare from "../../util/stateCompare";

const stateReduce = (state) => {
  if (!state) return {};
  return state.reduce((out, st) => {
    out[st.Key] = st.Value;
    return out;
  }, {});
};

const scriptRun = async (context) => {
  const { page: selectedPage, application, options, currentEvent } = context;
  const { action, componentID } = currentEvent;
  const { target } = action;

  const { resourceData, setupData } = application;

  const scriptList = getScriptList(application);
  const script = scriptList.find((f) => f.ID === target);

  console.log('entering scriptRun for %c"%s"', "color: lime", script.name);

  const data = !resourceData ? null : resourceData[componentID];

  let updatedApp = {
    ...application,
  };

  const scriptData = {
    ...data,
    ...options,
    rows: resourceData?.rows,
  };

  if (script) {
    const scriptOpts = {
      pagename: selectedPage?.PagePath,
      application,
      data: scriptData,
      state: stateReduce(selectedPage?.state),
      setState: (fn) => {
        if (!selectedPage) {
          return console.log(
            `setState is being called in page scope by "${script.name}" but there is no page.`
          );
        }
        const states = selectedPage.state.reduce((out, st) => {
          out[st.Key] = st.Value;
          return out;
        }, {});
        const updated = fn(states);

        const oldPage = { ...selectedPage };

        Object.assign(selectedPage, {
          state: selectedPage.state.map((item) =>
            updated.hasOwnProperty(item.Key)
              ? {
                  ...item,
                  Value:
                    item.Type === "boolean"
                      ? !!updated[item.Key]
                      : updated[item.Key],
                  added: "special",
                  by: script.name,
                }
              : item
          ),
        });

        updatedApp.pages = updatedApp.pages.map((p) =>
          p.ID === selectedPage.ID ? selectedPage : p
        );

        const diff1 = stateCompare(oldPage.state, selectedPage.state);
        diff1.map((diff) =>
          console.log(
            `  %c"%s" was altered by script "%s" from %O to %O`,
            "color:lime",
            diff.Key,
            script.name,
            diff.Value,
            diff.change
          )
        );

        // console.log({ states, app: updated, selectedPage, updatedApp });
      },
      application: {
        getState: async () => stateReduce(updatedApp.state),
        state: stateReduce(updatedApp.state),
        setState: (fn) => {
          const states = updatedApp.state.reduce((out, st) => {
            out[st.Key] = st.Value;
            return out;
          }, {});
          const updated = fn(states);

          const oldApp = { ...updatedApp };

          Object.assign(updatedApp, {
            state: updatedApp.state.map((item) =>
              updated.hasOwnProperty(item.Key)
                ? {
                    ...item,
                    Value:
                      item.Type === "boolean"
                        ? !!updated[item.Key]
                        : updated[item.Key],
                    added: "special",
                    by: script.name,
                  }
                : item
            ),
          });

          const diff1 = stateCompare(oldApp.state, updatedApp.state);
          diff1.map((diff) =>
            console.log(
              `  %c"application.%s" was altered by script "%s" from %s to %s`,
              "color:magenta",
              diff.Key,
              script.name,
              diff.Value,
              diff.change
            )
          );

          // console.log({ states, app: updated, updatedApp });
        },
      },
      api: {
        openPath: (path, data) => {
          // alert(JSON.stringify({ path, data }, 0, 2));

          Object.assign(updatedApp, {
            navigation: {
              path,
              data,
            },
          });
        },
        Alert: (msg) =>
          alert(`Alert from ${script.name}\n${JSON.stringify(msg, 0, 2)}`),
        shout: (msg, title) => alert(title + "\n" + JSON.stringify(msg, 0, 2)),
        execRefByName: (name, fn) => {
          const component = application.components.find(
            (f) => f.ComponentName === name
          );
          if (component) {
            const ref = context.setupData[component.ID];
            if (ref) {
              return fn(ref);
            }
          }

          alert(`Request to execute ${name}`);
          fn({
            play: () => alert("play was requested"),
          });
        },
        getResourceByName: (name) => {
          const scriptName = script.name;
          console.log(scriptName, `Getting resource "${name}"`);
        },
        execResourceByName: async (name, params) => {
          const scriptName = script.name;
          console.log(
            scriptName,
            `Executing resource "${name}" with params "${params}"`
          );
          const { resources, connections } = application;
          const resource = resources.find((f) => f.name === name);
          const connection = connections.find(
            (f) => f.ID === resource.connectionID
          );

          const result = await invokeResource(connection, resource, params);
          const data = resolveRows(result, resource.node.split("/"));

          console.log({ result, data });
          return data;
        },
        executeScriptByName: async (name, data) => {
          const scriptName = script.name;
          const child = scriptList.find((f) => f.name === name);
          console.log(
            scriptName,
            `Executing child script "${child.page}.${child.name}"`
          );
          await exec(child.code, selectedPage, { ...scriptOpts, data });
        },
      },
    };

    const result = await exec(script.code, selectedPage, scriptOpts);
    Object.assign(updatedApp, { result });

    console.log('returning updatedApp from %c"%s"', "color: red", script.name);
    console.log({ tada: updatedApp });

    return updatedApp;
  }

  return updatedApp;
};

const exec = async (code, page, scriptOpts) => {
  const codeBlock = `function runscript() { return ${code} }`;
  const action = eval(`(${codeBlock})()`);
  return await action(page, scriptOpts);
};

export default scriptRun;

function resolveRows(object, node) {
  const key = node.shift();
  const descendent = object[key];
  if (!!node.length) {
    return resolveRows(descendent, node);
  }

  return descendent;
}