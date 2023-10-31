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
    /** @xstate-layout N4IgpgJg5mDOIC5QCcwEMDGAXANgTwGJYwsACDAewDsswAPLAbQAYBdRUABwtgEste1DiDqIAtACYAHAFYAzADopzKRIBsAdjVrVc7QBoQecQEY1AFhMLm5mcxkm5JgJxzpagL4fDqTLjwKkPy8VFCkaJycOLwYaALUBAAWFAC2YCzsSCDcfPFUwqIIkg5SChrmzlLOzjJqzhZShsZFlhIKmmpy8iaOJlLmXV4+6Nj4gRDBoeGR0bF5BFRgAO6knGgwGcI5wUJZhZImzBoKtrVqRxJHtU2mzHLHcv1qDoddcjZDIL6jAUECUxEojE4oIqARKCkUvxyNQAGa8KAAV2QIOomyy2zyBXEEnMGmc1jucgqtic5lkNwQGj6SmYPQ0TmcKgqEk+33840mYUBs1RYIhULIYAAbmAaOFsKD0VweDt8nsceYLApqjISmZ7Mo1JS1WoFDJnNSpFpzEdLFI2SMOX8QtyZsD5hBkBROKQRWKmGwtrKsQqirj3goTBoSjIJDJym5KVVFPcHGHDrYTJa-GMbQD7XNQZz-mE1jACH9pdkfaDsUVeswFMTDXJnI4av0NJSNOGynoG5GpCYDSmfjnbdMgVnqAOpvmwAs0MKEXF0l6MaXdqBCj01G05JvnOYJPU6a5GkZbrIg5pNzplOSBn3rRNc0PeXkx3n1pO0sgNguZbky36I1WdGccNyWkCQNCkQ9mjEQ4ZFKakdyJXETAqC1vC+K00zvQceQdbN0xfAtUGILAMBwdAqGLTFfxXRBkP6INE0OJk7nMPFKWgzUymQy5NyQlCb0wrkH1w0d8NWV8CERTgIDnIdKKXeUaIQYMKmscCGSvCQA21I8K04+CeLcSx+LQ9lBPvHCRyoZ9xILKSZNoOSTEyb85XLCQ+jaLRHlxNUXF1diYLg5C+ksOo6nkATfiwjNhz5GyJwIVAoF4WBaGQeSf2XEREC0mQGK6ZgagGLSQx0qCgq4hDeOMyoopsyz4rExL7NktK50yty-Wg9d8pcS4DVcXcXHMSkBircNzksesNBsHtPFMjDoqExqn2aiSMF8WhOt9JToNedoXCOBlKmDCR2PXPUjhMCRNxcY16rE1a8JigjJwAIxCCBSHa7avxLLLFJyitLoUW7HCVIq-O7SlbtKFRmHDd4HER2xHte4SrIS18FBwCg0G+lrpI6-6qOywopHXU8KhqJl8XqcraOkY4DU6ebZvkNHFtTZaLMzJqMYnXH8cJiSCYgHbqOBxwun1RxcWUY1mNG3SbtqdpN2YGw6mNJxUOGHmGv5tbBZxvGCdssAFHhVBMb5N1RRoWBwVSKISHnFyAa6pSejDdpKeJCCLHuO5KVC8xDsOCL7kpzp0ZW42XqEoXzdFmBrd4W3nuoB2PWdiE3e25zvUB8t6SrJU6x7ZQe3xORYdsPUUdVSotFu+O+bik3k7NkXLYz22J1zp2XZSQuPZL73pbUYNTwjbdY+eZww-6COZ6jmoY+0BaDf7J7E9E0309T-ubbAS3h6wWAFDWRFiFIWEKGQS-nboX6rbQWF0oACh7LWAEokpLSNl3JO94U59yFmfC+7onY3zQHfc+j9n6wKvpLcmtEDSlDcI4bsVwA6wzAhHU0BpIxL17NzPeGNs7WXWsfSBOMMCJDABgAA1qQE+78CDoKBoUNuJxKjI3sAaLoy9VbrljGGJwMg8TBg5h3bCB9aFHytifIWTCWHsM4VgOc3Di6LlLn6Q4ZgVRaWYBYBkdJiRhwkdWKRPZZEaHkZQ28CdQGHx7unMSBdqAenBHjYgPDyxTX1K4HQRCbqdEZspI4iggLhi1jUS46gNAKNio+MBg4hbeNdr4mgCgYBkB8YscUDk0AEAgL4hQIRhQUFYVbMyvNFHuOUZ4q2OSx55KwAUkgMJOklLIGUhANSKBWQyEEv04UyidBIVqMwN0xqKHAucNws03C3VYmku0LTsZeIxsUj0PSim5IGaQMphZkDOmQDfHAcRkEpAUI0kBGSPHgJxh07gAyjl9M+R6M5cQ0DDKoLUsZbAJl7VxCcdcAxK7yyVIaQKhwgzVCccGbQwY6Q73QobfeOy6HtP2Scw5hSfldP+ToggeA4DguBmId4sYZlvGQuuVw7E8SlFYoHYknk6z1C2Xbbuby9lCQOfk0VgyAUcJFpASSxM-qezJrw2i1IK73G3DYI4dJwxjVbNYQ0dw1SMi1pFFx5lmkvNaUKglIqiVittRKnRUqCYys+lQCWpMFJl3qBHCCeD1yqA1ZBRAeI2hFTWYao69h+U0N2da+84qFDivJWgJ1EAZWIioK691CrPV+i0mBasNg8SbjVNIGQOrQ36q6N0ZiWKnm4otbGmyCak1lNTTKygVB4RIlQDS1cegqyPBDMSJxWtKYq2aOSfKbg9D1G3JYMMlNo1KKbR8rpib7XJvbRAAgLoxQ-SwHgMisA+20RGu0RsQEbqPG7PXVWN0yiGnmYk2a+I63AIbSJS1WT3mEv6Yc1tkrU4yr3VQH6JBcwno9YYn2dgCTnDDOoXcWtDjNnvV5J9M8X1HBqMuvFKjm32o3f+0pQHpU7tAy-U9ylXDHFbPLYRw1yiBUUKSRWqLDg1xkHhxt+LCMke6YBx1wGKOcH3QAKQAMoAHkABy1GtLVH1BI8Mlxqh6DQxVVj8h2PUk43SbjpqmnpK-auv9vy7UCa3SJl2XaETInPmlI9E8DFTwpg+iMwYzrnAMrDR41hlC4lurdJkWlzA8dM3xtdXyhMpps06F01GMVXRKshWaUguidHYiklUDi6jgTAk2CLWMovmfXbF7dtnu0OdIFm20CnngRx6Fpfoqm6gDGywSNuu5tB0i0D2Qzu9XGd14wR6LhywCXKfqmwc4qFgUGo2IAktReX1jpH0PcYioJ2CsBivr1RZDSEGEZ55kWxtla+ZNq5M2phzapVBnNMHpbMrBj0JUQWwwofYnoPU3Y8SkjrCGRGchisCzafxizgm4T2eQLNzdxFczgjQFQDAYAcBJfkNO8dppNAZcqDqFQ1gduzQ1MyJUoPBU-uFfGojnbquw9u-DiDtpZUORc65Xa0slRWATDoTo5RLCacQK2LrOgQqVxkbiCnmTxy-ptQJjddme1w6swjlnsBpzs69pzimEElBi6ArUew1JKSdC65cUd2hyROBBydz9JXzvy8hwoDXooYRK+RHyCpVSRn1MeR+6hK7StO-Xa78+dOYd8iBSCvk4zoNudMEyNS8yDSlWZqb7QyL5B3G3EhFw0vXlU7jSr53Eee3h-h4esirOSaPYTwgOwa8wLMT6IdoCYdkL6ljpqfcTJDQF+-bL6nJfyvQ-L6S05Tnq9h+o9NMGVQNkvANwT+GdhHgHa1npwb2KqFuNG+D8bdqPe2yTVPycsQUdo4Pc56juhqzeQqK2GwI7YYnm1jYMxu4B9mZD181AsIiJEgJ8-loh3oURkBCBKlFhqlgU6kGkA898zsD8LtDl-9ADgDxRQDwC8Bo9RlY8wV48ddTAH0YV1kP9ZotZzpdI3AqwMszRNUdxYJWQ7dA98NkDf9DkEtXQfE0gaAKlnRuDodkAUgks6g2gdxwxahDQExyQLpbBI4wIzhDgPJkwWDECHd2CacFcuDSVeCsAkdL8cAzkBCksTQlBpBKZYJagPJy1dI6VZZLBjpOhF1Mtv8+NNp0BHI5sUgKAJhYQ8BFtKgJpqhKCiRuxcQw5tx2xKZbp6N-tUk1CRskCrVE0toK8BMDDUcjCPDa9J4iCih6wfUSECt1BNBWw2VwIlAGQJF7pzFnA3CCMcivDadkgeB0jIdSBD0xMFh6BPQ698iOJqQuIY5YjlBVRApngNYn1qgbojRkIGjwcmj2jytWj74k0ujJwEEsAKByA0jFsyj597ByQ0U7gKQ7DpAI4bBjQ+gQo-JrxEjzVkii9UjPDliYtVi3i-kqA0A0geiGB9iGQThK4wJ1Ax0DBdIqwjh+hDV6D7AZjwsHiTMNCUiliMDBMPi0TSBvjfj3pMBWFFseh7gwYKgVlYJygxD2IDRqwXANta4ftZAFiUjxZxIUQ0h0pd18TCCpZVxWJjhaZkIVB3gjh1ww5bo4lzFDUIxJc6hGTnjmS1hWT3ZkBwREhkdPx+juTaJbBLjcE3sGD6hKQhpplTQDNKYqhLBv81FXxk1vdoDfd4CcVWDG0rSYBk1cDQVWBb8tZcsgIVNSRrg7CYJjgPJppWs4Z9Yd9htHisYy8as206tQhnYoCrZ7T-dHT1D4pYzbZ4yvpbRYB3T8DPSuSMEEB3hHAVQLAdBZp6xZAhdlJO9dwVV6x7hDh1tZSpgcy3U8z-E2jasvoGsnAVQioMUdxZpWIG4qxqgdwpztBqzwJv9UTEofC-C8AsSfitdFVyxJB9x2h1xEZ5BVknFokxB54hysMNtqhawFy0jLZbSNzc09ozA8QwYGYbo6R7Bzx2Jh12wgIah7pNx+hrzXjbyL8sisTlhLYCSgII5hpqh8tbBqQqCKpkICRVAaznhNYegIynl3owBkFz5U5hYLZARSB6k8AkyfdYC-ccK8Kn4CKRYiLvoSKyL8yRkPTFsALjgcMBduxzhoL2IF8gwZFWzyhrpNx6pcL8LU1GKhxk0ZKMBkRUBxQyK7yYDalqLgFJK6LpKT4SKyl5LFK-kyKCy8g48NSSy6UiElBs9wx6ZwIahKT7A7Ewt6x+pLxbchsxgtLbZCLdLIg5KSVFgGBSKwBCAOKB1-YIxh0ip6xtU7DTRFA1QipWJuwwwnFtwJLaKfKGK-LXR9LAreiQqwr9EOdNSihq1SgIxZFUMzELA2U7h9Q4MUqewwJ8QETPKAhvL6KCYZK9KAUFBARYBKtQNFtJDJyGxwkaw4qoJFNzDgxREehXAWRMqpLfK+4+qdEBrIghqbNFgVhAQOLMclBjRcQKhzE6w70ZraC6h6VTRIknA7gVrtK1riL-L9KPRJsBVQQ1zfimE1T7ynt9gR1ShVBVBgwww1QtA6y0U9UY4uglRlBA4nrsqercq5KPrn4aEfrJxkyOL8RIT5rTrGNLrhd8pzgqg1Q7BjVjR31DYuqdL1q3r+qMavqc5sTz9kcwK9q5JiylVyrWIJo7hNAegVAxSSaihAS1UIIpSkMx1kbuqIBeqmbNqw9wL9rIhVLUyaLVqcrGa8r+rVbubAQTKpQCDzK+a6VKZUKIJGCKhq1jzoTkVnDtwrcBhsLNKsqFaYDgg0BogAAvAi3gMAtACAzWqih0-semwikIH2-2wO4OiAk2tEM2vIsqulcJQtSGcxMCaRQKO4NoHO40JKxGEXLwNCKgXwuAYQRpVOiykhfKSmFq2oWwWJWwiqFkRquotmENHQAfWui2jyKI6QYUwUy4SwQKEhIncxW9TQeQXuxE7ZffK1furcxwWCasR-KuOsWCNiOwywhiRwY6MweCVQjq07ZE54l0sAFevNJPWYxwakGRGeAM5oZlJuLWEORu+4Vsdst6GSqBTOc+LG1BeAVzfI8oDcUKSoKqjoCdWiP7ZFY4mw8CGFX+-uK++BV0ttETG+n2HLKOWOJieoaGrBfUSg38oLaCtBiBC2ABwea0kB3B6WMMCOYqckMNeE2GZrefWwaB98yoWm3fJIi+ofVRBhdOaBIeEB+BRBB+abRhsBsq2uNoNhsY+mZCLhpTFBzoXyUSwRqMpEsHFIjByRhhx2K+F3MUb6VBUgNIWADXGAJh1cFZasd4KdFwEU3SELfKSxcoVsTcck6h3uWhxhZhNhVNA9OcJxxAACoMMCB+vLeaGxDyIMRGQUlkf8BIs++3Ix54w-LAaJ8q8oY6gaYyYOL8pxBQhkLQDVbQIJ4fRnBXElWLQpyy37ANYSpUDragguly0km9VQep4vRp0vTdbB8jQpt7PUCKBfa9CCRwCe-KUkSxDLU0cGIZiHUfKzcZ51RWv4cDLASDSZuwEGkNGoNZfNQhZbEk6ke4OMGed29M4R3J0RzZmLMZsjXZnMa-Y9SZ-yARPTDeYctu3KXcfUG5h++5voDZ-J4jDonZtNPZu8F+SZ1wKwfEY+qJILaJSoOJ5QjLSmTVfRs1QxynV52FirETb5qTOTQplreDECdQPWACuBhAXFt8moaencc4FQGFlA-JK7abVOEfAZVpwczLGFDCgYE5oNcqoktehwXqeFcnBe1mwfP+ilsfZEEVv5NXUISZroY4HsVDI4nHLoU3OsMoC3WaK3DLRwPljg-JVWrMvkQpnBcwuo7eqG8o3SUGZwlwIIoHe47Jp0p48l-lqHY-T48UM-N1lJzVSmo3SMJC3KHcFUEdLSOsZQfOh1rQ53NAuAIApNLAkO5oUqiyswUoJanrXcHOtesaGRf2BCJa+QFJXNnV-JHQngj0SZ25k4PKGeeoQqOkNlNUdoHPeaKdXcNUDZ1E8VVprCkG5+gNmZY8ktUJZul22e1wWdm8ltDE9YvAMTBdgU-XY1uC4kY8hWPVWoAbRMBwH+1VmNdwvdloigXspNdmk9okqGWjOoue2GY4JsG6VwOMViVBp9oPAjeUkO9c9KSZ3cJZCGwqI7By1WM0asSoVuIqdjZgkNjMp8K+5NQpp+k4TmdQLjN4FjWeJKnQSXF2rmfD55p8LM8+TsiYRMt1rWCuWoKoKoMXUKSkxQJDdwbcYxZayDtg+8djvMrjy12tmIjoVZ1lsCPUbccofqGwUddQIC2SCcVpkMvUYempjLMekwL89epkUKfj9cHseW1NVpk0oD5+yaFuhkEFisG6UNYtYLAWm3ezl6pi-ylisVk0rvMqQlkMcewMlicFhkHOuE2CR5yOz2hm16-WnRMVoOIMdzhmU0Y0DLL8wMC8XrMe9cLQAL3W9LuSk+BSy5Iy0KsV9dpkGRfG9lFQOQxQVvWaFrPEFryr1GvWgK3pIKsgMipro4JQac2QFumKq9moMGUS+4Qd2oSmgbxWtG-Swa7dMV1tjWUKRGIdhkQKZQdoBCekC4yaPDyMry1LwL2S96mgT6rGr9xRiyt4AkHyOdFB986JEMcdim4uzUCrk7KOqroLjLtAF3TXNWocLL-zea1mCwFQcCcWsQYOIMIOVH6kZ+9qm7zqu7himOgQX23gAOjhIO7AsV2mM9iGiwOwdzvO4kOL1ZZGRsVCLwIAA */
    id: "reactly",

    initial: "before load",

    context: {
      path: "library",
      appTab: 0,
      pageTab: 0,
      componentTab: 0,
      componentData: null,
      preview: true,
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
                    invoke: {
                      src: "invokeAppLoad",
                    },

                    on: {
                      complete: [
                        {
                          target: "page data loaded",
                          cond: "no page has loaded",
                          actions: "reassignAppData",
                        },
                        {
                          target: "fire page events",
                          actions: "reassignAppData",
                        },
                      ],
                    },
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
                          1500: "send event message",
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
                actions: "assignCreatedComponent",
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
      "page is loading": (context) => {
        const loadOK =
          context.appLoading &&
          !(!!context.page && !context.page.components.length);

        const { appData } = context;
        const eventType = "onApplicationLoad";
        const invoked = appData.events?.filter((f) => f.event === eventType);

        return loadOK && !!invoked.length;
      },
      "no page has loaded": (context) => !context.page,
      "more keys": (context) => context.key_index < context.appKeys.length,
      "no unsaved component changes": (context) =>
        !context.selectedComponent?.dirty,
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
    Reactly: { state, send, states: reactlyMachine.states },
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
