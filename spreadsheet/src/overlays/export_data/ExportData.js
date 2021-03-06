/* eslint-disable react/destructuring-assignment */
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTimes,
    faFilePdf,
    faFileExcel,
    faFileCsv
} from "@fortawesome/free-solid-svg-icons";

import JSPDF from "jspdf";
import "jspdf-autotable";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PropTypes from "prop-types";

let downLaodFileType = [];
class ExportData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columnValueList: this.props.columnsList,
            columnEntityList: this.props.columnsList,
            isAllSelected: true,
            downLaodFileType: [],
            filteredRow: [],
            warning: "",
            clickTag: "none"
        };
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.selectDownLoadType = this.selectDownLoadType.bind(this);
        this.exportValidation = this.exportValidation.bind(this);
    }

    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    resetColumnExportList = () => {
        this.setState({
            columnEntityList: [],
            isAllSelected: false
        });
    };

    selectAllToColumnList = () => {
        this.resetColumnExportList();
        this.setState({
            // eslint-disable-next-line react/no-access-state-in-setstate
            columnEntityList: !this.state.isAllSelected
                ? this.props.columnsList
                : [],
            // eslint-disable-next-line react/no-access-state-in-setstate
            isAllSelected: !this.state.isAllSelected
        });
    };

    addToColumnEntityList = (typeToBeAdded) => {
        // eslint-disable-next-line react/no-access-state-in-setstate
        let existingColumnEntityList = this.state.columnEntityList;
        if (!existingColumnEntityList.includes(typeToBeAdded)) {
            existingColumnEntityList.push(typeToBeAdded);
        } else {
            existingColumnEntityList = existingColumnEntityList.filter(
                (item) => {
                    return item !== typeToBeAdded;
                }
            );
        }
        this.setState({
            columnEntityList: existingColumnEntityList,
            isAllSelected: false
        });
    };

    selectDownLoadType = (event) => {
        if (
            event.target.checked &&
            !this.state.downLaodFileType.includes(event.target.value)
        ) {
            downLaodFileType.push(event.target.value);
            this.setState({ downLaodFileType });
        } else {
            downLaodFileType.forEach(function (value, index) {
                if (value === event.target.value) {
                    downLaodFileType = downLaodFileType.splice(index, value);
                }
            });
            this.setState({ downLaodFileType });
        }
    };

    exportRowData = () => {
        const columnVlaueList = this.state.columnEntityList;
        if (
            columnVlaueList.length > 0 &&
            this.state.downLaodFileType.length > 0
        ) {
            this.props.rows.forEach((row) => {
                const keys = Object.getOwnPropertyNames(row);
                const filteredColumnVal = {};
                keys.forEach(function (key) {
                    columnVlaueList.forEach((columnName) => {
                        if (columnName.key === key)
                            filteredColumnVal[key] = row[key];
                    });
                });
                this.state.filteredRow.push(filteredColumnVal);
            });

            this.state.downLaodFileType.forEach((item) => {
                if (item === "pdf") this.downloadPDF();
                else if (item === "excel") this.downloadXLSFile();
                else this.downloadCSVFile();
            });
        }
    };

    downloadPDF = () => {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "landscape"; // portrait or landscape

        const marginLeft = 300;
        const doc = new JSPDF(orientation, unit, size);

        doc.setFontSize(15);

        const title = "iCargo Report";
        const headers = [
            this.state.columnEntityList.map((column) => {
                return column.name;
            })
        ];
        const dataValues = [];
        this.props.rows.forEach((row) => {
            const keys = Object.keys(row);
            const filteredColumnVal = [];
            this.state.columnEntityList.forEach((columnName) => {
                keys.forEach((key) => {
                    if (columnName.key === key)
                        filteredColumnVal.push(row[key]);
                });
            });
            dataValues.push(filteredColumnVal);
        });

        const content = {
            startY: 50,
            head: headers,
            body: dataValues
        };

        doc.text(title, marginLeft, 40);
        doc.autoTable(content);
        doc.save("report.pdf");
    };

    downloadCSVFile = () => {
        const fileType =
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const fileExtension = ".csv";
        const fileName = "CSVDownload";
        const ws = XLSX.utils.json_to_sheet(this.state.filteredRow);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "csv", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    };

    downloadXLSFile = () => {
        const fileType =
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const fileExtension = ".xlsx";
        const fileName = "XLSXDownload";
        const ws = XLSX.utils.json_to_sheet(this.state.filteredRow);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    };

    columnSearchLogic = (e) => {
        const searchKey = String(e.target.value).toLowerCase();
        const filteredRows = this.props.columnsList.filter((item) => {
            return item.name.toLowerCase().includes(searchKey);
        });
        if (!filteredRows.length) {
            this.setState({ columnValueList: this.props.columnsList });
        } else {
            this.setState({ columnValueList: filteredRows });
        }
    };

    exportValidation = () => {
        const columnLength = this.state.columnEntityList.length;
        const fileLength = this.state.downLaodFileType.length;
        if (columnLength > 0 && fileLength > 0) {
            this.exportRowData();
            this.setState({ clickTag: "none" });
        } else if (columnLength === 0) {
            this.setState({ warning: "Column" });
            this.setState({ clickTag: "" });
        } else if (fileLength === 0) {
            this.setState({ warning: "File Type" });
            this.setState({ clickTag: "" });
        }
        if (columnLength === 0 && fileLength === 0) {
            this.setState({ warning: "File Type & Column" });
            this.setState({ clickTag: "" });
        }
    };

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.props.closeExport();
        }
    }

    render() {
        return (
            <div className="exports--grid" ref={this.setWrapperRef}>
                <div className="export__grid">
                    <div className="export__chooser">
                        <div className="export__header">
                            <div className="">
                                <strong>Export Data</strong>
                            </div>
                        </div>
                        <div className="export__body">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Search export"
                                    className="custom__ctrl"
                                    onChange={this.columnSearchLogic}
                                />
                            </div>
                            <div className="export__wrap export__headertxt">
                                <div className="export__checkbox">
                                    <input
                                        className="selectColumn"
                                        type="checkbox"
                                        onChange={() =>
                                            this.selectAllToColumnList()
                                        }
                                        checked={this.state.isAllSelected}
                                    />
                                </div>
                                <div className="export__txt">Select All</div>
                            </div>
                            {this.state.columnValueList &&
                            this.state.columnValueList.length > 0
                                ? this.state.columnValueList.map((column) => {
                                      return (
                                          <div
                                              className="export__wrap"
                                              key={column.key}
                                          >
                                              <div className="export__checkbox">
                                                  <input
                                                      type="checkbox"
                                                      checked={this.state.columnEntityList.includes(
                                                          column
                                                      )}
                                                      onChange={() =>
                                                          this.addToColumnEntityList(
                                                              column
                                                          )
                                                      }
                                                  />
                                              </div>
                                              <div className="export__txt">
                                                  {column.name}
                                              </div>
                                          </div>
                                      );
                                  })
                                : ""}
                        </div>
                    </div>
                    <div className="export__settings">
                        <div className="export__header">
                            <div className="export__headerTxt" />
                            <div className="export__close">
                                <FontAwesomeIcon
                                    icon={faTimes}
                                    className="icon-close"
                                    onClick={this.props.closeExport}
                                />
                            </div>
                        </div>
                        <div className="export__as">Export as</div>
                        <div className="export__body">
                            <div className="export__reorder">
                                <div className="">
                                    <input
                                        type="checkbox"
                                        name="pdf"
                                        value="pdf"
                                        onChange={this.selectDownLoadType}
                                    />
                                </div>
                                <div className="export__file">
                                    <FontAwesomeIcon
                                        icon={faFilePdf}
                                        className="temp"
                                    />
                                </div>
                            </div>
                            <div className="export__reorder">
                                <div className="">
                                    <input
                                        type="checkbox"
                                        name="excel"
                                        value="excel"
                                        onChange={this.selectDownLoadType}
                                    />
                                </div>
                                <div className="export__file">
                                    <FontAwesomeIcon
                                        icon={faFileExcel}
                                        className="temp"
                                    />
                                </div>
                            </div>
                            <div className="export__reorder">
                                <div className="">
                                    <input
                                        type="checkbox"
                                        name="csv"
                                        value="csv"
                                        onChange={this.selectDownLoadType}
                                    />
                                </div>
                                <div className="export__file">
                                    <FontAwesomeIcon
                                        icon={faFileCsv}
                                        className="temp"
                                    />
                                </div>
                            </div>
                            <div className="exportWarning">
                                <span
                                    style={{ display: this.state.clickTag }}
                                    className="alert alert-danger"
                                >
                                    You have not selected{" "}
                                    <strong>{this.state.warning}</strong>
                                </span>
                            </div>
                        </div>
                        <div className="export__footer">
                            <div className="export__btns">
                                <button
                                    type="button"
                                    className="btns"
                                    onClick={() => this.props.closeExport()}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btns btns__save"
                                    onClick={() => {
                                        this.exportValidation();
                                    }}
                                >
                                    Export
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ExportData.propTypes = {
    columnsList: PropTypes.any,
    closeExport: PropTypes.any,
    rows: PropTypes.any
};

export default ExportData;
