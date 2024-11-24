import React from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

interface ReportGridProps {
  data: any[];
}

const comparator = (aName: any, bName: any) => {
  if (!isNaN(Number(aName)) && !isNaN(Number(bName))) {
    return Number(aName) - Number(bName);
  }

  if (!aName) return -1;
  if (!bName) return 1;
  if (aName === bName) return 0;
  return aName.localeCompare(bName);
};

const ReportGrid: React.FC<ReportGridProps> = ({ data }) => {
  const columns = data.length
    ? Object.keys(data[0]).map((key) => ({
        field: key,
      }))
    : [];

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
      <AgGridReact
        rowData={data}
        columnDefs={columns}
        defaultColDef={{
          sortable: true,
          comparator: comparator,
        }}
        pagination={true}
      />
    </div>
  );
};

export default ReportGrid;
