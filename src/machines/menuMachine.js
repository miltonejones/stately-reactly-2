import { createMachine, assign } from "xstate";
import { useMachine } from "@xstate/react";

export const menuMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5SzAF1QSwHZVgfQFswsBXAOgGMAbAexQgGIaAHYgbQAYBdRUZujJhpZeIAB6IALAE4yAdg4BmDnMUBGAExq1HSdoA0IAJ6IArAA4O8uXPMA2PXcWSNi0wF93hlOmy5CxOQsxH4MEMJgZNgAbjQA1pE+mDj4RKRkwVh+CDE0FACGQlicXCWi-LCCGMKiEgh2plZ20qZ2cmq2khytcoYmCKbSVq0uGnY65m6K0p7eaMn+aUGsWTgMYABOGzQbZMxUhQBmOwRkSX6pgRkr2bkFRSVlSCAVVTXPdYoNZBoy5v-maTOBSmSR9RCKOSSMjSHRjOzNcx6L6zEDnFIBdLUARrcJYSK5BJneYXTHkbGVHA5LCxe7VYrcJ58ARFWqIAC0WjI5lMpg0umkzVciPBCA0cm54rUii0klB5k0Gg0qPRiyumUgDApYCZLxZ9LZ9TksgUikhbnF0mNGlFam+vJUkhcbUaDjkKpJGKW12ImooAAt8jgddxyvr3qA6pNoRxtGoZI1XEpesZEBoFdy2goOk45aY7Z4vCAsDQIHBRKrLqQw5VWR8Oc1ubz+TIhV9pOZRezBmQ2umNNIE-Y1Fa7B7fF6rtqIDW3iJ6wgXKLfhKHGaNHz2s0-uOFlXliEcLO65GId1e3oOEj+d0kZ3UwM5BoyGpec5zNaVB4i5WyZRaJSUDHgaC52OKZCNJYkhyA0XSAqYorTPIkiKP8gyCkqG4zD+npqukGozs8rwnuIiDNGoZDdE+ZoyrY-w2g+qESoKbhuhwA42A4hbuEAA */
  id: "settings_menu",
  initial: "closed",
  states: {
    closed: {
      on: {
        open: {
          target: "opening",
          actions: assign((_, event) => ({
            anchorEl: event.anchorEl,
            value: event.value,
          })),
        },
      },
    },
    opening: {
      invoke: {
        src: "readClipboard",
        onDone: [
          {
            target: "opened",
            actions: assign({
              clipboard: (_, event) => event.data,
            }),
          },
        ],
        onError: [
          {
            target: "opened",
            actions: () => alert("Error loading clipboard"),
          },
        ],
      },
    },
    closing: {
      invoke: {
        src: "menuClicked",
        onDone: [
          {
            target: "closed",
          },
        ],
      },
    },
    opened: {
      on: {
        close: {
          target: "closing",
          actions: assign({
            anchorEl: null,
            value: (_, event) => event.value,
          }),
        },

        change: {
          internal: true,
          actions: assign((_, event) => ({
            [event.name]: event.value,
          })),
        },
      },
    },
  },
});

export const useMenu = (onChange) => {
  const [state, send] = useMachine(menuMachine, {
    services: {
      menuClicked: async (context, event) => {
        onChange && onChange(event.value);
      },
      readClipboard: async () => {
        const content = await navigator.clipboard.readText();
        // alert(content);
        return content;
      },
    },
  });
  const { anchorEl } = state.context;

  const handleClose = (value) => () =>
    send({
      type: "close",
      value,
    });

  const handleChange = (event) => {
    send({
      type: "change",
      name: event.target.name,
      value: event.target.value,
    });
  };

  const handleClick = (event, value) => {
    send({
      type: "open",
      anchorEl: event.currentTarget,
      value,
    });
  };

  const diagnosticProps = {
    id: menuMachine.id,
    states: menuMachine.states,
    state,
    send,
  };

  const menuProps = {
    open: !!anchorEl,
    onClose: handleClose(),
    anchorEl,
  };

  return {
    state,
    send,
    ...state.context,
    menuProps,
    anchorEl,
    handleClick,
    handleClose,
    handleChange,
    diagnosticProps,
  };
};
