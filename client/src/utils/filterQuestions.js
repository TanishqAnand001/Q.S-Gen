export default function getFilteredQuestions(questions, chapterWiseCount, totalMarksLimit) {
    let selected = [];

    // Step 1: Group CaseBased questions by CaseID
    const caseMap = {};
    questions.forEach(q => {
        if (q.Type === "CaseBased" && q.CaseID) {
            if (!caseMap[q.CaseID]) {
                caseMap[q.CaseID] = {
                    caseID: q.CaseID,
                    paragraph: q.Paragraph,
                    chapter: q.Chapter,
                    questions: [],
                };
            }
            caseMap[q.CaseID].questions.push(q);
        }
    });

    // Step 2: Extract valid case-based blocks (5 questions each)
    const caseBasedBlocks = Object.values(caseMap)
        .filter(block => block.questions.length === 5)
        .map(block => ({
            type: "CaseBasedBlock",
            caseID: block.caseID,
            paragraph: block.paragraph,
            chapter: block.chapter,
            marks: 5,
            questions: block.questions,
        }));

    const selectedCaseIDs = new Set();
    const updatedChapterWiseCount = JSON.parse(JSON.stringify(chapterWiseCount));

    // Step 3: Select eligible Case-Based blocks (5 marks only)
    caseBasedBlocks.forEach(block => {
        const chapter = block.chapter;
        const allowed = updatedChapterWiseCount["5"]?.[chapter] || 0;

        if (allowed > 0) {
            selected.push(...block.questions);
            selectedCaseIDs.add(block.caseID);

            // ✅ Decrement the chapter count since we consumed it
            updatedChapterWiseCount["5"][chapter] -= 1;
        }
    });

    // Step 4: Select normal (non-case-based) questions
    ["1", "2", "3", "4", "5"].forEach(markKey => {
        const markFilter = (q) =>
            Number(q.Marks) === Number(markKey) &&
            q.Type !== "CaseBased" &&
            (!q.CaseID || !selectedCaseIDs.has(q.CaseID));

        const chapters = Object.keys(updatedChapterWiseCount[markKey] || {});
        chapters.forEach((chapter) => {
            const filtered = questions.filter(
                (q) => q.Chapter === chapter && markFilter(q)
            );

            const count = updatedChapterWiseCount[markKey][chapter] || 0;
            selected.push(...filtered.slice(0, count));
        });
    });

    // Step 5: Apply total marks limit (optional)
    if (totalMarksLimit > 0) {
        let total = 0;
        selected = selected.filter((q) => {
            const marks = Number(q.Marks);
            if (total + marks <= totalMarksLimit) {
                total += marks;
                return true;
            }
            return false;
        });
    }

    return selected;
}
