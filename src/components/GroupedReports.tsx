import React, { useState } from "react";

export interface UploadedFile {
  name: string;
  content: any[];
  type: "preloaded" | "uploaded";
  date: string;
  tags: string[];
}

export interface GroupedReportsProps {
  reports: UploadedFile[];
  tabColors: Record<string, string>;
  onFileClick: (fileName: string) => void;
}

const GroupedReports: React.FC<GroupedReportsProps> = ({
  reports,
  tabColors,
  onFileClick,
}) => {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {}
  );

  const groupedReports = reports.reduce<Record<string, UploadedFile[]>>(
    (groups, report) => {
      const key = report.date.split("T")[0];
      if (!groups[key]) groups[key] = [];
      groups[key].push(report);
      return groups;
    },
    {}
  );

  const sortReports = (group: UploadedFile[]) => {
    return [...group].sort((a, b) => {
      const aName = a.name;
      const bName = b.name;

      if (!isNaN(Number(aName)) && !isNaN(Number(bName))) {
        return Number(aName) - Number(bName);
      }

      if (!aName) return 0;
      if (aName === bName) return 0;
      return aName.localeCompare(bName);
    });
  };

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  return (
    <div>
      {Object.entries(groupedReports).map(([group, groupReports]) => (
        <div key={group} style={{ marginBottom: "20px" }}>
          <h3
            onClick={() => toggleGroup(group)}
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            {group} ({groupReports.length}){" "}
            <span style={{ marginLeft: "10px" }}>
              {expandedGroups[group] ? "▼" : "▶"}
            </span>
          </h3>
          {expandedGroups[group] &&
            sortReports(groupReports).map((report) => (
              <div
                key={report.name}
                onClick={() => onFileClick(report.name)}
                style={{
                  marginLeft: "20px",
                  marginBottom: "10px",
                  cursor: "pointer",
                  color: tabColors[report.name] || "blue",
                }}
              >
                {report.name}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

export { GroupedReports };
