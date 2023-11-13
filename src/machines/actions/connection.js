import { assign } from "xstate";
import generateGuid from "../../util/generateGuid";
import encrypt from "../../util/encrypt";

export const connectionActions = {
  actions: {
    assignConnections: assign((_, event) => {
      const connectionProps = {
        resources: event.resources,
        connections: event.connections,
      };
      // const firstConnection = event.connections[0];
      // const connectionID = firstConnection?.ID;
      return {
        connectionProps,
        // connectionID,
        // chosenConnection: firstConnection,
      };
    }),

    assignFirstConnection: assign((context) => {
      const { connections } = context.connectionProps;
      const firstConnection = connections[0];
      const connectionID = firstConnection?.ID;
      return {
        connectionID,
        chosenConnection: firstConnection,
      };
    }),

    assignSelectedConnection: assign((context, event) => {
      const { connections } = context.connectionProps;
      const connectionID = event.ID;
      const chosenConnection = connections.find((c) => c.ID === connectionID);

      return {
        connectionID,
        chosenConnection,
      };
    }),

    assignStateProps: assign((_, event) => ({
      stateProps: event.attr,
    })),
    assignSelectedResource: assign((context, event) => {
      const { resources } = context.connectionProps;
      const resourceID = event.ID;
      const chosenResource = resources.find((c) => c.ID === resourceID);
      return {
        resourceID,
        chosenResource,
      };
    }),

    assignConnectionDropMessage: assign((context) => ({
      message: `Are you sure you want to delete connection ${context.chosenConnection.name}?`,
      caption: "This action cannot be undone!",
    })),

    assignResourceDropMessage: assign((context) => ({
      message: `Are you sure you want to delete resource ${context.chosenResource.name}?`,
      caption: "This action cannot be undone!",
    })),

    dropCurrentResource: assign((context, event) => {
      return {
        dirty: true,
        message: null,
        caption: null,
        chosenResource: null,
        connectionProps: {
          ...context.connectionProps,
          resources: context.connectionProps.resources.filter(
            (res) => res.ID !== context.resourceID
          ),
        },
      };
    }),

    dropCurrentConnection: assign((context, event) => {
      return {
        dirty: true,
        message: null,
        caption: null,
        chosenConnection: null,
        connectionProps: {
          ...context.connectionProps,
          connections: context.connectionProps.connections.filter(
            (res) => res.ID !== context.connectionID
          ),
          resources: context.connectionProps.resources.filter(
            (res) => res.connectionID !== context.connectionID
          ),
        },
      };
    }),

    assignEncryptedProp: assign((context, event) => {
      const chosenConnection = {
        ...context.chosenConnection,
        [event.name]: null,
        config: {
          ...context.chosenConnection.config,
          [event.name]: encrypt(event.value),
        },
      };

      return {
        dirty: true,
        chosenConnection,
        connectionProps: {
          ...context.connectionProps,
          connections: context.connectionProps.connections.map((res) =>
            res.ID === chosenConnection.ID ? chosenConnection : res
          ),
        },
      };
    }),

    updateSelectedConnection: assign((context, event) => {
      const { connections } = context.connectionProps;

      const chosenConnection = connections.find(
        (c) => c.ID === context.connectionID
      );

      const updatedConnection = {
        ...chosenConnection,
        [event.name]: event.value,
      };

      return {
        dirty: true,
        chosenConnection: updatedConnection,
        connectionProps: {
          ...context.connectionProps,
          connections: context.connectionProps.connections.map((res) =>
            res.ID === chosenConnection.ID ? updatedConnection : res
          ),
        },
      };
    }),

    updateSelectedResource: assign((context, event) => {
      const { resources } = context.connectionProps;
      const chosenResource = resources.find((c) => c.ID === context.resourceID);

      const updatedResource = {
        ...chosenResource,
        [event.name]: event.value,
      };

      return {
        dirty: true,
        chosenResource: updatedResource,
        connectionProps: {
          ...context.connectionProps,
          resources: context.connectionProps.resources.map((res) =>
            res.ID === chosenResource.ID ? updatedResource : res
          ),
        },
      };
    }),
    clearSelectedConnection: assign({
      connectionID: null,
      resourceID: null,
      tableList: null,
      chosenResource: null,
      chosenConnection: null,
    }),
    clearSelectedResource: assign({ resourceID: null, tableList: null }),
    assignClose: assign({
      connectionProps: { resources: [], connections: [] },
    }),
    assignClean: assign({
      dirty: false,
    }),
    clearTestResult: assign({
      testResponse: null,
    }),
    assignTables: assign((_, event) => ({
      tableList: event.data,
    })),
    assignColumns: assign((_, event) => {
      return {
        columnList: event.data,
      };
    }),
    assignTestResult: assign((_, event) => ({
      testResponse: event.data,
    })),
    appendConnection: assign((context) => {
      const ID = generateGuid();
      const newConnection = {
        ID,
        type: "rest",
        root: "",
        name: context.name,
      };
      return {
        dirty: true,
        connectionID: ID,
        connectionProps: {
          ...context.connectionProps,
          connections:
            context.connectionProps.connections.concat(newConnection),
        },
      };
    }),
    appendResource: assign((context) => {
      const ID = generateGuid();
      const newResource = {
        ID,
        connectionID: context.connectionID,
        name: context.name,
        path: "",
        method: "GET",
        format: "rest",
        node: "",
        appID: "",
        transform: "",
        body: null,
        values: [],
        columns: [],
        events: [],
      };
      return {
        dirty: true,
        resourceID: ID,
        connectionProps: {
          ...context.connectionProps,
          resources: context.connectionProps.resources.concat(newResource),
        },
      };
    }),
    appendTerm: assign((context, event) => {
      const { resources } = context.connectionProps;
      const chosenResource = resources.find((c) => c.ID === context.resourceID);
      const updatedResource = {
        ...chosenResource,
        values: chosenResource.values.concat({
          key: context.name,
          value: "",
        }),
      };
      return {
        dirty: true,
        connectionProps: {
          ...context.connectionProps,
          resources: context.connectionProps.resources.map((res) =>
            res.ID === chosenResource.ID ? updatedResource : res
          ),
        },
      };
    }),
    assignNewName: assign((_, event) => ({
      name: event.name,
    })),
  },
};
