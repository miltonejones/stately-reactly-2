import Flex from "./Flex";
import { TabButton } from "./TabButton";
import { TabList } from "./TabList";

const TabMenu = ({ tabs, value, onClick }) => {
  return (
    <Flex sx={{ borderBottom: 1, borderColor: "divider" }}>
      <TabList value={value} variant="scrollable">
        {tabs.map((tab, i) => (
          <TabButton
            key={tab.label}
            {...tab}
            onClick={() => onClick(i)}
            iconPosition="end"
          />
        ))}
      </TabList>
    </Flex>
  );
};

export default TabMenu;
