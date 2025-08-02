import React from "react";
import "./FilenameInput.css";

export default function FilenameInput({ filename, setFilename }) {
    return (
        <div className="filename-box">
            <label className="filename-label">📝 Output Filename</label>
            <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="filename-input"
                placeholder="Enter file name here..."
            />
            <p className="filename-hint">The file will be saved as <strong>{filename || "Question Paper"}.docx</strong></p>
        </div>
    );
}
