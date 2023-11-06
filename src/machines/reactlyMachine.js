import { assign, createMachine } from "xstate";
import { getDemoData } from "../connector/getDemoData";
import { useMachine } from "@xstate/react";
import { getComponent } from "../connector/getComponent";
import { getPathData } from "../connector/getPageData";
import { setComponent } from "../connector/setComponent";
import { getApplications } from "../connector/getApplications";
import { getApplication } from "../connector/getApplication";
import { useClientState } from "./clientStateMachine";
import { useClientScript } from "./clientScriptMachine";
import { useConnection } from "./connectionMachine";
import { getComponents } from "../connector/getComponents";
import { reduceSettings } from "../util/reduceSettings";
import invokeResource from "../connector/invokeResource";
import { useTableBinder } from "./tableBinderMachine";
import { useInvoke } from "./invokeMachine";

import generateGuid from "../util/generateGuid";
import { commitApplication } from "../connector/commitApplication";
import * as actions from "./actions/reactly";

import React from "react";
const reactlyMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QCcwEMDGAXANgTwGJYwsACDAewDsswAPLAbQAYBdRUABwtgEste1DiDqIAtACYAHAFYAzADopzKRIBsAdjVrVc7QBoQecQEY1AFhMLm5mcxkm5JgJxzpagL4fDqTLjwKkPy8VFCkaJycOLwYaALUBAAWFAC2YCzsSCDcfPFUwqIIkg5SChrmzlLOzjJqzhZShsZFlhIKmmpy8iaOJlLmXV4+6Nj4gRDBoeGR0bF5BFRgAO6knGgwGcI5wUJZhZImzBoKtrVqRxJHtU2mzHLHcv1qDoddcjZDIL6jAUECUxEojE4oIqARKCkUvxyNQAGa8KAAV2QIOomyy2zyBXEEnMGmc1jucgqtic5lkNwQGj6SmYPQ0TmcKgqEk+33840mYUBs1RYIhULIYAAbmAaOFsKD0VweDt8nsceYLApqjISmZ7Mo1JS1WoFDJnNSpFpzEdLFI2SMOX8QtyZsD5hBkBROKQRWKmGwtrKsQqirj3goTBoSjIJDJym5KVVFPcHGHDrYTJa-GMbQD7XNQQQnS7ppxpdkfaDsf6NOprCYJM4lbV6qdKT1mMxrOpqXoQ6bBt4vla0xN-nagVnqJzB6t1mACH9C5iS36xL0W8TDXJnI4av0NJTyzIynoN5GpCYDSmfmPbfneXkL1M1jAFmhhQi4ukvRji7tQIUemo2nIAJratzhcR5KUXFQ9zMBk9CkZRyQGM9rQHS8eQdUFbzCe8pzSZANnfGVcnnb9EAjFsdGccNyWkCQNDg8DDhkUpqXMS4ANxEwKgtHt2X7Lkr3Q0d0ywycCFQYgsAwHB0CoWdP3lEiEE4-og0TQ4mTucw8QYzUyk4ti3EsLikL48c0JHKhMInB9EU4CBX3zOSiK-EREGDCprDohkEIkANtSMW4mL01iiQ44yeL7X4UIzYc+Ss7CCFs+zaEckxMkIuVSwkPo2i0R5cTVFxdR0oKWL6Sw6jqeQTKi-jzLi4TrKnVAoF4WBaGQJzMr9XyoMcOwagGXyQ385oINK-TQqMyoaqs+qb0ahKkoc9rXy631FMXP8oMo+xqjcdca0pAYW3Dc5LHXDQbBPTwItTWqzMzBropEh8MF8Wh1uI1yinpWNWOrY8VBykxwIZPdpAq48rpDCNZsa+aMMW0SACMQggUhVs+gii2chSfq2isJCcYlzhqdVKWJ0oVGYcN3gcWnbHhl6BIs+LJwUHAKDQDGlrstacbnFzCikP8gwsVUmXxepRrc6RjgNTobqu+Qmbu88EaehaWewznud50SeYgL7hbcgC9wcQzlGNDTzEbM72gA5slUqBk+mZuqtaRnWOa5nmmoUeFUFZvk3VFGhYAUDBEjADAAGtSFhChkDDj1YAIE38cKNVFA4iNzmpcoLEbGtSnOACdHLc4mI9x7Yu1-jdb9g2YED3hg8R6hU4jqOY-jxPk+7rB08YNLvTx0tFaDCMI0uzROLkSnWL1KpLAZXEajJWvUK9oSfdb5uA6DsAQ7yIfI9iHAcCH0hEjQKgIGk5BwVSKISDfdLce6xSelsFVlHLABfE2UjoBSUuuZiLgpBuCOP0Gs28YrXm9o3X2+sj7txPp3Kg58o5oCvjfO+D8n4vxSG-T6Y8PwTz9D0VQ+piTXU0OSEolNmCaH1FuYM-Q4IOAQUOJBe8UEHzQbrY+TVz4kLIR-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-R3g1t6xK4KM+gIw1D9l0tTL7hDh-c5SNL0ZbR04pJPTeMtcnAwLLoli8LKSUjTRDTWJqglRNAKM6IJLXSEpcT8S8BSBNyCygTJBDl2g-xaZ5A3ALMtAg98QwLusVFfcGRwqgymosD4q9Sto8Rc8ZYqw6R7AK4wZ5B9xKIagoFbS5y7z6M+FGNlziquTfjFgVhsI9zKJLLtDe1bBqRVDVtOICRVAIFngnYaFZoUYwB4kT5m49Z-ZARSB9U8A5KajcC6jDVlrVqAsNqMYtqdrtL7V2LPdbTjhesT9jwyZcRwJrDp5LA3D-1HBq8ctjr8zTrD4tr1UzryBkRUBxQdqSqcDdVDqAk-rg51rAbIg-MQaMAwbk0dqdK8g6C0KGCxB0q1lZB3hwxpY6Iagg97ACVfIKhosIzEJfqVr-rEa0Egba0K1YrtTtqwBCBbqTN2hZALNuDqhAM907h9QBotJjwwwLN4EGaTrmbNrkbgaLVFgGAuaebkU-90L8a1Rzzyh3CLhLhrMxouxxaKNJaTxaJf0lrGaEb9YQbWa2lXFIhYBzsdNytPdww7BRc1wuUVxwwjdjdVBgwflot-abb5b7akbXRgbARXbSt+rHJ9LNo3g9w4JywNlWE1xzT-QWxRZXBNI6R1AnA7gI6mao6Wala2aPQulDEu44rwRCFULpEyrzNSgtlspzi1QtBkjgTudZsBclRlAj0y67aeYHaq6naa6U4sFYquypx5LbrFDKx14tIvliYdwbiVByZvFNQtBR61qK7FaY7q6aBa7Z6G7err5E7ARbq17c87h55AdiYAIwZYx8RuFziUqVAD6AbK6T6nayCT4b7IgobFKjrbbD7x7o6UagGOaVhAQsapQBjcahj8b878N+gqJXBip+1ayh1r8axtBD1uJ2qFB4aoGIAcDgg8FeAAAvNa3gcotASosBg6+i88Ch06kIGh6IBhx9Jh7opBtEFBlu7W2Cf8dI5sBQoFHSeRWiR4WGMk8saCnLQLaSFKYgaSbASAOuyyfY5AFIdParVB0sfG6sAkfKQHeoXEEMXuqsE8awACNe7QN5cMWadR9+VvbR2gc6i5AxoxqgD3ZO1tPCjQ00Q-Zqw3FLNwKCaWQCy4OiUh63DkTxzR7vWOXxvRhQOOXgfBQENhmGjh1JjJ9Jnx3RipXJ-JyIYR2SUR9HVu94AkYGQ0IpAYA0Xu6-N1bQWoBbIjZMecuDcNacOgNYB+WKvE0q7W+kC2I2tcKE54XyBiXpyq54dsEjaBLwHsIJwLeALIfpMRvGj1NOjJMMWoWwAVaEsaE05ieoMiWiLhfoaXQ5tBkBfZABGsmBSwBiD1CfVhZQqW1wGCsAF5sx-qUoFcBkdcNcJibSPB54VSKsdp-oRLZEholSgbdE5ikFhp9C3yUoUubeq8voOkRsYK-UFreoKsYmWoYFkG8JDuIJc+UFnqLQFUckIl+wEl3JdrAXAlIBJkAGEOul7FtuRlylHBWFBOZpKZFlxSQydl62UkkoUllLIh-l+4foIyddEV0xVuURWeqZXBfBKJW+e+R+LpOVn6YjN1NKxhOwBkexoVJQNK4O00dcbKXV6FFxCxJnTjCAK1n8EXQjUc9Seoexg0c8skpq0nYar16pMVk+SZRJPZnfBgnoGkb5fOWeE5K5lIgMF1-smsQWo0+N9BYOZNtOGJBpOJOZFNwNtyMwPULNrQHNphQne4FURbdyeMXyMthlpNupI14gcZ01tIWAFAmABt4EizdoHu-dQ4BbXyhAF+qwJE8oEmndLSftpsvue5NBZxad20oMWiRwLJJUG6PFEPWmAClkMiDQOlgwrAad-G8ofDRbK-aJsaDK9oVLP9WQOoR4R9oQ8tC1RXNAF9twFeYjIpbdL9xAeR6m+ocDRLFYwZh8i9fQkDnzFvP1wLAN3F9NnPKqawhLAjHOxcP+UkK8iMd4LSWiYDjY1c4rLTZnMcVvLAKradk8cfLcasMicYya5oF7fUfC9sR13p5Jx0hcx89Ep9hnZNPDyAdjyI1NrWojmoE4dLJsOoUyvNld43IpcNs9uMDJKT9FmTzDuT7DhT+9JXf19j2VwjoY0CKwfEaCXlUnAi0oBx2maBUWRYtF5SyzzFtYl4sIJUlj+z-D9j27R7ad-FgkBoJrJwaBR4ZdyoE9ijOwHQZeEcxjlo+nJPFOFPV4sbSDtd850mVWLoFQRoGEzt-qBwbaF2WfdDzq2TsLhPZjkQvI5NT-KAbjroY4E8VrSMofLoCAtcMoRJ2A8keA9r7Jnwsr0g1AtSlEVFaIgy7KUE1hVwGoHu8sCAisa-bQgBOQn6shwgqzrr+T9blc-r8QnFtNoY3nTyL5XUM0KMPJViFUczYNYkoNArvr8tNouAYolDLolh5oF7sFnQP7wKndBR-qY6IpfmkKVReQcVRb8HZokHuNd4q1T47j9sE4XqDJeoWr1Vk2tUBrNcG6Jhfjh0izoZzr54jEoq+dF9hxi2Q8rSY8o5IPabgDo4bdOCPzul7qzMlU7M3zH07n-8oA0bo00mI3ckUDXpwqGwBwcsSXjM1smXh78UOKhXzt7L2bPb+QPlYTDhasIBNpztOluClh+ejqbju3soM52ryPcmlLM0BRPRY0Cjf7VkHHi5bFvzadopPUUkZeIHN4H7YMM2nQG-IhtWK7xitme76Sxy2So95sb9WoKoKoYA8qIX3PP8dwZRPZSieyh9TStTrb+Vngyq9wNsHQENSmNl4ti6CYizWmILm3ELjCbq7CF9i4vUCMrQACiYnl8QEMAlukLhGWKE3+5uF96c44O0s564y5hial6wMTOj9Iq3tfo+vx10S6yD6c9hEaALzsOf-U4kUT9ebFA0a8s-6B-+yP5zsx1FoMcGDLFNDGhoEb9ciOnVqrHoian-KhjA2BqHw0a6aDGtzUg6wkryeIQVnRFIz9oLAigPoEH3xYYD7AMAiegAzQDs1VaZAHaqgKOBKBAqsgC5laT5SSBNO3KO4BbmtJqhmeSmLhgrQv4o046btSDlj0djlRaYlPBkAxGUDrIZSOiLBpCRIFwDT6HUPRnPTSDCDpu+UJRJLhqp8oQwDWKoFwIL5MR96ctcul-2PqwNUCIDTgJB384ACfkxDTbKAJwEDAgwcEYfDZVOZtUUmYwXgfbR4YCBaG-DKHpUUg5HIleO-C5uDDkZrJgU6VemJuHM5KY0myODJjowv6SpUBV0dhKJWjJOxzKYCPRK2G0CyANwwaS7r4ICCpDvGmTCpv4xfyGNIO1YB4MRiqAesQCy7BbHE32hHoCoTzNRqUzSHlNMhjGKptfEBCoDfIuQkUnlHpj2MgKB+UoboHc7cQvAQAA */
    id: "reactly",

    initial: "before load",

    context: {
      machineName: "Reactly",
      path: "library",
      appTab: 0,
      pageTab: 0,
      componentTab: 0,
      componentData: null,
      preview: true,
      defaultOrder: 100,
      expandedNodes: {},
      view: 0,
      recycledApps: [],
    },

    states: {
      "editing application": {
        states: {
          "editing page": {
            states: {
              "load page": {
                description: `Interface is idle and no component is selected.`,

                states: {
                  "fire application events": {
                    states: {
                      "check for events": {
                        always: [
                          {
                            target: "call event handler",
                            cond: "application has events",
                          },
                          "#reactly.editing application.editing page.load page.fire page events",
                        ],
                      },

                      "call event handler": {
                        invoke: {
                          src: "invokeAppLoad",
                        },

                        on: {
                          complete: [
                            {
                              target:
                                "#reactly.editing application.editing page.load page.page data loaded",
                              cond: "no page has loaded",
                              actions: "reassignAppData",
                            },
                            {
                              target:
                                "#reactly.editing application.editing page.load page.fire page events",
                              actions: "reassignAppData",
                            },
                          ],
                        },
                      },
                    },

                    initial: "check for events",
                  },

                  "page data loaded": {
                    entry: "assignAppLoaded",
                    description: `Page or application is loaded and being edited. All page and application events have completed firing.`,
                  },

                  "fire page events": {
                    on: {
                      complete: {
                        target: "page data loaded",
                        actions: "reassignAppData",
                      },
                    },

                    states: {
                      "pause for events": {
                        after: {
                          500: [
                            {
                              target: "send event message",
                              cond: "page has events",
                            },
                            {
                              target:
                                "#reactly.editing application.editing page.load page.page data loaded",
                              // actions: () => alert("huh!!"),
                            },
                          ],
                        },
                      },

                      "send event message": {
                        invoke: {
                          src: "invokePageLoad",
                        },
                      },
                    },

                    initial: "pause for events",
                  },

                  "check load state": {
                    always: [
                      {
                        target: "fire application events",
                        cond: "page is loading",
                      },
                      "page data loaded",
                    ],
                  },
                },

                initial: "check load state",

                on: {
                  update: {
                    actions: "updatePage",
                  },

                  add: "add parameter",

                  // "event action": {
                  //   target: "load page",
                  //   internal: true,
                  //   actions: "upsertEvent",
                  // },
                },
              },

              "editing component": {
                description: `Selected component is open for editing`,

                on: {
                  close: {
                    target: "load page",
                    actions: "clearComponent",
                  },
                },

                states: {
                  "get component data": {
                    entry: assign({
                      message: "Loading component information...",
                      action: "Cancel",
                    }),

                    invoke: {
                      src: "loadComponent",

                      onDone: {
                        target: "component data loaded",
                        actions: "assignComponentData",
                      },

                      onError: "error loading component",
                    },

                    on: {
                      yes: "#reactly.editing application.editing page.editing component",
                    },

                    description: `Load configuration data for the selected component from dynamo.`,
                  },

                  "component data loaded": {
                    on: {
                      update: {
                        actions: ["updateComponent", "remergeComponent"],
                      },

                      bind: {
                        actions: ["bindComponent", "remergeComponent"],
                      },

                      unbind: {
                        actions: ["unbindComponent", "remergeComponent"],
                      },

                      configure: {
                        target: "configuring component setting",
                        actions: "assignSetting",
                      },

                      "open styles": ".edit styles",
                      "open settings": ".edit settings",
                      "open events": ".edit events",
                      "open JSON": ".edit JSON",
                      "configure style": "configure component style",
                      drop: "drop compoment",

                      "configure binding":
                        "#reactly.editing application.configure data bindings",
                    },

                    description: `Component information has been loaded from dynamoDb`,

                    states: {
                      "edit settings": {
                        entry: assign({ componentTab: 0 }),

                        // on: {
                        //   bind: {
                        //     target: "edit settings",
                        //     internal: true,
                        //     actions: ["bindComponent", "remergeComponent"],
                        //   },
                        // },
                      },

                      "edit styles": {
                        entry: assign({ componentTab: 1 }),
                      },

                      "edit events": {
                        entry: assign({ componentTab: 2 }),

                        // on: {
                        //   "event action": {
                        //     target: "edit events",
                        //     actions: "upsertEvent",
                        //     internal: true,
                        //   },
                        // },
                      },

                      "edit JSON": {
                        entry: assign({ componentTab: 3 }),
                      },
                    },

                    initial: "edit settings",
                  },

                  "error loading component": {
                    on: {
                      no: {
                        target:
                          "#reactly.editing application.editing page.editing component",
                        actions: "clearComponent",
                      },
                      yes: {
                        target: "component data loaded",
                        actions: "assignBlankComponentData",
                      },
                    },

                    entry: "assignProblemMessage",
                  },

                  "configuring component setting": {
                    on: {
                      cancel: "component data loaded.edit settings",

                      update: {
                        target: "configuring component setting",
                        internal: true,
                        actions: "udpateSetting",
                      },

                      save: "save configuration",
                    },
                  },

                  "save configuration": {
                    invoke: {
                      src: "commitComponentDefinition",
                      onDone: "refresh component library",
                    },
                  },

                  "configure component style": {
                    on: {
                      update: {
                        target: "configure component style",
                        internal: true,
                        actions: "udpateStyle",
                      },

                      save: "save configuration",
                      "cancel style": "component data loaded.edit styles",
                    },

                    description: `Update style setting for this component`,
                  },

                  "refresh component library": {
                    invoke: {
                      src: "getLibraryData",
                      onDone: {
                        target: "get component data",
                        actions: "assignLibraryData",
                      },
                    },

                    description: `Load library component data from dynamo.`,
                  },

                  "drop compoment": {
                    on: {
                      "drop confirm": {
                        target:
                          "#reactly.editing application.editing page.editing component",
                        actions: "dropSelectedComponent",
                      },
                      "cancel drop": "component data loaded",
                    },
                  },
                },

                initial: "get component data",
              },

              "create component": {
                states: {
                  "choose component type": {
                    on: {
                      next: {
                        target: "choose component name",
                        actions: "autoNameCreatedComponent",
                      },

                      "auto create": {
                        target:
                          "#reactly.editing application.editing page.editing component",
                        actions: [
                          "autoNameCreatedComponent",
                          "openCreatedComponent",
                        ],
                      },

                      more: {
                        target: "choose component type",
                        internal: true,
                        actions: [
                          "incrementOrder",
                          "autoNameCreatedComponent",
                          "openCreatedComponent",
                          "assignCreatedComponent",
                        ],
                      },
                    },
                  },

                  "choose component name": {
                    on: {
                      next: {
                        target:
                          "#reactly.editing application.editing page.editing component",
                        actions: "openCreatedComponent",
                      },

                      back: "choose component type",
                    },
                  },
                },

                initial: "choose component type",

                on: {
                  modify: {
                    actions: "modifyCreatedComponent",
                  },

                  "cancel create": "#reactly.editing application.editing page",
                },
              },

              "add parameter": {
                description: `User is adding a parameter to the current page.`,

                on: {
                  ok: {
                    target: "load page.page data loaded",
                    actions: "appendPageParam",
                  },

                  change: {
                    target: "add parameter",
                    internal: true,
                    actions: "assignNewName",
                  },
                },
              },
            },

            initial: "load page",

            on: {
              edit: {
                target: ".editing component",

                actions: [
                  "assignComponent",
                  "assignComponentProps",
                  "assignBindings",
                  "assignStateList",
                ],
              },

              navigate: {
                target: "editing page",
                actions: [
                  "assignNavigation",
                  "clearComponent",
                  "assignStateList",
                  "assignAppLoading",
                ],
                internal: true,
              },

              merge: {
                target: "load page data",
                actions: "assignPath",
              },

              resetclean: {
                // target: "editing page",
                // internal: true,
                actions: "assignClean",
              },

              // "configure application": {
              //   target: "configuring application",
              //   actions: "assignConfigurationType",
              // },

              "update app": [
                {
                  // target: "editing page",
                  actions: "reassignAppData",
                  cond: "event contains no nav info",
                },
                {
                  // target: "editing page",
                  actions: ["assignNavEvent", "assignAppLoading"],
                  internal: true,
                },
              ],

              register: {
                actions: "registerPackage",
              },

              "update state": {
                // target: "ready",
                actions: "updateAppState",
              },

              create: {
                target: ".create component",
                actions: [
                  "clearDefaultComponentParent",
                  "assignCreatedComponent",
                ],
              },

              "bind state": {
                actions: "updateBoundState",
              },
            },
          },

          "load page data": {
            invoke: {
              src: "getDataFromPath",
              onDone: {
                target: "editing page",
                actions: "assignDataFromPath",
              },
            },

            description: `Import page data from matching MySQL application to the current page.`,
          },

          // "configuring application": {
          //   invoke: {
          //     src: "loadConfigurationMachine",
          //     onDone: "editing application configuration",
          //   },
          // },

          // "editing application configuration": {
          //   on: {
          //     "configure application": {
          //       target: "configuring application",
          //       actions: "assignConfigurationType",
          //     },

          //     quit: [
          //       {
          //         target: "editing page.editing component",
          //         cond: "component ID is specified",
          //         actions: [
          //           "assignComponent",
          //           "assignComponentProps",
          //           "assignBindings",
          //           "assignStateList",
          //         ],
          //       },
          //       {
          //         target: "editing page.load page",
          //         cond: "no component is selected",
          //       },
          //       {
          //         target:
          //           "editing page.editing component.component data loaded",
          //       },
          //     ],

          //     commit: {
          //       target: "editing application configuration",
          //       internal: true,
          //       actions: "assignConfigurationUpdate",
          //     },

          //     "event action": {
          //       target: "editing application configuration",
          //       internal: true,
          //       actions: "upsertEvent",
          //     },
          //   },

          //   description: `Application is only listening for events from the configuration machine.`,
          // },

          "configure data bindings": {
            invoke: {
              src: "loadDataBindingMachine",
              onDone: "editing data bindings",
            },
          },

          "editing data bindings": {
            on: {
              "close bind": {
                target:
                  "editing page.editing component.component data loaded.edit settings",
                actions: ["assignComponentBindings", "remergeComponent"],
              },
            },
          },

          "create page": {
            description: `Create a new page dialog is open and name can be entered`,

            on: {
              "modify name": {
                actions: "modifyCreatedPage",
              },

              done: {
                target: "editing page",
                actions: "openCreatedPage",
              },

              "cancel new page": "#reactly.editing application",
            },
          },
        },

        initial: "editing page",

        on: {
          home: {
            target: "before load",
            actions: "resetAppState",
          },

          "new page": {
            target: ".create page",
            actions: "assignCreatedPage",
          },

          "commit configuration": {
            actions: "assignConfigurationUpdate",
          },

          "commit event action": {
            actions: "upsertEvent",
          },

          "drop event": {
            actions: "dropEvent",
          },

          "drop app": {
            target: "delete selected application",
            actions: "assignApplicationDropMessage",
          },

          "expand node": {
            actions: "expandedNode",
          },
        },
      },

      "before load": {
        states: {
          "load app keys": {
            invoke: {
              src: "getAppKeys",
              onDone: {
                target: "load app data",
                actions: "assignAppKeys",
              },
            },
          },

          "load app data": {
            states: {
              "load current key": {
                invoke: {
                  src: "getAppKey",
                  onDone: {
                    target: "get next key",
                    actions: "assignAppToKey",
                  },
                },
              },

              "get next key": {
                always: [
                  {
                    target: "load current key",
                    cond: "more keys",
                  },
                  "apps loaded",
                ],
              },

              "apps loaded": {
                on: {
                  open: {
                    target: "#reactly.editing application.editing page",
                    actions: [
                      "assignDataFromKey",
                      "assignStateList",
                      "assignAppLoading",
                    ],
                  },

                  "new app": "enter application name",
                },

                description: `Information has loaded for all apps`,
              },

              "enter application name": {
                on: {
                  change: {
                    actions: "assignNewName",
                  },

                  done: "save new app",
                  "cancel new app": "apps loaded",
                },
              },

              "save new app": {
                invoke: {
                  src: "createNewApp",
                  onDone: "#reactly.before load.initialize library",
                },
              },
            },

            initial: "load current key",
          },

          "initialize library": {
            invoke: {
              src: "getLibraryData",
              onDone: {
                target: "load app keys",
                actions: "assignLibraryData",
              },
            },
          },
        },

        initial: "initialize library",
      },

      "delete selected application": {
        states: {
          confirm: {
            on: {
              yes: "kill app",
              no: "#reactly.editing application",
            },
          },

          "kill app": {
            invoke: {
              src: "dropApp",
              onDone: "#reactly.before load",
            },
          },
        },

        initial: "confirm",
      },
    },

    on: {
      "set context": {
        actions: "updateMachineContext",
      },
    },
  },
  {
    guards: {
      "event contains no nav info": (_, event) =>
        !event.application?.navigation,
      "application has events": (context) => {
        const { appData } = context;
        const eventType = "onApplicationLoad";
        const invoked = appData.events?.filter((f) => f.event === eventType);

        return !!invoked.length;
      },
      "page has events": (context) => {
        const { page } = context;
        if (!page) return false;
        const eventType = "onPageLoad";
        const invoked = page.events?.filter((f) => f.event === eventType);

        return !!invoked.length;
      },
      "page is loading": (context) => {
        const loadOK =
          context.appLoading &&
          !(!!context.page && !context.page.components.length);

        return loadOK;
      },
      "no page has loaded": (context) => !context.page,
      "more keys": (context) => context.key_index < context.appKeys.length,
      // "no unsaved component changes": (context) =>
      //   !context.selectedComponent?.dirty,
    },
    actions,
  }
);

export const useReactly = () => {
  const [configurationType, setConfigurationType] = React.useState("");

  const handleConfigUpdate = (node, value, scope = "application") => {
    send({
      type: "commit configuration",
      node,
      value,
      scope,
    });
  };

  const invoker = useInvoke(
    (app) => {
      send({
        type: "complete",
        application: app,
      });
    },
    (app) => {
      send({
        type: "update app",
        application: app,
      });
    }
  );

  const binder = useTableBinder((bindings) =>
    send({
      type: "close bind",
      bindings,
    })
  );

  const clientScript = useClientScript(
    (ID) =>
      send({
        type: "quit",
        ID,
      }),
    handleConfigUpdate
  );
  const connection = useConnection(() => send("quit"), handleConfigUpdate);
  const clientState = useClientState(() => send("quit"), handleConfigUpdate);

  const configMachines = {
    connection,
    clientState,
    clientScript,
  };
  const [state, send] = useMachine(reactlyMachine, {
    services: {
      getData: async () => {
        return await getDemoData();
      },
      getLibraryData: async () => {
        return await getComponents();
      },
      getAppKey: async (context) => {
        const current = context.appKeys[context.key_index];
        return await getApplication(current.Key);
      },
      getAppKeys: async () => {
        return await getApplications();
      },
      getDataFromPath: async (context) => {
        return await getPathData(context.path);
      },
      loadComponent: async (context) => {
        const { Library, selectedComponent, componentData } = context;
        const local = Library.find(
          (f) => f.ComponentName === selectedComponent.ComponentType
        );
        if (
          local &&
          componentData?.ComponentName !== selectedComponent.ComponentType
        ) {
          return local;
        }
        return await getComponent(selectedComponent.ComponentType);
      },

      dropApp: async (context) => {
        await commitApplication({
          ...context.appData,
          isDeleted: true,
        });
      },

      createNewApp: async (context) => {
        const ID = generateGuid();
        const newApp = {
          ID,
          Name: context.name,
          path: context.name.toLowerCase().replace(/\s/g, "-"),
          HomePage: "",
          Photo: "",
          PagePath: "",
          events: [],
          scripts: [],
          pages: [],
          connections: [],
          components: [],
          resources: [],
          themes: [],
          state: [],
        };
        await commitApplication(newApp);
        return ID;
      },

      loadDataBindingMachine: async (context) => {
        const bound = context.selectedComponent.settings.find(
          (f) => f.SettingName === "bindings"
        );

        binder.send({
          type: "load",
          bindings: bound?.SettingValue || "{}",
        });
      },

      invokeAppLoad: async (context) => {
        const { appData, page, resourceData, setupData } = context;
        if (!invoker.state.can("load")) return;
        const eventType = "onApplicationLoad";
        const type = invoker.state.can("append") ? "append" : "load";
        console.log("INVOKE %c%s", "color:lime", eventType, type, state.value);
        const invoked = appData.events.filter((f) => f.event === eventType);
        if (!invoked.length) return alert("No application events");

        invoker.send({
          type,
          eventType,
          events: invoked,
          page,
          options: {},
          application: appData,
          resourceData,
          setupData,
        });
      },

      invokePageLoad: async (context) => {
        const { appData, page, resourceData, setupData } = context;
        if (!invoker.state.can("load"))
          return alert(JSON.stringify(invoker.state.value));
        const eventType = "onPageLoad";
        const type = invoker.state.can("append") ? "append" : "load";
        console.log("INVOKE %c%s", "color:lime", eventType, type, state.value);
        const invoked = page.events.filter((f) => f.event === eventType);
        if (!invoked.length) return;

        invoker.send({
          type,
          eventType,
          events: invoked,
          page,
          options: {},
          application: appData,
          resourceData,
          setupData,
        });
      },

      invokeComponentResources: async (context) => {
        const { page, appData } = context;
        const bound = page.components.find((f) =>
          f.settings.some((s) => s.SettingName === "bindings")
        );
        const args = reduceSettings(bound.settings);
        const json = JSON.parse(args.bindings);

        const resource = appData.resources.find(
          (f) => f.ID === json.resourceID
        );

        const connection = appData.connections.find(
          (f) => f.ID === resource.connectionID
        );
        const data = await invokeResource(connection, resource);
        return {
          key: json.resourceID,
          rows: resolveRows(data, resource.node.split("/")),
        };
      },

      loadConfigurationMachine: async (context) => {
        const machine = configMachines[context.configurationType];
        if (!machine)
          return alert(`No machine for "${context.configurationType}" `);
        const { state = [], scripts = [] } = context.page || {};
        console.log({ app: context.appData });
        machine.send({
          type: "load",
          state,
          scripts,
          appState: context.appData.state,
          appScripts: context.appData.scripts,
          resources: context.appData.resources,
          connections: context.appData.connections,
          resourceData: context.resourceData,
          setupData: context.setupData,
        });
        return true;
      },

      commitComponentDefinition: async (context) => {
        const { componentData } = context;
        const component = {
          ...componentData,
          Attributes: JSON.stringify(componentData.Attributes),
        };
        return await setComponent(component);
      },
    },
  });

  const configureApp = (type) => {
    const { appData, setupData, resourceData, page } = state.context;
    const machine = configMachines[type];

    machine.send({
      type: "load",
      state: page?.state,
      scripts: page?.scripts,
      appState: appData.state,
      appScripts: appData.scripts,
      resources: appData.resources,
      connections: appData.connections,
      resourceData: resourceData,
      setupData: setupData,
    });

    setConfigurationType(type);
  };

  const invokeEvent = (events, eventType, options, e) => {
    const { page, appData, resourceData, setupData } = state.context;
    if (!events) return;
    const invoked = events
      .filter((f) => f.event === eventType)
      .filter((f) => f.action.type !== "setState");

    const setters = events.filter((item) => item.action.type === "setState");
    // console.log({ setters, options });

    if (setters.length) {
      setters.map((step) => {
        send({
          type: "update state",
          options,
          step,
        });
      });
    }

    if (!invoked.length) return;
    if (!appData) {
      return alert("Could not invoke event because application is not ready.");
    }
    console.log({ options });
    invoker.send({
      type: "load",
      eventType,
      page,
      events: invoked,
      options,
      application: appData,
      resourceData,
      setupData,
      e,
    });
  };

  const setContext = (name, value) => {
    send({
      type: "set context",
      name,
      value,
    });
  };

  const machineList = {
    Reactly: { actions, state, send, states: reactlyMachine.states },
    "Event Handler": invoker,
    "Data Binder": binder,
    "Script Handler": clientScript,
    "Connection Manager": connection,
    "Client State Manager": clientState,
  };

  return {
    state,
    send,
    configMachines,
    binder,
    invoker,
    invokeEvent,
    setContext,
    ...state.context,
    configureApp,
    configurationType,
    states: reactlyMachine.states,
    machineList,
  };
};

function resolveRows(object, node) {
  const key = node.shift();
  const descendent = object[key];
  if (!!node.length) {
    return resolveRows(descendent, node);
  }

  return descendent;
}
