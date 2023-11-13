import { Slider } from "@mui/material";
import { TinyButton } from "../../../styled/TinyButton";

const OrderSlider = ({ ticks, value, onChange }) => {
  const handleSliderChange = (_, newValue) => {
    onChange && onChange(newValue);
  };

  if (!ticks.length) {
    return <i />;
  }

  const marks = ticks.sort((a, b) => (a.value > b.value ? 1 : -1));

  function valuetext(_, icon) {
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
