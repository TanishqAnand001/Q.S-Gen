import { useState, useEffect } from "react";

export default function useSettings() {
    const [questions, setQuestions] = useState([]);
    const [chapterOptions, setChapterOptions] = useState([]);
    const [filename, setFilename] = useState("Physics_HOTS_Question_Paper");
    const [totalMarksLimit, setTotalMarksLimit] = useState(0);
    const [theme, setTheme] = useState("dark");
    const [extension, setExtension] = useState("docx");
    const [dataSource, setDataSource] = useState("csv");

    const [chapterWiseCount, setChapterWiseCount] = useState({
        "1": {}, "2": {}, "3": {}, "4": {}, "5": {}
    });

    // ✅ Fetch questions only when dataSource is 'db'
    useEffect(() => {
        async function fetchQuestions() {
            try {
                const response = await fetch("http://localhost:5000/api/questions");
                const data = await response.json();
                setQuestions(data);

                const chapters = [...new Set(data.map((q) => q.Chapter))];
                setChapterOptions(chapters);
            } catch (error) {
                console.error("Failed to fetch questions:", error);
            }
        }

        if (dataSource === "db") {
            fetchQuestions();
        } else if (dataSource === "csv") {
            setQuestions([]);
            setChapterOptions([]);
        }
    }, [dataSource]);

    // ✅ Load saved settings
    useEffect(() => {
        const saved = localStorage.getItem("paperSettings");
        if (saved) {
            const parsed = JSON.parse(saved);
            setFilename(parsed.filename || "Physics_HOTS_Question_Paper");
            setTotalMarksLimit(parsed.totalMarksLimit || 0);
            setTheme(parsed.theme || "dark");
            setExtension(parsed.extension || "docx");
            setChapterWiseCount(parsed.chapterWiseCount || { "1": {}, "2": {}, "3": {}, "4": {}, "5": {} });
        }
    }, []);

    // ✅ Persist settings
    useEffect(() => {
        localStorage.setItem("paperSettings", JSON.stringify({
            chapterWiseCount, filename, totalMarksLimit, theme, extension
        }));
    }, [chapterWiseCount, filename, totalMarksLimit, theme, extension]);

    function updateChapterCount(markKey, chapter, value) {
        setChapterWiseCount(prev => ({
            ...prev,
            [markKey]: {
                ...prev[markKey],
                [chapter]: Number(value)
            }
        }));
    }

    function toggleTheme() {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    }

    // ✅ Randomize chapterWiseCount based on available questions
    function randomizeQuestions() {
        const marks = ["1", "2", "3", "4", "5"];
        const newCount = {};

        for (let mark of marks) {
            newCount[mark] = {};

            chapterOptions.forEach((chapter) => {
                const available = questions.filter(q =>
                    q.Chapter === chapter &&
                    q.Type !== "CaseBased" &&
                    Number(q.Marks) === Number(mark)
                ).length;

                newCount[mark][chapter] = Math.floor(Math.random() * (available + 1));
            });
        }

        setChapterWiseCount(newCount);
    }

    return {
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
        setQuestions,
        setChapterOptions,
        setChapterWiseCount,
        dataSource,
        setDataSource,
        randomizeQuestions // ✅ Export for use in UI
    };
}
