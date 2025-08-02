import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

export async function generateDocFile(filename, questions, extension = "docx") {
    const cleanName = filename.trim() || "Question Paper";
    const fullName = `${cleanName}.docx`;

    const groupedSections = { A: [], B: [], C: [], D: [], E: [] };
    const usedCaseIDs = new Set();

    questions.forEach((q) => {
        const marks = Number(q.Marks);
        let section = "A";
        if (marks === 2) section = "B";
        else if (marks === 3) section = "C";
        else if (marks === 4) section = "D";
        else if (marks >= 5) section = "E";

        if (q.Type === "CaseBased" && q.CaseID && !usedCaseIDs.has(q.CaseID)) {
            const caseGroup = questions.filter(
                (item) => item.Type === "CaseBased" && item.CaseID === q.CaseID
            );

            // Always force into Section E regardless of individual marks
            groupedSections["E"].push({
                type: "caseBlock",
                paragraph: q.Paragraph,
                questions: caseGroup,
            });

            usedCaseIDs.add(q.CaseID);
            return;
        }

        if (!q.Type || q.Type !== "CaseBased") {
            groupedSections[section].push({
                type: "single",
                question: q,
            });
        }
    });

    const doc = new Document({
        sections: [
            {
                properties: {
                    page: {
                        margin: { top: 720, right: 720, bottom: 720, left: 720 },
                    },
                },
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Class 9 Physics – Question Paper",
                                bold: true,
                                size: 48,
                            }),
                        ],
                        alignment: "center",
                        spacing: { after: 400 },
                    }),
                    ...Object.entries(groupedSections).flatMap(([section, items]) => {
                        if (!items.length) return [];

                        return [
                            new Paragraph({
                                text: `Section ${section}`,
                                heading: "Heading1",
                                spacing: { before: 400, after: 200 },
                            }),
                            ...items.flatMap((item, i) => {
                                if (item.type === "caseBlock") {
                                    const para = new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: `Case Study (5 Marks)`,
                                                bold: true,
                                                break: 1,
                                            }),
                                            new TextRun({
                                                text: `Paragraph: "${item.paragraph}"`,
                                                italics: true,
                                            }),
                                        ],
                                        spacing: { after: 200 },
                                    });

                                    const caseQuestions = item.questions.map((q, index) =>
                                        formatQuestion(q, index, true)
                                    );

                                    return [para, ...caseQuestions];
                                } else {
                                    return [formatQuestion(item.question, i)];
                                }
                            }),
                        ];
                    }),
                ],
            },
        ],
    });

    Packer.toBlob(doc).then((blob) => {
        saveAs(blob, fullName);
    });
}

function formatQuestion(q, i, isCase = false) {
    const children = [];
    const prefix = isCase ? `${i + 1}. ` : `${i + 1}. `;

    if (q.Type === "MCQ") {
        const [question, ...options] = q.Question.split("\\n");
        children.push(new TextRun({ text: prefix + question, size: 24 }));
        options.forEach((opt, idx) => {
            children.push(
                new TextRun({
                    text: `${String.fromCharCode(65 + idx)}. ${opt}`,
                    size: 24,
                    break: 1,
                })
            );
        });
    } else if (q.Type === "AssertionReason") {
        const [assertion, reason] = q.Question.split("\\n");
        children.push(new TextRun({ text: `${prefix}Assertion: ${assertion}`, size: 24 }));
        children.push(new TextRun({ text: `\nReason: ${reason}`, size: 24 }));
    } else {
        children.push(new TextRun({ text: prefix + q.Question, size: 24 }));
    }

    if (!isCase) {
        children.push(
            new TextRun({ text: ` (${q.Marks} Marks, ${q.Type || "Normal"})`, size: 20 })
        );
    }

    return new Paragraph({ children, spacing: { after: 100 } });
}
