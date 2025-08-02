import React from "react";
import "./ChapterSlider.css";

export default function ChapterSlider({ chapter, markKey, count, total, onChange }) {
    return (
        <div className="slider-group">
            <label>
                {chapter} (Selected: {count} of {total})
                <input
                    type="range"
                    min={0}
                    max={total}
                    value={count}
                    onChange={(e) => onChange(markKey, chapter, e.target.value)}
                    className="slider"
                />
            </label>
        </div>
    );
}
