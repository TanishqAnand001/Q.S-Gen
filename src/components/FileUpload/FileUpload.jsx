import React, { useRef } from "react";
import "./FileUpload.css";

export default function FileUpload({ setQuestions, setChapterOptions, setChapterWiseCount }) {
    const fileInputRef = useRef();

    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const csv = e.target.result;
            const lines = csv.split("\n").filter(line => line.trim() !== "");
            const headers = lines[0].split(",").map(h => h.trim());

            const rows = lines.slice(1).map(line => {
                const values = line.split(",").map(v => v.trim());
                const obj = {};
                headers.forEach((h, i) => {
                    obj[h] = values[i] || "";
                });
                return obj;
            });

            const filtered = rows.filter(row => row.Question && row.Chapter && row.Marks && row.Type);

            // Normalize Marks as numbers
            filtered.forEach(q => q.Marks = Number(q.Marks));

            setQuestions(filtered);

            const chapters = [...new Set(filtered.map(q => q.Chapter))];
            setChapterOptions(chapters);

            const initialCount = {};
            chapters.forEach(c => initialCount[c] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
            setChapterWiseCount(initialCount);
        };

        reader.readAsText(file);
    }

    function triggerFilePicker() {
        fileInputRef.current.click();
    }

    return (
        <div className="upload-box" onClick={triggerFilePicker}>
            <input
                type="file"
                accept=".csv"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="upload-hidden"
            />
            <div className="upload-instructions">
                <p className="upload-title">📂 Upload CSV File</p>
                <p className="upload-note">Click here or drag & drop to upload</p>
                <p className="upload-supported">Only .csv files are supported</p>
            </div>
        </div>
    );
}
