import React from "react";
import "./DataSourceToggle.css";

export default function DataSourceToggle({ dataSource, setDataSource }) {
    return (
        <div className="data-toggle">
            <label>Select Data Source:</label>
            <div className="toggle-buttons">
                <button
                    className={dataSource === "csv" ? "active" : ""}
                    onClick={() => setDataSource("csv")}
                >
                    CSV
                </button>
                <button
                    className={dataSource === "db" ? "active" : ""}
                    onClick={() => setDataSource("db")}
                >
                    Database
                </button>
            </div>
        </div>
    );
}
