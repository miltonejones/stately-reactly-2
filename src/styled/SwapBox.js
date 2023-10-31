import React from "react";
import { Box, styled } from "@mui/material";
import { useImageSwap } from "../machines/imageswapMachine";

export default function SwapBox({ src, alt, width, height }) {
  const swap = useImageSwap();
  const swapping = swap.state.matches("swapping");
  const idleClassName = swapping
    ? "photo-swappable image-swapped swapping"
    : "photo-swappable image-idle";
  const swapClassName = swapping
    ? "photo-swappable image-idle swapping"
    : "photo-swappable image-standby";
  const style = { width, height };
  React.useEffect(() => {
    const type = swap.state.can("swap") ? "swap" : "init";
    swap.send({
      type,
      pic: src,
    });
  }, [src]);
  return (
    <>
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          outline: "solid 3px red",
          width,
          height,
        }}
      >
        {!!swap.mainPic && (
          <img
            src={swap.mainPic}
            alt={alt}
            className={idleClassName}
            style={style}
          />
        )}

        {!!swap.swapPic && !swap.state.can("swap") && (
          <img
            src={swap.swapPic}
            alt={alt}
            className={swapClassName}
            style={style}
          />
        )}
      </Box>
    </>
  );
}
