import React, { useState } from "react";
import "./CollapsibleSection.css";

export default function CollapsibleSection({ title, children }) {
    const [open, setOpen] = useState(true);

    return (
        <div className="collapsible-section">
            <div className="collapsible-header" onClick={() => setOpen(!open)}>
                <span>{title}</span>
                <span>{open ? "▲" : "▼"}</span>
            </div>
            {open && <div className="collapsible-content">{children}</div>}
        </div>
    );
}
