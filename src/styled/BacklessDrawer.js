
import React from 'react';
import { Drawer, Card, styled } from '@mui/material';


const Backless = styled(Card)(({ open }) => ({
  height: open ? "fit-content" : 0,
  position: 'fixed',
  top: 'auto',
  bottom: 0,
  right: 0,
  width: '100vw',
  backgroundColor: "#fff",
  zIndex: 400
}))


const BacklessDrawer = ({children,  ...props}) => {
  return (
   <Backless  
     ModalProps={{
       slots: { backdrop: "div" },
       slotProps: {
         root: { //override the fixed position + the size of backdrop
           style: { 
             position: "absolute",
             top: "unset",
             bottom: "unset",
             left: "unset",
             right: "unset",
           },
         },
       },
       }}  {...props}>
 {children}
     </Backless>
  );
 }

export default BacklessDrawer;
