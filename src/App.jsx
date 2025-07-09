import React from "react";
import "./styles/Global.css";

import FileUpload from "./components/FileUpload/FileUpload";
import FilenameInput from "./components/FilenameInput/FilenameInput";
import MarksProgressBar from "./components/MarksProgressBar/MarksProgressBar";
import ThemeToggle from "./components/ThemeToggle/ThemeToggle";
import Preview from "./components/Preview/Preview";
import MarksSection from "./components/MarksSection/MarksSection";
import DataSourceToggle from "./components/DataSourceToggle/DataSourceToggle"
import { randomizeQuestions } from "./hooks/useSettings";;
import StatsDashboard from "./components/StatsDashboard/StatsDashboard";

import { generateDocFile } from "./utils/docGenerator";
import getFilteredQuestions from "./utils/filterQuestions";
import useSettings from "./hooks/useSettings";

export default function QuestionPaperGenerator() {
    const {
        questions,
        chapterOptions,
        chapterWiseCount,
        updateChapterCount,
        filename,
        setFilename,
        totalMarksLimit,
        setTotalMarksLimit,
        theme,
        toggleTheme,
        extension,
        setExtension,
        dataSource,
        setDataSource,
        setQuestions,
        setChapterOptions,
        setChapterWiseCount,
        randomizeQuestions
    } = useSettings();

    const selectedQuestions = getFilteredQuestions(
        questions, chapterWiseCount, chapterOptions, totalMarksLimit
    );

    const currentMarks = selectedQuestions.reduce((sum, q) => sum + Number(q.Marks), 0);

    return (
        <>
            <h2 className="page-title">📘 Question Paper Generator</h2>

            <div className={`container ${theme === "dark" ? "dark" : "light"}`}>
                <div className="settings fancy-box">
                    <DataSourceToggle dataSource={dataSource} setDataSource={setDataSource} />

                    {dataSource === "csv" && (
                        <FileUpload
                            setQuestions={setQuestions}
                            setChapterOptions={setChapterOptions}
                            setChapterWiseCount={setChapterWiseCount}
                        />
                    )}

                    <FilenameInput filename={filename} setFilename={setFilename} />

                    <div className="fancy-marks-limit">
                        <label htmlFor="marks-limit">🎯 Total Marks Limit</label>
                        <input
                            id="marks-limit"
                            type="number"
                            min="0"
                            value={totalMarksLimit}
                            onChange={(e) => setTotalMarksLimit(Number(e.target.value))}
                        />
                        <span className="marks-hint">0 : No Limit</span>
                    </div>

                    <button className="randomize-btn" onClick={randomizeQuestions}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="randomize-icon"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M18 10h-2.586l-2.707-2.707a1 1 0 00-1.414 1.414L13.586 12l-2.293 2.293a1 1 0 001.414 1.414L15.414 14H18a1 1 0 000-2zm-6-6a1 1 0 011 1v1h2a1 1 0 110 2h-2v1a1 1 0 11-2 0V8H9a1 1 0 010-2h2V5a1 1 0 011-1z" />
                        </svg>
                        Randomize Questions
                    </button>




                    <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

                    {["1", "2", "3", "4", "5"].map((markKey) => (
                        <MarksSection
                            key={markKey}
                            markKey={markKey}
                            chapterOptions={chapterOptions}
                            questions={questions}
                            chapterWiseCount={chapterWiseCount}
                            updateChapterCount={updateChapterCount}
                        />
                    ))}

                    <MarksProgressBar current={currentMarks} total={totalMarksLimit} />

                    <button
                        onClick={() => generateDocFile(filename, selectedQuestions, extension)}
                        className="generate-btn"
                    >
                        <img
                            src="/assets/doc.svg"
                            alt="Doc Icon"
                            style={{ width: "20px", height: "20px", marginRight: "8px" }}
                        />
                        Generate {extension.toUpperCase()} File
                    </button>


                </div>

                <div className="preview fancy-box">
                    <Preview questions={selectedQuestions} />
                </div>
            </div>

            <div className={`stats-wrapper fancy-box ${theme}`}>
                <StatsDashboard chapterWiseCount={chapterWiseCount} />
            </div>
        </>
    );
}
