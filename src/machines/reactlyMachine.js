import { assign, createMachine } from "xstate";
import { getDemoData } from "../connector/getDemoData";
import { useMachine } from "@xstate/react";
import { getComponent } from "../connector/getComponent";
import { getPathData } from "../connector/getPageData";
import { setComponent } from "../connector/setComponent";
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
import getDynamoApplicationList from "../connector/getDynamoApplicationList";
const reactlyMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QCcwEMDGAXANgTwGJYwsACDAewDsswAPLAbQAYBdRUABwtgEste1DiDqIAtACYA7AA4AbADoAnMykAWJQEYlGpXIlyANCDzjNMmZoUXZagMwqArJs12JAX3fHUmXHgWQ-LxUUKRonJw4vBhoAtQEABYUALZgLOxIINx8cVTCogiSUgYKdmrMzHJSjo56UkrGpoUuzGoKckqySnYV3Wpyap7e6Nj4ARBBIWERUTG5BFRgAO6knGgw6cLZQUKZBZKaqgpqNXJyqhKqjkYmZsx2UqUy-c6Hdo49g14gPqP+gQIpuFItFYoIqARKMlkvxyNQAGa8KAAV2QYOom0y21y+XEEjU9QUFTsZR0H00ahkjkaiCk5mszBcUjs2mYzyUHm+vz840moWBs3REKhMLIYAAbmAaGFsODMVweDs8ns8f02kolDVzJpzo4ZJUaQhTgpanSZFIBqo1OYhj8RjyAcF+TNQfMIMgKJxSBKpUw2FtFTiVYV8T0FJpquZHBJHOo3IaZN1SpHo4cTppbdyxo6gS65uCCO7PdNOPKsoHwbiQ8VFIyJDo5Nc9CdqbcEC1mESDHS7FVHOV3pn7dmJoDnSD8-F6GsqBBSFQKBA0v6sRXdqB9kzHCbLnIHBJNNdoxJDWJD3IrPXGz3Wmy7EPfCO+SXBbleWPVuswAQAWXsZXgzPB4JGUeQ3GYWo1H6KRDWKbdmQvBw40sWoHz+d8nRfV1wQwqY1hgBY0HFJFYmXDIFRyACN0QFw9SJNQDw6d5mT0U8XAkEDe2kNk02ZGM0IdUdMIFbDqFw0J8O-VJkA2FcKKVKtY07ORExjSkJBkaQLDYiCZAUOkGPuNxrQ0GQBKfD8RMnKhxM-AjUGILAMBwdAqD-NdlWo9tKTaFprWYFR7igmC2zPXT9IpS4SXxCklDMrlh3+ITcwnIVbMkghkU4CBSJLdzKPXEQaPUJQiVkZkfI4+wbiaMK6IMqLjNi+LhkfJLnystKcwkr9Muy3LgUYTRyPLArPKKhAOMOZR1B1So3gGNiXCsfRWhJM4dV7RxzPayy8y65KevssAoF4WBaGQfKFODDjtxcd4Av7NxpGuHT6sioyYtMnbbM6t9urs78spy2hSHO0irqDLyz30O6OQgjU3C0HRDXsTsY3Oa0tCkVpzx+gG-pwgGMowHxaEhqiJrPCM7FKBj60sHjNM0U9mW3DTrRUiMrljfHDqw6z0t6gAjYI53B8m5NG67oZ1EoJBZMpzk1ZxLENBW9LZZgYx6ZxtZOPmOv2-7+ckhQcAoNA5wy4GIal-9CoKeRlOKGMAr3BjtENVwKWOa98SqDT9U5Vr0IJ42idNr9zct63eqtiAKcdmiSW3ZxjP1c1ArUb2MfaEkKn6OLmRtBK2t+iOxOJ6OLatwGFERVABaFb1JRoWAFAwBIwAwABrUh4QoZBW99WACCT8aCgY9UcZjHUpAtbXWyabR7HaPQHj0AYdQYw29tSk3nzN2u45gBveCbwnqBH9vO+7vuB6Hm+sDHoaRodyfEAJUqpoXlkVN7NrdWhljgVAjHqd4eoqh72EpXGy1cz4n3ro3MAzdcjPw7jEHAOBn6kASGgWcLlkCQhSJEEgZEAxjSrLReCzxWjyC0AYBW3sVCa0cAFVo7DGT1CkDAlKr5I5HxrrHZBF9UFXyoBgzuaBsG4PwYQsAxCoRkPJsNShMsJouE0iaMouMqiUlVurSojw9QEgjM8Cwzg+HjgEVXKOiCRFmxQYDDBJDkgqIoauKhwY5bbkbPoaQe4LwQWXjRdkCgdYWhJJoBW6htplzDvzCRQsHF1ycWIlxPpb5rGRMQR+w8skvwIHQCWYAFBoHhBdAAFFwgAlAQLMu1YEH0ER+Y+jjo7OMklInJeTB4FLbi-Ce1CGKKA5Bec0h5ozOHVmUNoJxrTFE0geB48TQ6CSNi0uxQjUmnzKV0r8PS0C5NQf01xJSsCkXKZUxRNSKj1MaRXLZ8D7FlKQekpu3TCkd16acp+3y37qKhpoqCbQBgaDKJpdkZwjG+w4oyTUGp1DmjWXacu4dnkpLeR0s+Xce79yQaU8e9sPJVgtCBUyusQndFqN7fQtN3gK0PGYheEFrFoNaZhdpaTo54ofoSy5tBx5qK8RogohwdTKHhQMZkjIyh0oVqUaMLJ+x0lZaix5GLbEvJ2WUgGyjqC+khBbYgwzgyYxNN0FS0hrQGF7N7VQtMORu0epcbs7LkkIL1fzA1iwaAKBgGQX1vpSAgzQIWQ1ChgjigoL3MpmqklwKxbZYN-rA1wncYa6UYaEDRooNZdIZqvIdEUFE8oep5oXhPG2NeshzhuBxs9OZHqk1epTaQrNWAA0kAzdwP1ZAw0-mQB6ZAChIixH6ckBQCbNnauTfqjt-bu1BsXSGnNeaC1sCLVTfEftQz9EVgHToS1OzaE6GqjaOMdQtsxW2hdmal3ptTQO2I4a8BwG3fsHoDKPbvBZP0esdhTwEj0lBSFZRzAKw1HIG9c670+tXf659obX2kBPpAPqINPHyWBeKuknZ7D1HKOUK9MZUbFCJJ0e4NQWSBQ+LB0SOq2nR3vX230ndEMvsuWh2OGHRazk-TRZs1gLCHH0JpW8MhyMgQCo2mjrI2UJI2fvODrz20PvY8hsNPGrYYeRFQfjicSXeK8hxaQpRWgElTtGKk0nKNyfJIFGDSmLLNNU7q9TbGkOcZQ9x9DEASFUERCiVAgn2yAKeNUMorK2SLRrVSUoCsS06GtDZ5z6zXP8MY-OhDGnvN5a42gHTS4AueilGDLAeAXKwDCy4PQoF6y6Qk+Jw0bh9LOCqDoZk7wkUMcFvB58z6OMFd80V-zBAyuSMcmOGrxmxU0VeNYZ15R6HaA4q1kCkZOtWZ63oPrB0POsc7cNrzhXisYcmxg2rOhOwVBkCSewLQNSniTLoRrPQ4nnAzC5ppWX+tqaO0urTqHxuXYAFIAGUADyAA5MLHEOT6TrPdmlDggOhQPD-KkrQcZWn-SHNFiTZ3ZYGx+IbwO-O8YC5QILSJUSoPOlV7D0tcOIEsCBWMEYIwGFUJFWZmtg4MTcA4bW+J9uH2Y2fQHmmfPafG0WUsc3WfthLUt5wtQ+x7hZqFQj4Z+yUlkBYXcCtxecrwix3Lp2TudtG+d6nCI6dN0M06ML4ETEltcHxKB6Pap2D0loSzD2yhzK+Bl37NiScA8t8dinY2qfvlIJD2H070AQGoPgH8o5SAACtYAYiV5TAo3FOx6iitBGsHwWF6QtDoCka19AWg1YlJ57nJfesG5x63-bbf+YT0nmHDdUCoNoAwCNix4cNuOPTSkiZujC9PGGHoGl9dVBJL2JQpvtlt88zH2XIP48AkT9Dgf8Ih+kBH1gSEBCMBgBwbn7dtV6zWCYU4HQBhIKtiL0bhkB5scQVMqHoTspm5pHodtHkuooiOsVphM+gsBQGFmIKVNcCtlBJUPYB1qeJBMoKshJijgMOlkAZlhHv9mAR3gVgEMOk-CfDAZxgQO+rNu-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-wvExhFfOsFPbHU8YkO52H88OFJfufMR66cv-7lAhEfPFGXACEDD3bnn3eHsw8SEDe9H1EvVChsduBWDNbdCajEfFCFElAhFItXBrRk8a+xGDFyVkDVe68HhlQhKnB44227vYEEgcTFnEgmNQ8Pdb71m6dKk8n6dqlONNDje8veFe9Xh3ElzvCoyNUqSGR9AfDuoq8uulew8bepkdrpnucdCPA-kvD+IKwQSYEYOVAN7rTknRgxu2XPpScctpx7k+Vbn+W1QfAE95H6gtiaOQ+U2q9B9UVN-QX0WwU+bwUt917WA5Vnoezr3MuPQ5V6zphctZ+89qbj8YkOXIY32z8wePTdBlGaj2pQesFmKAarKgplAxvlVrCVUXTueAbtY6zsIaQOC5VWilAxPmgBRM4m-HrtDzEjusDOabPUrx2OAfBRkLxdQvxSAgDtruKkUIg2ANhb9kkL1VBIjVnDI1deqqOEiyEmQVQYUoUACv5AgydBOurQcCrgImDXVdevlPmhVFJCBxXA6sBLK0Exjwp6wVRXWrhxZz1UDg-QAVovHuyXARWoUaoP7gFqUgt4TTQup42KyGcGw39WLDjlcAoxzuNrJJg8CJ71AqQeoJQeHX4bnM-aYAAOoZwvBWBcWevWphYEQEtBtw9LBhCiwGDc9Q6ygswWfTDSGdzQigfAhX2wozE1WPnGAbdE1D4gTgd3V2t4NkZEN5GYDYEFPXnaQDKWeoRBvYC6waAEY21M9OvH0RSs9QeoTwfg3iHeM5G59CBmQwTaH90hvLP9JU1NbF86EYmWCH4hqY1AuEukC0CYL4YJCBGSQy5AoEUaiNgQ-gjSO0AAy0sucvlFnra2VRsgOIVQDoP73KGmCLGVAXxrY3saONhS-g5TjSw0H0ttBtUX5lYCRiFxUBDJCmuhGOYM5TmmzCRLTxxgmh86iyPcLrAaYxMuwZwDkEjG7YANm8Dwnphs3yZYCHc3pQzvWEeBVMamjCNbOR1+ZzNTu6kE4JrRFqgj1mZzLZjsxwQTCGhSdZ6O8P2oRgvh+RB1F-WjBnAjcm8F2gfUhbWRoW40dIoBCPSDtuBJQxXh718iphRktIlwPoE8CeAgAA */
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
      view: 1,
      recycledApps: [],
      columnsOpen: 3,
      clientLib: {
        application: {},
        page: {},
        event: {},
        parameters: {},
        // registrations: {},
        resources: {},
        modals: {},
        setups: {},
      },
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

                        // states: {
                        //   "ping invoker": {
                        //     invoke: {
                        //       src: "getInvokerLoadState",
                        //       onDone: {
                        //         target: "wait for invoker",
                        //         actions: "assignInvokerState",
                        //       },
                        //     },
                        //   },

                        //   "wait for invoker": {
                        //     after: {
                        //       500: [
                        //         {
                        //           // target: "ping invoker",
                        //           cond: "event invoker is not ready",
                        //         },
                        //         {
                        //           target:
                        //             "#reactly.editing application.editing page.load page.fire application events.call event handler",
                        //           cond: "application has events",
                        //         },
                        //         {
                        //           target:
                        //             "#reactly.editing application.editing page.load page.fire page events",
                        //         },
                        //       ],
                        //     },
                        //   },
                        // },

                        // initial: "ping invoker",
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
                      },

                      "edit JSON": {
                        entry: assign({ componentTab: 3 }),

                        states: {
                          readonly: {
                            on: {
                              "edit json": "free text",
                            },

                            description: `Component JSON is viewable but cannot be edited`,
                          },

                          "free text": {
                            on: {
                              done: {
                                target: "readonly",
                                actions: ["applyJSON"],
                              },
                              "cancel js": "readonly",
                            },

                            description: `User is editing component JSON`,
                          },
                        },

                        initial: "readonly",
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
                  "resetApplicationClientLib",
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
                  target: "editing page",
                  actions: "reassignAppData",
                  cond: "event contains no nav info",
                },
                {
                  target: "editing page",
                  actions: [
                    "assignNavEvent",
                    "clearComponent",
                    "assignStateList",
                    "assignAppLoading",
                  ],
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
            target: "before load.load app keys",
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
                target: "load app data.apps loaded",
                actions: "assignAppKeys",
              },
            },

            description: `Load application list from dynamoDb`,
          },

          "load app data": {
            states: {
              "apps loaded": {
                on: {
                  open: {
                    target: "#reactly.load application json",
                    actions: ["assignDataFromKey"],
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

                description: `Display new application form.`,
              },

              "save new app": {
                invoke: {
                  src: "createNewApp",
                  onDone: "#reactly.before load.initialize library",
                },
              },
            },

            initial: "apps loaded",
            description: `Display application list`,
          },

          "initialize library": {
            invoke: {
              src: "getLibraryData",
              onDone: {
                target: "load app keys",
                actions: "assignLibraryData",
              },
            },

            description: `Load component library from dynamoDb`,
          },
        },

        initial: "initialize library",
        description: `No application has been loaded`,
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

      "load application json": {
        invoke: {
          src: "getAppKey",
          onDone: {
            target: "editing application.editing page",
            actions: [
              "assignAppDataFromDb",
              "assignStateList",
              "assignAppLoading",
            ],
          },
        },
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
      "event invoker is not ready": (context) =>
        !context.invokerLoadState && !!context.appLoading,
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
    },
    actions,
  }
);

export const useReactly = () => {
  // sets/reads current config type being edited, if any
  const [configurationType, setConfigurationType] = React.useState("");

  // helper function to handle UPDATE callback from configuration machines
  const handleConfigUpdate = (node, value, scope = "application") => {
    send({
      type: "commit configuration",
      node,
      value,
      scope,
    });
  };

  // helper function to handle QUIT callback from configuration machines
  const handleConfigQuit = (ID) =>
    send({
      type: "quit",
      ID,
    });

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

  // table binder manages component data bindings
  const binder = useTableBinder((bindings) =>
    send({
      type: "close bind",
      bindings,
    })
  );

  // app configuration machines handle advanced properties of the app
  const clientScript = useClientScript(handleConfigQuit, handleConfigUpdate);
  const connection = useConnection(handleConfigQuit, handleConfigUpdate);
  const clientState = useClientState(handleConfigQuit, handleConfigUpdate);

  const configMachines = {
    connection,
    clientState,
    clientScript,
  };

  /** ----------------------------------------------------------------- */
  /** MACHINE SERVICES */
  /** ----------------------------------------------------------------- */
  /**
   * Asynchronously retrieves demo data using the imported `getDemoData` method.
   * @returns {Promise} A promise that resolves with the demo data.
   */
  async function retrieveDemoData() {
    return await getDemoData();
  }

  /**
   * Asynchronously gets components using the imported `getComponents` method from the `connector_getComponents` module.
   * @returns {Promise} A promise that resolves to the components.
   */
  async function getComponentsAsync() {
    // Await the result of the `getComponents` method call and return it
    return await getComponents();
  }

  /**
   * Retrieves the application using the current key from the context.
   * @param {Object} context - The context object.
   * @returns {Promise} - A promise that resolves to the application.
   */
  async function getApplicationFromContext(context) {
    const currentKey = context.currentKey;
    const application = await getApplication(currentKey);
    return application;
  }

  /**
   * Retrieves a list of applications from a DynamoDB database
   * and returns a stripped version of the data.
   * @returns {Promise<Array>} A promise that resolves to an array of stripped application objects.
   */
  async function getStrippedApplications() {
    // Define a helper function to strip unnecessary data from an object
    const stripObject = (obj) => {
      // Extract the values of each key-value pair in the object
      const keys = Object.keys(obj);
      // Create a new object with only the first value of each key-value pair
      const strippedObj = keys.reduce((stripped, key) => {
        stripped[key] = Object.values(obj[key])[0];
        return stripped;
      }, {});
      return strippedObj;
    };

    // Retrieve the list of applications from the DynamoDB database
    const db = await getDynamoApplicationList();

    // Strip unnecessary data from each application object in the database
    const strippedItems = db.map(stripObject);

    return strippedItems;
  }

  /**
   * Retrieves page data based on the given context path.
   * @param {Object} context - The context object containing the path.
   * @returns {Promise} - A promise that resolves to the page data.
   */
  async function getPageDataByPath(context) {
    // Retrieving page data using the getPathData method and the context path
    const pageData = await getPathData(context.path);

    return pageData;
  }

  /**
   * Retrieves the component from the library or fetches it from the connector.
   * @param {Object} context - The context object containing the library, selected component, and component data.
   * @returns {Promise<Object>} - The component object.
   */
  async function loadComponent(context) {
    const { Library, selectedComponent, componentData } = context;

    // Find the component in the local library
    const local = Library.find(
      (f) => f.ComponentName === selectedComponent.ComponentType
    );

    // If the component is found in the local library and the component data is not the same as the selected component type,
    // return the local component
    if (
      local &&
      componentData?.ComponentName !== selectedComponent.ComponentType
    ) {
      return local;
    }

    // Fetch the component from the connector
    return await getComponent(selectedComponent.ComponentType);
  }

  /**
   * This function commits an application with the given context.
   * It sets the isDeleted property to true in the appData object.
   * @param {Object} context - The context object.
   * @returns {Promise} - A promise that resolves when the application is committed.
   */
  async function commitApplicationWithDeletedFlag(context) {
    const appDataWithDeletedFlag = {
      ...context.appData,
      isDeleted: true,
    };
    await commitApplication(appDataWithDeletedFlag);
  }

  /**
   * Creates a new application with the given context.
   * @param {Object} context - The context object containing the application details.
   * @param {string} context.name - The name of the application.
   * @returns {Promise<string>} - A promise that resolves to the ID of the newly created application.
   */
  async function createApplication(context) {
    // Generate a unique ID for the new application
    const ID = generateGuid();

    // Create a new application object with the given context
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

    // Commit the new application to the database
    await commitApplication(newApp);

    // Return the ID of the newly created application
    return ID;
  }

  /**
   * Asynchronously loads bindings for a selected component.
   * @param {Object} context - The context object containing the selected component and its settings.
   */
  async function loadDataBindingMachine(context) {
    // Find the 'bindings' setting for the selected component
    const bound = context.selectedComponent.settings.find(
      (setting) => setting.SettingName === "bindings"
    );

    // Send a message to the binder with the type 'load' and the bindings value
    binder.send({
      type: "load",
      bindings: bound?.SettingValue || "{}",
    });
  }

  async function invokeEventList(context, eventType, eventOwner, css) {
    const { appData, page, clientLib } = context;

    // Check if the invoker state can load
    if (!invoker.state.can("load")) {
      return;
    }

    // Determine the type based on the invoker state
    const type = invoker.state.can("append") ? "append" : "load";

    // Filter the appData events for the specified eventType
    const invoked = eventOwner.events.filter((f) => f.event === eventType);

    // If no events are invoked, return
    if (!invoked.length) {
      return;
    }

    // Log the invocation details
    console.log(
      "INVOKE %c%s",
      `border:${css};color:lime`,
      eventType,
      type,
      state.value
    );
    // Send the invocation details to the invoker
    invoker.send({
      type,
      eventType,
      events: invoked,
      options: {},
      application: appData,
      page,

      clientLib,
    });
  }

  /**
   * Asynchronously invokes an application load event.
   * @param {Object} context - The context object containing appData, page and clientLib
   */
  async function invokeApplicationLoad(context) {
    invokeEventList(
      context,
      "onApplicationLoad",
      context.appData,
      "solid 1px lime"
    );
  }

  /**
   * Asynchronously invokes a function based on the given context.
   * @param {Object} context - The context object containing appData, page and clientLib
   */
  async function invokePageLoad(context) {
    invokeEventList(context, "onPageLoad", context.page, "dotted 1px lime");
  }

  /**
   * Retrieves data from a resource and resolves rows based on the resource's node path.
   * @param {Object} context - The context object containing page and appData.
   * @returns {Object} - An object containing the key and rows.
   */
  async function invokeComponentResources(context) {
    const { page, appData } = context;

    // Find the component with the "bindings" setting
    const bound = page.components.find((component) =>
      component.settings.some((setting) => setting.SettingName === "bindings")
    );

    // Reduce the settings of the bound component
    const args = reduceSettings(bound.settings);

    // Parse the bindings argument as JSON
    const json = JSON.parse(args.bindings);

    // Find the resource with the matching ID
    const resource = appData.resources.find(
      (resource) => resource.ID === json.resourceID
    );

    // Find the connection with the matching ID
    const connection = appData.connections.find(
      (connection) => connection.ID === resource.connectionID
    );

    // Invoke the resource using the connection
    const data = await invokeResource(connection, resource);

    // Resolve rows based on the resource's node path
    const rows = resolveRows(data, resource.node.split("/"));

    return {
      key: json.resourceID,
      rows: rows,
    };
  }

  /**
   * This function takes a context object and performs some operations based on its properties.
   * @param {Object} context - The context object containing configuration and data.
   * @returns {boolean} - Returns true if the operations are successful.
   */
  async function loadConfigurationMachine(context) {
    // Get the machine based on the configuration type
    const machine = configMachines[context.configurationType];

    // If no machine is found, display an alert and return
    if (!machine) {
      alert(`No machine for "${context.configurationType}"`);
      return false;
    }

    // Destructure the page object from the context, defaulting to empty arrays
    const { state = [], scripts = [] } = context.page || {};

    // Log the appData property of the context object
    console.log({ app: context.appData });

    // Send a message to the machine with relevant data
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

    // Return true to indicate successful operations
    return true;
  }

  /**
   * Updates a component in the context using the given data.
   * @param {Object} context - The context object.
   * @returns {Promise} - A promise that resolves when the component is updated.
   */
  async function commitComponentDefinition(context) {
    // Destructure the componentData from the context object
    const { componentData } = context;

    // Create a new component object with the updated attributes
    const component = {
      ...componentData,
      Attributes: JSON.stringify(componentData.Attributes),
    };

    // Call the setComponent method from the connector module to update the component
    return await setComponent(component);
  }

  // helper function for components to invoke events
  const invokeEvent = (events, eventType, options, e) => {
    const { page, appData, clientLib } = state.context;

    if (!events) return;
    const invoked = events
      .filter((f) => f.event === eventType)
      .filter((f) => f.action.type !== "setState");
    const setters = events
      .filter((f) => f.event === eventType)
      .filter((item) => item.action.type === "setState");

    // console.log({ invoked, setters, appData });

    if (!appData) return;

    let updatedClientLib = clientLib;

    if (setters.length) {
      // console.log({ setters: setters.length });
      setters.map((step) => {
        send({
          type: "update state",
          options,
          step,
        });
      });

      // console.log({ setters });
      updatedClientLib = setters.reduce((out, step) => {
        const up = actions.getUpdatedAppState(state.context, {
          options,
          step,
        }).clientLib;
        return {
          ...out,
          ...up,
        };
      }, clientLib);

      // console.log({ updatedClientLib });
    }

    if (!invoked.length) return;
    invoker.send({
      type: "load",
      eventType,
      page,
      events: invoked,
      options,
      application: appData,
      clientLib: updatedClientLib,
      e,
    });
  };

  const services = {
    getData: retrieveDemoData,
    getLibraryData: getComponentsAsync,
    getAppKey: getApplicationFromContext,
    getAppKeys: getStrippedApplications,
    getDataFromPath: getPageDataByPath,
    loadComponent: loadComponent,
    dropApp: commitApplicationWithDeletedFlag,
    createNewApp: createApplication,
    loadDataBindingMachine,
    invokeAppLoad: invokeApplicationLoad,
    invokePageLoad,
    invokeComponentResources,
    loadConfigurationMachine,
    commitComponentDefinition,
    getInvokerLoadState: async () => true, // invoker.state.can("load"),
    invokeEvent,
  };

  const [state, send] = useMachine(reactlyMachine, { services });

  // launches one of the configuration machines to edit some
  // advanced property of the application
  const configureApp = (type) => {
    const { appData, setupData, resourceData, page, clientLib } = state.context;
    const {
      state: appState,
      scripts: appScripts,
      resources,
      connections,
    } = appData;

    // send current app state to the selected config machine
    configMachines[type].send({
      type: "load",
      state: page?.state,
      scripts: page?.scripts,
      appState,
      appScripts,
      resources,
      connections,
      resourceData,
      setupData,
      clientLib,
    });

    setConfigurationType(type);
  };

  // helper function to change context values
  const setContext = (name, value) => {
    send({
      type: "set context",
      name,
      value,
    });
  };
  // machine list to pass to the debugger
  const machineList = {
    Reactly: { actions, state, send, states: reactlyMachine.states, services },
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
