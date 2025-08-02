import React from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
} from "chart.js";

import "./StatsDashboard.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function StatsDashboard({ chapterWiseCount }) {
    const marks = ["1", "2", "3", "4", "5"];
    const chapters = [...new Set(marks.flatMap(mark => Object.keys(chapterWiseCount[mark] || {})))];

    const hasData = marks.some(
        mark => Object.values(chapterWiseCount[mark] || {}).some(val => val > 0)
    );

    const datasets = marks.map(mark => ({
        label: `${mark}-mark`,
        data: chapters.map(ch => (chapterWiseCount[mark]?.[ch] || 0) * Number(mark)),
        backgroundColor: getColorForMark(mark),
        borderRadius: 8,
        barPercentage: 0.7,
        stack: "marks"
    }));

    const data = {
        labels: chapters,
        datasets
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top",
                labels: {
                    color: "#fff",
                    font: { size: 14 },
                    usePointStyle: true,
                    pointStyle: "rectRounded",
                },
            },
            tooltip: {
                backgroundColor: "#333",
                titleColor: "#ffa500",
                bodyColor: "#fff",
                borderColor: "#ffa500",
                borderWidth: 1,
                callbacks: {
                    label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y} marks`
                }
            }
        },
        scales: {
            x: {
                stacked: true,
                ticks: { color: "#eee", font: { size: 13 } },
                grid: { color: "rgba(255, 255, 255, 0.05)" }
            },
            y: {
                stacked: true,
                ticks: { color: "#eee", font: { size: 13 }, stepSize: 5 },
                grid: { color: "rgba(255, 255, 255, 0.05)" },
                beginAtZero: true,
            }
        }
    };

    return (
        <div className="stats-container">
            <h3 className="stats-title">📊 Marks Distribution by Chapter</h3>
            <div className="single-chart-box">
                {!hasData ? (
                    <div className="empty-chart">
                        <img src="/assets/chart.svg" alt="No data" />
                        <p>No data to display yet. Select chapters from sliders to view the graph.</p>
                    </div>
                ) : (
                    <Bar data={data} options={options} />
                )}
            </div>
        </div>
    );
}

function getColorForMark(mark) {
    const colorMap = {
        "1": "#ff6b6b",
        "2": "#4dd2ff",
        "3": "#ffd166",
        "4": "#06d6a0",
        "5": "#a78bfa",
    };
    return colorMap[mark] || "#ccc";
}
