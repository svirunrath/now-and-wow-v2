import { useEffect, useState } from "react";
import { Select, DatePicker, Button, Table } from "antd";
import "./Report.css";
import { saleReportColumn } from "./ReportColumns.js";
import { useLazyRetrieveSaleReportQuery } from "../../slices/reportSlices.js";
import { toast } from "react-toastify";
const { Option } = Select;
const { RangePicker } = DatePicker;

const Report = () => {
  //Report Type
  const [reportTitle, setReportTitle] = useState("Report");
  const [selectedReportType, setSelectedReportType] = useState("");
  const reportType = [{ key: "sale", value: "sale", label: "Sale Report" }];
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [reportColumns, setReportColumns] = useState([]);
  const [retrieveSaleReport] = useLazyRetrieveSaleReportQuery({
    startDate,
    endDate,
  });

  useEffect(() => {
    if (selectedReportType === "sale") {
      setReportColumns(saleReportColumn);
    }
  }, [selectedReportType]);

  const handleSearch = async () => {
    if (selectedReportType == "sale") {
      const { data, isLoading } = await retrieveSaleReport({
        startDate,
        endDate,
      });

      if (!isLoading && data) {
        setDataSource(data.outputData);
      }
    } else {
      toast.error("Please select a report type.");
    }
  };

  return (
    <>
      <div className="report-main-container">
        <div className="report-header">
          <header>{reportTitle}</header>
          <div className="report-inquiry">
            <p>Report Type: </p>
            <Select
              className="main-category-select"
              value={selectedReportType}
              onChange={(value, options) => {
                setSelectedReportType(value);
                setReportTitle(options.label);
              }}
            >
              {reportType.map((a) => {
                return (
                  <Option key={a.key} value={a.value} label={a.label}>
                    {a.label}
                  </Option>
                );
              })}
            </Select>
            <p>Inquiry Period:</p>
            <RangePicker format="YYYY-MM-DD" />
            <Button type="primary" onClick={handleSearch}>
              Search
            </Button>
          </div>
        </div>
        <div className="report-body">
          <Table columns={reportColumns} dataSource={dataSource}></Table>
          <div className="btn-container">
            <Button type="primary" className="btn-download">
              Download Excel
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Report;
