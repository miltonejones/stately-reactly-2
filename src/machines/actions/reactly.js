import { assign } from "xstate";
import editPage from "../../util/editPage";
import { cleanApp } from "../../util/cleanApp";
import generateGuid from "../../util/generateGuid";
import { stateValue } from "../../util/stateValue";
import { editComponent } from "../../util";
import editResource from "../../util/editResource";
// import editState from "../../util/editState";
import stateRead from "../../util/stateRead";
import stateReduce from "../../util/stateReduce";

export const assignAppToKey = assign((context, event) => {
  const current = context.appKeys[context.key_index];
  const content = event.data;
  if (content?.isDeleted) {
    return {
      key_index: context.key_index + 1,
      recycledApps: context.recycledApps.concat(content),
    };
  }
  return {
    appKeys: context.appKeys.map((app) => {
      return app.Key === current.Key
        ? {
            ...app,
            content,
          }
        : app;
    }),
    key_index: context.key_index + 1,
  };
});

export const assignAppKeys = assign((_, event) => ({
  appKeys: event.data, //?.Contents,
  key_index: 0,
}));

export const assignConfigurationUpdate = assign((context, event) => {
  const { node, scope, value } = event;
  if (scope === "application") {
    return {
      appData: {
        ...context.appData,
        [node]: value,
        dirty: true,
      },
    };
  }
  const { page: currentPage, appData } = context;
  const updatedPage = {
    ...currentPage,
    [node]: value,
  };
  const updatedApp = {
    ...appData,
    dirty: true,
    pages: appData.pages.map((page) =>
      page.ID === updatedPage.ID ? updatedPage : page
    ),
  };

  return {
    appData: updatedApp,
    page: updatedPage,
  };
});

export const assignSetting = assign((_, event) => ({
  selectedSetting: {
    ...event.setting,
    category: event.setting.category || "",
    alias: event.setting.alias || "",
  },
}));

export const assignStateList = assign((context) => {
  const { appData, page } = context;

  const applicationScripts = appData.pages.reduce((out, pg) => {
    if (!pg.scripts?.length) return out;
    pg.scripts.map((sc) => {
      out.push({
        ...sc,
        page: pg.PageName,
      });
    });
    return out;
  }, []);

  const modalTypes = ["Dialog", "Collapse", "Menu", "Drawer", "Snackbar"];

  const appEvents = appData.pages.reduce((out, pg) => {
    if (pg.components?.length) {
      pg.components.map((sc) => {
        if (!sc.events.length) return;
        sc.events.map((ev) => {
          out.push({
            ...ev,
            owner: sc.ComponentName,
            page: pg.PageName,
            componentID: sc.ID,
          });
        });
      });
    }
    if (pg.events?.length) {
      pg.events.map((ev) => {
        out.push({
          ...ev,
          owner: pg.PageName,
          page: pg.PageName,
          pageID: pg.ID,
        });
      });
    }
    return out;
  }, []);

  if (appData.components?.length) {
    appData.components.map((sc) => {
      if (!sc.events.length) return;
      sc.events.map((ev) => {
        appEvents.push({
          ...ev,
          owner: sc.ComponentName,
          page: "application",
        });
      });
    });
  }

  if (appData.resources?.length) {
    appData.resources.map((res, e) => {
      if (!res.events.length) return;
      res.events.map((ev) => {
        appEvents.push({
          ...ev,
          owner: res.name,
        });
      });

      if (res.transform) {
        appEvents.push({
          ID: e,
          event: "transform",
          page: "application",
          owner: res.name,
          action: {
            target: res.transform,
          },
        });
      }
    });
  }

  const modalTags = appData.pages.reduce((out, pg) => {
    if (!pg.components?.length) return out;
    pg.components
      .filter((c) => modalTypes.some((t) => t === c.ComponentType))
      .map((sc) => {
        out.push({
          ...sc,
          page: pg.PageName,
        });
      });
    return out;
  }, []);

  appData.components
    .filter((c) => modalTypes.some((t) => t === c.ComponentType))
    .map((sc) => {
      modalTags.push({
        ...sc,
        page: "application",
      });
    });

  appData.scripts.map((sc) => {
    applicationScripts.push({
      ...sc,
      page: "application",
    });
  });

  const stateReference = appData.state.reduce((out, item) => {
    out[`application.${item.Key}`] = item;
    return out;
  }, {});

  let stateAttr = stateReduce(appData.state, "application.");
  if (page) {
    stateAttr = {
      ...stateAttr,
      ...stateReduce(page.state),
    };
    page.state.map((item) => {
      stateReference[item.Key] = item;
    });
  }

  // const clientLib = {
  //   ...context.clientLib,
  //   application: stateReduce(appData.state),
  //   page: !page ? null : stateReduce(page.state),
  // };

  console.log({ stateAttr, stateReference });
  return {
    // clientLib,

    // reference object containing state key/value pairs
    // of state DEFINITIONS from the app and page contexts
    stateReference,

    // list of application/page client state variables
    stateList: Object.keys(stateReference),

    // list if Modal components in the current app context
    modalTags,

    // application wide list of scripts
    applicationScripts,

    // reference object containing state key/value pairs
    // DEPRECATE FOR CLIENT LIB
    stateAttr,

    // application wide list of events
    appEvents,
  };
});

export const resetApplicationClientLib = assign((context) => {
  const clientLib = {
    ...context.clientLib,
    application: stateReduce(context.appData.state),
    page: !context.page ? null : stateReduce(context.page.state),
  };
  console.log("%cclientLib", "color:yellow", { clientLib });
  return { clientLib };
});

export const assignConfirmMessage = assign((context) => ({
  message: `Do you want to close '${context.selectedComponent.ComponentName}'? You will lose your unsaved changes?`,
  action: "Okay",
}));

export const assignProblemMessage = assign((context) => ({
  message: `An error occurred. Continue editing?`,
  action: "Okay",
}));

export const assignNavEvent = assign((context, event) => {
  const { appData } = context;
  const { application } = event;
  const { navigation } = application;
  const { data, path } = navigation;

  const page = appData.pages.find((page) => page.PagePath === path);

  // const updatedPage = editPage(appData, page.ID, (page) => {
  //   Object.assign(page, { parameters: data });
  // });

  return {
    page,
    pageTab: 0,
    clientLib: {
      ...context.clientLib,
      parameters: data,
    },
    appData: {
      ...appData,
      PagePath: path,
    },
  };
});

export const assignNavigation = assign((context, event) => {
  if (!event.path) {
    return {
      pageTab: 0,
      page: null,
    };
  }
  const page = context.appData.pages.find(
    (page) => page.PagePath === event.path
  );
  return {
    page,
    pageTab: 0,
    appData: {
      ...context.appData,
      PagePath: event.path,
    },
  };
});

export const assignNewName = assign((_, event) => ({
  name: event.name,
}));

export const appendPageParam = assign((context, event) => {
  const { appData, page, name } = context;
  if (!name?.length) return;
  const updatedPage = editPage(appData, page.ID, (page) => {
    page.parameters = {
      ...page.parameters,
      [name]: "set value",
    };
  });

  return {
    page: updatedPage,
    appData: {
      ...appData,
      dirty: true,
    },
    name: "",
  };
});

export const assignClean = assign((context) => ({
  appData: cleanApp(context.appData),
}));

export const autoNameCreatedComponent = assign((context) => {
  const { createdComponent, page, appData } = context;
  const owner = page || appData;
  const alikes = owner.components.filter(
    (f) => f.ComponentType === createdComponent.ComponentType
  );
  const ComponentName = `${createdComponent.ComponentType}-${
    alikes.length + 1
  }`;

  return {
    createdComponent: {
      ...createdComponent,
      ComponentName,
    },
  };
});

export const openCreatedComponent = assign((context, event) => {
  const { createdComponent, page, appData } = context;
  const { componentID } = createdComponent;

  // const { Attributes } = Library.find(
  //   (t) => t.ComponentName === createdComponent.ComponentType
  // );

  // const props = JSON.parse(Attributes);

  // props.map((prop) => {
  //   if (prop.default) {
  //     const SettingValue =
  //       prop.type === "bool" ? prop.default !== "false" : prop.default;
  //     createdComponent.settings.push({
  //       SettingName: prop.title,
  //       SettingValue,
  //     });
  //   }
  // });
  // console.log({ createdComponent });
  // alert(JSON.stringify(createdComponent.settings, 0, 2));

  if (!!page) {
    const updatedPage = editPage(appData, page.ID, (page) => {
      page.components.push(createdComponent);
    });

    return {
      appData,
      updatedPage,
      selectedComponent: createdComponent,
      expandedNodes: {
        ...context.expandedNodes,
        [componentID]: true,
      },
    };
  }

  appData.components.push(createdComponent);
  return {
    appData,
    selectedComponent: createdComponent,
    expandedNodes: {
      ...context.expandedNodes,
      [componentID]: true,
    },
  };
});

export const modifyCreatedComponent = assign((context, event) => {
  const { createdComponent } = context;

  return {
    createdComponent: {
      ...createdComponent,
      [event.name]: event.value,
    },
  };
});

export const incrementOrder = assign((context) => ({
  defaultOrder: Number(context.defaultOrder) + 10,
}));

export const clearDefaultComponentParent = assign({
  parentId: null,
});

export const assignCreatedComponent = assign((context, event) => {
  const { parentId, appData, page, defaultOrder } = context;

  return {
    parentId: event.componentID || parentId,
    createdComponent: {
      ID: generateGuid(),
      pageID: page?.ID,
      // ComponentType: "Box",
      ComponentName: "New Component",
      appID: appData.ID,
      componentID: event.componentID || parentId,
      order: event.order || defaultOrder,
      defaultOrder: event.order || defaultOrder,
      styles: [],
      settings: [],
      events: [],
    },
  };
});

export const openCreatedPage = assign((context, event) => {
  const { createdPage, page, appData } = context;

  appData.pages.push(createdPage);
  return {
    appData,
    page: createdPage,
  };
});

export const modifyCreatedPage = assign((context, event) => {
  const { createdPage } = context;

  if (event.name === "PageName") {
    return {
      createdPage: {
        ...createdPage,
        [event.name]: event.value,
        PagePath: event.value.toLowerCase().replace(/\s/g, "-"),
      },
    };
  }

  return {
    createdPage: {
      ...createdPage,
      [event.name]: event.value,
    },
  };
});

export const assignCreatedPage = assign((context, event) => {
  const { appData } = context;
  return {
    createdPage: {
      ID: generateGuid(),
      PageName: "New Page",
      PagePath: "new-page",
      appID: appData.ID,
      pageID: event.pageID,
      components: [],
      events: [],
      state: [],
    },
  };
});

export const assignPath = assign((context) => ({
  path: context.appData.PagePath,
}));

export const assignDataFromPath = assign((context, event) => {
  const [appData] = event.data;

  const replacement = appData.pages.find(
    (page) => page.PagePath === context.path
  );

  const updatedApp = {
    ...context.appData,
    dirty: true,
    pages: context.appData.pages.map((page) =>
      page.ID === replacement.ID ? replacement : page
    ),
  };

  return {
    appData: updatedApp,
    page: replacement,
    pageTab: 0,
  };
});

export const assignAppLoading = assign({ appLoading: true });

export const assignAppLoaded = assign({ appLoading: false });

export const assignData = assign((_, event) => {
  const [appData] = event.data;
  const page = appData.pages.find((page) => page.PagePath === appData.PagePath);

  return {
    appData,
    page,
  };
});

export const assignAppDataFromDb = assign((context, event) => {
  const appData = event.data;
  return {
    appData: {
      ...appData,
      PagePath: "",
    },
  };
});

export const assignDataFromKey = assign((context, event) => {
  // const appNode = context.appKeys.find((f) => f.Key === event.key);
  // const appData = appNode.content;

  return {
    pageTab: 0,
    // appData: {
    //   ...appData,
    //   PagePath: "",
    // },
    page: null,
    currentKey: event.key,
  };
});

export const assignComponentData = assign((_, event) => {
  const componentData = event.data;
  if (!componentData?.Attributes) return;

  return {
    componentData: {
      ...componentData,
      Attributes: JSON.parse(componentData.Attributes),
    },
  };
});

export const assignBlankComponentData = assign((context) => {
  return {
    componentData: {
      ComponentName: context.selectedComponent.ComponentType,
      Attributes: [],
      Styles: 0,
      Icon: "",
    },
  };
});

export const assignBindings = assign((context) => {
  const { settings, boundProps } = context.selectedComponent;
  const { state: pageState } = context.page || {};
  if (!boundProps) return;
  let output = settings;

  // console.log({ assignBindings: output });

  boundProps.map((prop) => {
    const { boundTo, attribute } = prop;
    if (boundTo) {
      const [scope, key] = boundTo.split(".");

      if (scope === "application") {
        const boundProp = context.appData.state.find((s) => s.Key === key);
        if (boundProp) {
          output = output
            .filter((s) => s.SettingName !== attribute)
            .concat({
              SettingName: attribute,
              SettingValue: stateValue(boundProp),
            });
        }
        return prop;
      }
      if (!!pageState) {
        const boundProp = pageState.find((s) => s.Key === boundTo);
        if (boundProp) {
          output = output
            .filter((s) => s.SettingName !== attribute)
            .concat({
              SettingName: attribute,
              SettingValue: stateValue(boundProp),
            });
        }
      }
    }
    return prop;
  });

  const uniqueKeys = [...new Set(output.map((f) => f.SettingName))];
  const uniqueProps = uniqueKeys.map((key) =>
    output.find((obj) => obj.SettingName === key)
  );

  return {
    selectedComponent: {
      ...context.selectedComponent,
      settings: uniqueProps,
    },
  };
});

export const assignComponentProps = assign((context) => {
  const { page: currentPage, appData, componentID } = context;
  const componentItems = !currentPage
    ? appData.components
    : currentPage.components;

  const selectedComponent = componentItems.find(
    (comp) => comp.ID === componentID
  );

  return {
    selectedComponent,
    componentData: null,
  };
});

export const dropSelectedComponent = assign((context) => {
  const { selectedComponent, page, appData } = context;
  if (page) {
    const updatedPage = {
      ...page,
      components: page.components.filter((f) => f.ID !== selectedComponent.ID),
    };

    const updatedApp = {
      ...appData,
      dirty: true,
      pages: appData.pages.map((page) =>
        page.ID === updatedPage.ID ? updatedPage : page
      ),
    };

    return {
      page: updatedPage,
      appData: updatedApp,
      selectedComponent: null,
    };
  }

  const updatedApp = {
    ...appData,
    dirty: true,
    components: appData.components.filter((f) => f.ID !== selectedComponent.ID),
  };

  return {
    appData: updatedApp,
    selectedComponent: null,
  };
});

export const udpateStyle = assign((context, event) => {
  const { componentData } = context;

  if (event.allow) {
    return {
      componentData: {
        ...componentData,
        allowChildren: event.allow === "true",
      },
    };
  }

  if (event.actions) {
    return {
      componentData: {
        ...componentData,
        Events: event.actions,
      },
    };
  }

  if (event.icon) {
    return {
      componentData: {
        ...componentData,
        Icon: event.icon,
      },
    };
  }

  const updatedData = {
    ...componentData,
    Styles: event.value,
  };

  return {
    componentData: updatedData,
  };
});

export const udpateSetting = assign((context, event) => {
  const { selectedSetting, componentData } = context;
  const updatedSetting = {
    ...selectedSetting,
    [event.name]: event.value,
  };

  const exists = componentData.Attributes.some(
    (attr) => attr.title === selectedSetting.title
  );

  const updatedData = {
    ...componentData,
    Attributes: exists
      ? componentData.Attributes.map((attr) =>
          attr.title === selectedSetting.title ? updatedSetting : attr
        )
      : componentData.Attributes.concat(updatedSetting),
  };

  return {
    selectedSetting: updatedSetting,
    componentData: updatedData,
  };
});

export const remergeComponent = assign((context) => {
  const { selectedComponent, page: existingPage, appData } = context;

  if (!existingPage) {
    const updatedApp = {
      ...appData,
      dirty: true,
      components: appData.components.map((component) =>
        component.ID === selectedComponent.ID ? selectedComponent : component
      ),
    };
    return {
      appData: updatedApp,
    };
  }

  const updatedPage = {
    ...existingPage,
    components: existingPage.components.map((component) =>
      component.ID === selectedComponent.ID ? selectedComponent : component
    ),
  };

  const updatedApp = {
    ...appData,
    dirty: true,
    pages: appData.pages.map((page) =>
      page.ID === updatedPage.ID ? updatedPage : page
    ),
  };

  return {
    page: updatedPage,
    appData: updatedApp,
  };
});

export const unbindComponent = assign((context, event) => {
  const { selectedComponent } = context;
  const { attribute } = event;
  const updatedComponent = {
    ...selectedComponent,
    boundProps: (selectedComponent.boundProps || []).filter(
      (f) => f.attribute !== attribute
    ),
  };
  return {
    selectedComponent: updatedComponent,
  };
});

export const bindComponent = assign((context, event) => {
  const { selectedComponent } = context;
  const { boundTo, attribute, oppose } = event;

  const updatedComponent = {
    ...selectedComponent,
    boundProps: (selectedComponent.boundProps || [])
      .filter((f) => f.attribute !== attribute)
      .concat({
        boundTo,
        attribute,
        oppose,
      }),
  };
  return {
    selectedComponent: updatedComponent,
  };
});

export const dropEvent = assign((context, event) => {
  const { page, appData } = context;
  const { pageID, componentID, resourceID } = event;

  const upsert = (obj) => {
    obj.events = obj.events.filter((c) => c.ID !== event.ID);
    alert(JSON.stringify({ ev: obj.events, ID: event.ID }, 0, 2));
  };

  if (componentID) {
    const selectedComponent = editComponent(
      appData,
      pageID,
      componentID,
      upsert
    );

    if (page) {
      const updatedPage = appData.pages.find((p) => p.ID === page.ID);
      const updatedComponent = updatedPage.components.find(
        (p) => p.ID === componentID
      );
      return {
        appData,
        selectedComponent: updatedComponent,
        page: updatedPage,
      };
    }
    return { appData, selectedComponent };
  }

  if (!!pageID) {
    const updatedPage = editPage(appData, pageID, upsert);
    return { appData, page: updatedPage };
  }

  if (!!resourceID) {
    editResource(appData, resourceID, upsert);
    return { appData };
  }

  upsert(appData);
  return { appData };
});

export const upsertEvent = assign((context, event) => {
  const { page, appData } = context;
  const { step, pageID, componentID, resourceID } = event;

  const upsert = (obj) => {
    if (!obj.events) {
      obj.events = [];
    }
    const existing = obj.events.some((e) => e.ID === step.ID);
    obj.events = existing
      ? obj.events.map((c) => (c.ID === step.ID ? step : c))
      : obj.events.concat(step);
  };

  if (componentID) {
    const selectedComponent = editComponent(
      appData,
      pageID,
      componentID,
      upsert
    );

    if (page) {
      const updatedPage = appData.pages.find((p) => p.ID === page.ID);
      const updatedComponent = updatedPage.components.find(
        (p) => p.ID === componentID
      );
      return {
        appData,
        selectedComponent: updatedComponent,
        page: updatedPage,
      };
    }
    return { appData, selectedComponent };
  }

  if (!!pageID) {
    const updatedPage = editPage(appData, pageID, upsert);
    return { appData, page: updatedPage };
  }

  if (!!resourceID) {
    editResource(appData, resourceID, upsert);
    return { appData };
  }

  upsert(appData);
  return { appData };
});

export const applyJSON = assign((_, event) => ({
  selectedComponent: JSON.parse(event.json),
}));

export const updateComponent = assign((context, event) => {
  const { selectedComponent } = context;
  const {
    key,
    field,
    value,
    name,
    order,
    componentID,
    keyName = "SettingName",
    valueName = "SettingValue",
  } = event;

  let updatedComponent;
  if (componentID) {
    updatedComponent = {
      ...selectedComponent,
      componentID,
      dirty: true,
    };
  } else if (order) {
    updatedComponent = {
      ...selectedComponent,
      order,
      dirty: true,
    };
  } else if (name) {
    updatedComponent = {
      ...selectedComponent,
      ComponentName: name,
      dirty: true,
    };
  } else {
    const exists = selectedComponent[key].some(
      (setting) => setting[keyName] === field
    );
    const updated = {
      [keyName]: field,
      [valueName]: value,
    };

    const updatedSettings = exists
      ? selectedComponent[key].map((setting) =>
          setting[keyName] === field ? updated : setting
        )
      : selectedComponent[key].concat(updated);
    updatedComponent = {
      ...selectedComponent,
      dirty: true,
      [key]: updatedSettings,
    };
  }

  return {
    selectedComponent: updatedComponent,
  };
});

export const updatePage = assign((context, event) => {
  const { appData, page } = context;
  const { field, value, key } = event;

  if (!page) {
    return {
      appData: {
        ...appData,
        [field]: value,
        dirty: true,
      },
    };
  }

  const updatedPage = editPage(appData, page.ID, (page) => {
    if (key === "styles") {
      const { styles = [] } = page;
      const fresh = { Key: field, Value: value };
      const existing = styles.some((s) => s.Key === field);
      const updatedStyles = existing
        ? styles.map((s) => (s.Key === field ? fresh : s))
        : styles.concat(fresh);
      page.styles = updatedStyles;
      return;
    }
    page[field] = value;
  });

  return {
    appData: {
      ...appData,
      dirty: true,
    },
    page: updatedPage,
  };
});

export const registerPackage = assign((context, event) => {
  return {
    clientLib: {
      ...context.clientLib,
      setups: {
        ...context.clientLib.setups,
        [event.key]: event.setup,
      },
    },
  };
});

export const resetComponent = assign((context) => {
  return {
    componentID: context.selectedComponent.ID,
  };
});

export const assignComponent = assign((_, event) => {
  const componentID = event.ID;
  return {
    componentID,
  };
});

export const assignLibraryData = assign((_, event) => {
  const Library = event.data;
  const iconList = Library.filter((f) => !!f.Icon).reduce((out, key) => {
    out[key.ComponentName] = {
      icon: key.Icon,
      allowChildren: key.allowChildren,
      settings: JSON.parse(key.Attributes),
    };
    return out;
  }, {});
  // alert(JSON.stringify(iconList));
  return { iconList, Library };
});

export const assignComponentBindings = assign((context, event) => {
  const { selectedComponent } = context;

  const existing = selectedComponent.settings.some(
    (setting) => setting.SettingName === "bindings"
  );
  const bindingProp = {
    SettingName: "bindings",
    SettingValue: event.bindings,
  };
  const updatedSettings = existing
    ? selectedComponent.settings.map((setting) =>
        setting.SettingName === "bindings" ? bindingProp : setting
      )
    : selectedComponent.settings.concat(bindingProp);
  const updatedComponent = {
    ...selectedComponent,
    dirty: true,
    settings: updatedSettings,
  };
  return {
    selectedComponent: updatedComponent,
  };
});

export const clearComponent = assign({
  componentID: null,
  selectedComponent: null,
});

export const reassignAppData = assign((context, event) => {
  if (!event.application) return;
  const { clientLib } = event;
  const {
    modalData: rootModal,
    resourceData: rootResource,
    application,
    ...appData
  } = event.application;

  console.log("%cReassigning app data", "color:cyan", {
    clientLib,
  });
  // backwards compat for modals and resources
  const modalData = rootModal || application?.modalData;
  const resourceData = rootResource || application?.resourceData;

  console.log({ appData });

  const appContext = { appData };

  if (modalData) {
    console.log("  %cAdding modal data", "color:cyan");
    const { key, open } = modalData;
    Object.assign(appContext, {
      modalData: {
        ...context.modalData,
        [key]: open,
      },
    });
  }

  if (resourceData) {
    console.log("  %cAdding resource data", "color:cyan");
    const { key, rows, count } = resourceData;
    Object.assign(appContext, {
      resourceData: {
        ...context.resourceData,
        [key]: rows,
        count,
      },
    });
  }

  if (clientLib) {
    if (modalData) {
      console.log("  %cAdding modal data", "border:solid 2px lime;color:cyan");
      const { key, open } = modalData;
      Object.assign(clientLib, {
        modals: {
          ...clientLib.modals,
          [key]: open,
        },
      });
    }

    if (resourceData) {
      console.log(
        "  %cAdding resource data",
        "border:dotted 2px lime;color:cyan"
      );
      const { key, rows, count } = resourceData;
      Object.assign(clientLib, {
        resources: {
          ...clientLib.resources,
          [key]: rows,
          count,
        },
      });
    }

    Object.assign(appContext, { clientLib });
  }

  // const diff1 = stateCompare(context.appData.state, appData.state);
  // diff1.map((diff) =>
  //   console.log(
  //     `  %c"application.%s" was changed from %s to %s`,
  //     "color:lime",
  //     diff.Key,
  //     diff.Value,
  //     diff.change
  //   )
  // );

  if (context.page) {
    console.log("  %cUpdating page", "color:cyan");

    const page = appData.pages.find((p) => p.ID === context.page.ID);
    // const diff2 = stateCompare(context.page.state, page.state);
    // diff2.map((diff) =>
    //   console.log(
    //     `  %c"%s" was changed from %s to %s`,
    //     "color:lime",
    //     diff.Key,
    //     diff.Value,
    //     diff.change
    //   )
    // );

    Object.assign(appContext, { page });
  }

  console.log({ appContext });
  return appContext;
});

export const updateMachineContext = assign((_, event) => ({
  [event.name]: event.value,
}));

export const resetAppState = assign({
  appData: null,
  page: null,
  currentKey: null,
  modalTags: null,
  applicationScripts: [],
  stateAttr: {},
  appEvents: null,
  modalData: null,
  componentID: null,
  selectedComponent: null,
  path: null,
  componentTab: null,
  componentData: null,
  // Library: null,
  // iconList: null,
  appKeys: null,
  key_index: 0,
  stateList: [],
  recycledApps: [],
  view: 0,
});

export const updateBoundState = assign((context, event) => {
  const { page, appData, clientLib } = context;
  const { name, value } = event;

  // const updated = editState(
  //   appData,
  //   page?.ID,
  //   name,
  //   (state) => (state.Value = value)
  // );

  if (page) {
    return {
      clientLib: {
        ...clientLib,
        page: {
          ...clientLib.page,
          [name]: value,
        },
      },
      // page: updated,
      // appData,
    };
  }

  return {
    clientLib: {
      ...clientLib,
      application: {
        ...clientLib.application,
        [name]: value,
      },
    },
    // appData,
  };
});

export const getUpdatedAppState = (context, event) => {
  const { page, appData, clientLib } = context;
  const { step, options } = event;
  const { action } = step;
  const { target, value } = action;

  const [_, key] = typeof value !== "string" ? [] : value.split(".");

  let prop;

  if (!!key && options.item && options.item.hasOwnProperty(key)) {
    // if this is from a Repeater binding, set the prop value to the
    // corresponding repeater.item value
    prop = options.item[key];
  } else {
    // otherwise read value from app/page/event context
    prop = stateRead({ value, page, application: appData, options, clientLib });
  }

  // if target contains no '.', it is a page-level client variable
  if (target.indexOf(".") < 0) {
    console.log({ target, prop });
    return {
      clientLib: {
        ...clientLib,
        page: {
          ...clientLib.page,
          [target]: prop,
        },
      },
    };
  }

  console.log({ setting: scope, label, prop });

  const [scope, label] = target.split(".");

  return {
    clientLib: {
      ...clientLib,
      [scope]: {
        ...clientLib[scope],
        [label]: prop,
      },
    },
  };
};

export const updateAppState = assign(getUpdatedAppState);

export const assignApplicationDropMessage = assign((context) => ({
  message: `Are you sure you want to delete application ${context.appData.Name}?`,
  caption: "This action cannot be undone!",
}));

export const expandedNode = assign((context, event) => ({
  expandedNodes: {
    ...context.expandedNodes,
    [event.name]: !context.expandedNodes[event.name],
  },
}));

export const assignInvokerState = assign((_, event) => ({
  invokerLoadState: event.data,
}));
