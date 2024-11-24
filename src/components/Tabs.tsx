import React from "react";
import "../styles/Tabs.css";

interface TabsProps {
  tabs: string[];
  activeTab: string | null;
  onChangeTab: (tab: string) => void;
  onDeleteTab: (tab: string) => void;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChangeTab,
  onDeleteTab,
}) => {
  return (
    <div className="tabs-container">
      {tabs.map((tab) => (
        <div key={tab} className="tab">
          <button
            className={`tab-button ${tab === activeTab ? "active" : ""}`}
            onClick={() => onChangeTab(tab)}
          >
            {tab.replace(".csv", "")}
          </button>
          <button className="delete-button" onClick={() => onDeleteTab(tab)}>
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};

export default Tabs;
