import { assign, createMachine } from "xstate";
import getDynamoApplication from "../connector/getDynamoApplication";
import { useMachine } from "@xstate/react";
import { getApplication } from "../connector/getApplication";
import {
  resetApplicationClientLib,
  updateAppState,
  reassignAppData,
  updateBoundState,
  registerPackage,
} from "./actions/reactly";
import { useInvoke } from "./invokeMachine";
import { reactlyServiceProvider } from "./services/reactly";
import { stateRead } from "../util";

const actions = {
  assignAppName: assign((_, event) => {
    const { routeParams } = event;
    return {
      appName: event.name,
      routeParams,
    };
  }),

  assignAppData: assign((_, event) => ({
    appInfo: event.data,
  })),

  assignRouteData: assign((context) => {
    const { routeParams, appData } = context;

    const parts = !routeParams ? [] : routeParams.split("/");

    const addressPieces = parts
      .map((p) => appData?.pages.find((f) => f.PagePath === p))
      .filter(Boolean)
      .map((f) => f.PagePath);

    const pagePath = [...addressPieces].pop();
    const pathIndex = parts.indexOf(pagePath) + 1;
    const pathParams = parts.slice(pathIndex);

    const page = !pagePath
      ? appData.pages[0]
      : appData.pages.find((f) => f.PagePath === pagePath);

    if (pathParams && page?.parameters) {
      page.parameters = Object.keys(page.parameters).reduce(
        (out, key, index) => {
          out[key] = pathParams[index];
          return out;
        },
        {}
      );
    }

    return { page, pagePath, pathParams };
  }),

  assignAppJson: assign((_, event) => {
    const appData = event.data;
    return {
      appData,
    };
  }),
  resetApplicationClientLib,
  reassignAppData,
  updateAppState,
  updateBoundState,
  registerPackage,
};

const viewerMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QDcCWYDuYBOA6VEANmAMSED2AhhAASUAO9A2gAwC6io95sqALqnIA7TiAAeiALQAWAJwBmXPNkBWFgDYATCoAcm6S1nqVAGhABPKZoDsK3LJYtp1hSxeqVAX09m0mHLgM9ISoAMaUAsI05PRgQrgU1HSMNBBgfJSohLAkEMJg+ELI5ADWBX5YeEEh4ZFC0bHxibRBqemZ2QioReS1gkKsbIOi3Lx1ohIIkiqaOvY60uoAjEvqBiyr1maWCEs2uCs6KtLy8voO6jrevuiVgYw1Ef0NcQlULSkQEZS5+YXFZVwFQC1TCTyiMVezWS9FS3y6PT6wkGwyQIFG-H6Eyke3UuBYmjcmiMsk08h0S22iBsLHxbh08nUZzJLk01xAwLw9EoMBeQhI2DAUFQsD4OFRXB4mOE2IQtjmsms5KW8iWOlkOkuWwsUjO0lwulWWiWshNChV7M5uG5vMh-IArvQvmKaKKImAJeipeM0ZMlixGbhZotpCaVKaNeoqVM9QaKdZtNZ1UzdJbbgEbWA+SQAEbdWhusWejE+0B+1V4txLRYE6wrQ7RySxw3qY0R83yNP+Lk8rN2kiO51ZoLF71Y32IWyKPSa43qWzSFSUnUII5LONuOSaYy6TRsnwc9M922NAdO90wphLDhokvjsuIFVMpTSbQ2Pb+pM6aMOTRKJUqHW8iLk4pxdncmZ8oUmKUCEABeWaZiQo5jPe4jUou9jWMY8jYTM-qqtG0gUrgr51hsRwnAsrbgRmvZQd0MHwYhvbIdeIxjjKE4IDM+oKIS6iKkuGxOERJFkf6arHOSizqLRx59o0bxJKCSL1GAyBxHwOShOQAC2wTpB67AcahXEPnK8h2PoegrJoqw2Am0bLLI+IGMochOGoDLyda9F2sptCQRpWmwH59qwFmABm5DYDQIVCNpJBiIWBSUFFYrYAAFGoLAAJQkFakEBdCwWaYlYXchF0WxfF5XaSh0oiNx-qYZqVZGm+pxEfItIsEuxjqmavXWL5xVKaV9EJdp4WRTQMVxdNOQpRkYqBBlOA5Y4BVFf5E3vDQZWhbNNWLfVsBXjekpmc1Fn+s+gGyIseizKqLDfiuKq0ksdbLNhtgqjoThjXtUIHUdFWBYdU3nSQukGcQRYmbenG3ehuyhpWi7WAmKjKMSsyNmsSjaJGuEmp+cnskI5BpPAaKcqZTWypITJzFur7GK2QnSI2ajWcYChrrYBI+QeVoEMQTOlujMhHPiuFLqcOPVpcjahtYuB4U9KxaIyKg0eLR73MEYJ1Hy0toZM0wOKRpKcwbgkLo2rVKIBhhPWo5pkr5qngvUJUHa0aQZFk9PXcz3HTK+dv6Nujs8y7eJHHWexWbY4a9fuNzdibjzm4HKmfN8lvmbLS7rr1exGJqGoUvI0azLSRiGEcM4Gz7Ru5+NcSl2jfo4wcxEGKaSxqGPGgu0uuB6OGSqLDMeijV3EGg-EjECLBqAIdDMB97Kr1BgGKyKoJegaFGK5WZXhIEsc1jEfZxggyeYNF6bal1aF+-cXudjVgsQwKxx5qEvjsdQ715iY2UF5SSL9FJvyCjDb+KMbqyiVH+V8jhz5HD1NGVUmsVADRsO1O+ncc6r1fk0cGyDIZVTmgtL+FUf4WSTLSLB71CS4P0ERWYBoBqMiNIyHQCx4FQUmryJaUMIbaRYejFUSp5gEM-MRIhH0dgGDsP1VY1ZVCnEVNnQ83c15+V5M0SAci-QrH1L1CBcg5DKE1Ordc4YnrSBOAoRUFJpDeG8EAA */
    id: "viewer",
    initial: "idle",
    context: {
      preview: "on",
      clientLib: {
        application: {},
        page: {},
        event: {},
        parameters: {},
        resources: {},
        modals: {},
        setups: {},
      },
    },
    states: {
      idle: {
        on: {
          "load app": {
            target: "application open",
            actions: "assignAppName",
          },
        },
      },

      "application open": {
        states: {
          "load app details": {
            invoke: {
              src: "getAppByName",
              onDone: {
                target: "load app data",
                actions: "assignAppData",
              },
            },
          },

          "load app data": {
            invoke: {
              src: "getAppJson",

              onDone: {
                target: "#viewer.page open",
                actions: [
                  "assignAppJson",
                  "assignRouteData",
                  "resetApplicationClientLib",
                ],
              },
            },
          },
        },

        initial: "load app details",
      },

      "page open": {
        states: {
          "initialize page": {
            always: [
              {
                target: "load application events",
                cond: "application has events",
              },
              "load page events",
            ],
          },

          "load application events": {
            on: {
              complete: {
                target: "load page events",
                actions: "reassignAppData",
              },
            },

            invoke: {
              src: "invokeApplicationLoad",
            },
          },

          "load page events": {
            states: {
              "pause for events": {
                after: {
                  500: [
                    {
                      target: "load page events",
                      cond: "page has events",
                    },
                    "#viewer.page open.page loaded",
                  ],
                },
              },

              "load page events": {
                on: {
                  complete: {
                    target: "#viewer.page open.page loaded",
                    actions: "reassignAppData",
                  },
                },

                invoke: {
                  src: "invokePageLoad",
                },
              },
            },

            initial: "pause for events",
          },

          "page loaded": {},
        },

        initial: "initialize page",

        on: {
          register: {
            actions: "registerPackage",
          },

          "update state": {
            // target: "ready",
            actions: "updateAppState",
          },

          "bind state": {
            actions: "updateBoundState",
          },
          "update app": [
            {
              // target: "page open",
              internal: true,
              cond: "event contains no nav info",
              actions: "reassignAppData",
            },
            {
              // target: "page open",
              internal: true,
            },
          ],
        },
      },
    },
  },
  {
    guards: {
      "event contains no nav info": (_, event) =>
        !event.application?.navigation,
      "application has events": (context) => context.appData.events?.length,
      "page has events": (context) => context.page.events?.length,
    },

    actions,
  }
);

export const useViewer = () => {
  // invoker handles application/page/component/data events
  const invoker = useInvoke(
    (app, lib) => {
      send({
        type: "complete",
        application: app,
        clientLib: lib,
      });
    },
    (app, lib) => {
      send({
        type: "update app",
        application: app,
        clientLib: lib,
      });
    }
  );

  const {
    invokeApplicationLoad,
    invokePageLoad,
    invokeEvent: invoke,
  } = reactlyServiceProvider.create(invoker);

  const services = {
    getAppJson: async (context) => {
      return await getApplication(context.appInfo.objectKey.S);
    },
    getAppByName: async (context) =>
      await getDynamoApplication(context.appName),
    invokeApplicationLoad,
    invokePageLoad,
  };
  const [state, send] = useMachine(viewerMachine, { services });

  // global method to get property values based on current context
  const getStateValue = (value) =>
    stateRead({
      value,
      page: state.context.page,
      application: state.context.appData,
      clientLib: state.context.clientLib,
    });

  // global method to register components with the platform
  const register = (key, setup) => {
    send({
      type: "register",
      key,
      setup,
    });
  };

  // send message to bind a state value
  const bindText = (name, value) => {
    send({
      type: "bind state",
      name,
      value,
    });
  };

  // helper function for components to invoke events
  const invokeEvent = (events, eventType, options, e) => {
    const { page, appData, clientLib } = state.context;
    const invokeProps = {
      events,
      eventType,
      options,
      e,
      page,
      appData,
      clientLib,
      state,
      send,
      preview: "on",
    };
    invoke(invokeProps);
  };

  return {
    state,
    send,
    ...state.context,
    getStateValue,
    register,
    actions,
    invokeEvent,
    bindText,
    services,
    states: viewerMachine.states,
  };
};
