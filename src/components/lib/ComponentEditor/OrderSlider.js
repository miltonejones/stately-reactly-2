import { Slider, Stack } from "@mui/material";
import { TinyButton } from "../../../styled/TinyButton";
import Nowrap from "../../../styled/Nowrap";

const sortByOrder = (a, b) => (a.order > b.order ? 1 : -1);

const OrderSlider = ({ ticks, value, onChange }) => {
  const handleSliderChange = (event, newValue) => {
    onChange && onChange(newValue);
  };

  if (!ticks.length) {
    return <i />;
  }

  const marks = ticks.sort((a, b) => (a.value > b.value ? 1 : -1));

  function valuetext(value, icon) {
    return <TinyButton icon={icon} />;
  }

  return (
    <Slider
      step={1}
      onChange={handleSliderChange}
      min={marks[0].value - 5}
      max={marks[marks.length - 1].value + 5}
      value={value}
      marks={marks.map((f) => ({
        ...f,
        label: valuetext(f.label, f.icon),
      }))}
      valueLabelDisplay="auto"
    />
  );
};

export default OrderSlider;
