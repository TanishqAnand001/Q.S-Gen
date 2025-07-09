📝 Docgen

A full-stack web application that allows educators to easily generate custom physics question papers from either a CSV file or a MongoDB-backed question bank. Users can define chapter-wise mark distributions, preview selected questions, and export the final paper as a clean, sectioned .docx file.

🚀 Features

    ✅ CSV or Database Toggle – Choose the source of your questions.

    ✅ Smart Filtering – Dynamically filter questions based on chapters and mark weightage.

    ✅ Support for Question Types:

        Normal

        MCQ (with options)

        Assertion-Reason

        Case-Based (with paragraph + 5 grouped questions)

    ✅ Live Preview – See exactly how the document will be structured (sections A to E).

    ✅ Section-Based DOCX Export – Export the paper with proper formatting using the docx library.

    ✅ Dark/Light Theme Toggle

    ✅ Filename & Extension Customization

    ✅ Fully Responsive UI

🖼️ Interface Overview
Mode	Preview
CSV Upload	Upload a .csv file with structured questions
Database Fetch	Fetches questions from a MongoDB backend
Section Sliders	Choose how many questions per chapter per mark
Preview Panel	See grouped questions & sections before exporting
Generate DOCX	One-click .docx export, with styling & sections
🧰 Tech Stack
Layer	Tech Used
Frontend	React, CSS Modules
State Mgmt	Custom React hook (useSettings)
CSV Parsing	FileReader API
Backend	Express + MongoDB (optional)
File Export	docx, file-saver
📦 Setup Instructions

# Clone the repo
git clone https://github.com/tanishqanand003/docgen

# Install dependencies
npm install

# Start development server
npm start

    For MongoDB backend: make sure your Express API is running on http://localhost:5000/api/questions.

📁 CSV Format Example

Question,Chapter,Marks,Type,Paragraph,CaseID
Define inertia.,Motion,1,Normal,,
What is the unit of pressure?,Pressure,2,Normal,,
What is the speed of the car at the start?,Motion,1,CaseBased,"A car travels a distance...",case1
... (5 questions total for case1)