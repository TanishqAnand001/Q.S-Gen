import React from "react";
import "./Preview.css";

export default function Preview({ questions }) {
    const groupedSections = {
        A: [],
        B: [],
        C: [],
        D: [],
        E: [],
    };

    const usedCaseIDs = new Set();

    for (const q of questions) {
        // Skip case-based sub-questions if already added
        if (q.Type === "CaseBased" && q.CaseID && usedCaseIDs.has(q.CaseID)) continue;

        let section;

        // Handle CaseBased group
        if (q.Type === "CaseBased" && q.CaseID && !usedCaseIDs.has(q.CaseID)) {
            const block = questions.filter(
                (subQ) => subQ.CaseID === q.CaseID && subQ.Type === "CaseBased"
            );

            usedCaseIDs.add(q.CaseID);

            // ✅ Force Section E for all case-based questions
            section = "E";

            groupedSections[section].push({
                type: "caseBlock",
                paragraph: q.Paragraph,
                questions: block,
            });

            continue; // ✅ skip the rest for this block
        }

        // For regular questions
        const marks = Number(q.Marks);
        if (marks === 1) section = "A";
        else if (marks === 2) section = "B";
        else if (marks === 3) section = "C";
        else if (marks === 4) section = "D";
        else section = "E";

        groupedSections[section].push({
            type: "single",
            question: q,
        });
    }


    let index = 1;

    return (
        <div className="preview">
            <h3>Preview</h3>
            {questions.length === 0 ? (
                <div className="empty-preview">
                    <img src="/assets/box.svg" alt="No questions" />
                    <p>No questions selected yet. Adjust sliders or upload a CSV file.</p>
                </div>
            ) : (
                Object.entries(groupedSections).map(([section, items]) => {
                    if (!items.length) return null;

                    return (
                        <div key={section} className="preview-section">
                            <h4>Section {section}</h4>
                            <ul>
                                {items.map((item, idx) => {
                                    if (item.type === "caseBlock") {
                                        return (
                                            <li key={`case-${item.paragraph}-${idx}`} className="case-block">
                                                <p><strong>Paragraph:</strong> {item.paragraph}</p>
                                                <ol>
                                                    {item.questions.map((q, subIdx) => (
                                                        <li key={subIdx}>
                                                            <span
                                                                dangerouslySetInnerHTML={{
                                                                    __html: q.Question.replace(/\\n/g, "<br/>")
                                                                }}
                                                            /> ({q.Marks} Mark)
                                                        </li>
                                                    ))}
                                                </ol>
                                            </li>
                                        );
                                    } else {
                                        const { question: q } = item;
                                        const content = (
                                            <span
                                                dangerouslySetInnerHTML={{
                                                    __html: q.Question.replace(/\\n/g, "<br/>")
                                                }}
                                            />
                                        );
                                        return (
                                            <li key={idx}>
                                                {index++}. {content} ({q.Marks} Mark{q.Marks > 1 ? "s" : ""}, {q.Type || "Normal"})
                                            </li>
                                        );
                                    }
                                })}
                            </ul>
                        </div>
                    );
                })
            )}
        </div>
    );

}
