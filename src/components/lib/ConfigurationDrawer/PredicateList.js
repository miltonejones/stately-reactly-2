import { Stack, TextField } from "@mui/material";
import SearchInput from "../../../styled/SearchInput";
import Columns from "../../../styled/Columns";
import ChipMenu from "../../../styled/ChipMenu";
import { TinyButton } from "../../../styled/TinyButton";
import Warning from "../../../styled/Warning";

const operators = ["or", "and"];
const predicates = [
  "is",
  "is not",
  "contains",
  "is greater than",
  "is less than",
];
const conditions = ["is null", "is not null"];
export default function PredicateList({ resource, onChange, onDrop }) {
  const ises = [...predicates, ...conditions];

  const handleChange = (p) => (event) => {
    onChange(p, event.target.name, event.target.value);
  };

  if (!resource.predicates?.length)
    return <Warning>No filters have been created.</Warning>;

  return (
    <Stack spacing={1}>
      {resource.predicates.map((predicate, k) => (
        <Columns key={k} columns="72px 1fr 1fr 1fr 22px">
          {k === 0 ? (
            <i />
          ) : (
            <ChipMenu
              value={operators.indexOf(predicate.operator)}
              options={operators}
              onChange={(i) => onChange(predicate, "operator", operators[i])}
            />
          )}
          <SearchInput
            disabled={k > 0 && !predicate.operator}
            name="property"
            onChange={handleChange(predicate)}
            value={predicate.property}
            options={resource.columns}
          />
          <SearchInput
            disabled={k > 0 && !predicate.operator}
            name="condition"
            onChange={handleChange(predicate)}
            value={predicate.condition}
            options={ises}
          />
          <TextField
            disabled={
              predicates.indexOf(predicate.condition) < 0 ||
              (k > 0 && !predicate.operator)
            }
            name="operand"
            onChange={handleChange(predicate)}
            value={predicate.operand}
            size="small"
          />
          <TinyButton onClick={() => onDrop(predicate)} icon="Delete" />
        </Columns>
      ))}
    </Stack>
  );
}
