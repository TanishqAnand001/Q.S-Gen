import React, { useState } from "react";
import ChapterSlider from "../ChapterSlider/ChapterSlider.jsx";
import "./MarksSection.css";

export default function MarksSection({
    markKey,
    chapterOptions,
    questions,
    chapterWiseCount,
    updateChapterCount
}) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="marks-section">
            <button className="collapsible-btn" onClick={() => setCollapsed(!collapsed)}>
                {collapsed ? "➕" : "➖"} Section {markKey}
            </button>
            {!collapsed && (
                <>
                    {chapterOptions.map((chapter) => {
                        const total = questions.filter((q) => {
                            const isCase = q.Type === "CaseBased";
                            const markMatch =
                                markKey === "4+" ? Number(q.Marks) >= 4 : Number(q.Marks) === Number(markKey);

                            // Exclude CaseBased questions from sliders
                            return (
                                q.Chapter === chapter &&
                                markMatch &&
                                !isCase
                            );
                        }).length;

                        return (
                            <ChapterSlider
                                key={`${markKey}-${chapter}`}
                                chapter={chapter}
                                markKey={markKey}
                                count={chapterWiseCount[markKey]?.[chapter] || 0}
                                total={total}
                                onChange={updateChapterCount}
                            />
                        );
                    })}
                </>
            )}
        </div>
    );
}
