import React from "react";
import "./MarksProgressBar.css";

export default function MarksProgressBar({ current, total }) {
    const percentage = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;

    return (
        <div className="marks-progress-wrapper">
            <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${percentage}%` }}></div>
            </div>
            <span className="marks-label">{current}/{total} Marks</span>
        </div>
    );
}
