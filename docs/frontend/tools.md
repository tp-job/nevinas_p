# ApexOps

## Client (Frontend)

### Build & Dev Tools

| Package                     | Version | หน้าที่                                      |
| --------------------------- | ------- | -------------------------------------------- |
| vite                        | ^7.1.12 | Build tool / Dev server                      |
| @vitejs/plugin-react-swc    | ^4.1.0  | React plugin สำหรับ Vite (ใช้ SWC แทน Babel) |
| typescript                  | ~5.9.3  | TypeScript compiler                          |
| eslint                      | ^9.36.0 | Linter                                       |
| eslint-plugin-react-hooks   | ^5.2.0  | ESLint rules สำหรับ React Hooks              |
| eslint-plugin-react-refresh | ^0.4.22 | ESLint rules สำหรับ React Fast Refresh       |
| typescript-eslint           | ^8.45.0 | ESLint integration กับ TypeScript            |

### UI Framework & Styling

|Package|Version|หน้าที่|
|---|---|---|
|tailwindcss|^4.1.16|CSS utility framework|
|@tailwindcss/vite|^4.1.16|Tailwind CSS plugin สำหรับ Vite|
|@mui/material|^7.3.6|Material UI component library|
|@mui/x-date-pickers|^8.22.0|MUI Date/Time picker components|
|@emotion/react|^11.14.0|CSS-in-JS library (required by MUI)|
|@emotion/styled|^11.14.1|Styled components (required by MUI)|
|lightswind|^3.1.20|UI library เสริม|

### Icons

|Package|Version|หน้าที่|
|---|---|---|
|lucide-react|^0.552.0|React icon library (Lucide icons)|
|remixicon|^4.7.0|Remix icon library (ใช้ผ่าน ri-* classes)|

### Core React

|Package|Version|หน้าที่|
|---|---|---|
|react|^19.1.1|React core|
|react-dom|^19.1.1|React DOM renderer|
|react-router-dom|^7.9.5|Client-side routing|

### Data & Charts

|Package|Version|หน้าที่|
|---|---|---|
|recharts|^2.15.4|Chart library (built on D3)|
|dayjs|^1.11.19|Date/time utility library|

### Networking

|Package|Version|หน้าที่|
|---|---|---|
|axios|^1.13.1|HTTP client|
|socket.io-client|^4.8.3|WebSocket client (real-time)|

---

## Server (Backend)

### Core

|Package|Version|หน้าที่|
|---|---|---|
|express|^5.1.0|Web framework|
|pg|^8.16.3|PostgreSQL client|
|dotenv|^16.6.1|Environment variables|

### Authentication & Security

|Package|Version|หน้าที่|
|---|---|---|
|bcryptjs|^3.0.2|Password hashing|
|jsonwebtoken|^9.0.2|JWT token สำหรับ auth|
|cors|^2.8.5|Cross-Origin Resource Sharing|

### Real-time & Networking

|Package|Version|หน้าที่|
|---|---|---|
|socket.io|^4.8.1|WebSocket server|
|ws|^8.18.3|WebSocket library เสริม|

### AI & Automation

|Package|Version|หน้าที่|
|---|---|---|
|@google/genai|^1.34.0|Google Generative AI (Gemini)|
|puppeteer|^23.11.1|Headless browser automation|

### Utilities

|Package|Version|หน้าที่|
|---|---|---|
|body-parser|^2.2.0|Parse request body|
|axios|^1.13.2|HTTP client (devDep)|
|nodemon|^3.1.10|Auto-restart server on file changes|


---

# Nevinas-website

## Client (Frontend)

### Dependencies (Runtime)

| Package           | Version  | หน้าที่                                |
| ----------------- | -------- | -------------------------------------- |
| react             | ^19.1.1  | UI Library หลัก                        |
| react-dom         | ^19.1.1  | Render React ลง DOM                    |
| react-router-dom  | ^7.9.5   | Routing / จัดการเส้นทางหน้าเว็บ        |
| tailwindcss       | ^4.1.16  | Utility-first CSS Framework            |
| @tailwindcss/vite | ^4.1.16  | Tailwind CSS plugin สำหรับ Vite        |
| @mui/material     | ^7.3.6   | Material UI Components                 |
| @mui/x-charts     | ^8.21.0  | MUI Charts (กราฟ/แผนภูมิ)              |
| @emotion/react    | ^11.14.0 | CSS-in-JS (dependency ของ MUI)         |
| @emotion/styled   | ^11.14.1 | Styled components (dependency ของ MUI) |
| recharts          | ^3.5.1   | React Charting Library (กราฟ)          |
| axios             | ^1.13.1  | HTTP Client สำหรับเรียก API            |
| remixicon         | ^4.7.0   | Icon Library (ri-* icons)              |

### DevDependencies (Development)

|Package|Version|หน้าที่|
|---|---|---|
|vite|^7.1.12|Build tool / Dev server|
|@vitejs/plugin-react-swc|^4.1.0|React plugin สำหรับ Vite (ใช้ SWC compiler)|
|typescript|~5.9.3|TypeScript compiler|
|eslint|^9.36.0|Linter ตรวจสอบโค้ด|
|eslint-plugin-react-hooks|^5.2.0|ESLint rules สำหรับ React Hooks|
|eslint-plugin-react-refresh|^0.4.22|ESLint rules สำหรับ React Refresh|
|typescript-eslint|^8.45.0|ESLint support สำหรับ TypeScript|
|@eslint/js|^9.36.0|ESLint config พื้นฐาน|
|globals|^16.4.0|Global variables definition|
|@types/node|^24.6.0|TypeScript types สำหรับ Node.js|
|@types/react|^19.1.16|TypeScript types สำหรับ React|
|@types/react-dom|^19.1.9|TypeScript types สำหรับ React DOM|

---

## Server (Backend)

### Dependencies (Runtime)

|Package|Version|หน้าที่|
|---|---|---|
|express|^5.1.0|Web Framework (Express 5)|
|mongoose|^8.19.2|MongoDB ODM (จัดการ database)|
|cors|^2.8.5|Cross-Origin Resource Sharing|
|dotenv|^17.2.3|โหลด environment variables จาก .env|
|bcryptjs|^3.0.2|Hash รหัสผ่าน|
|jsonwebtoken|^9.0.2|JWT Authentication|
|multer|^2.0.2|อัปโหลดไฟล์ (รูปภาพ)|
|body-parser|^2.2.0|Parse request body (ซ้ำกับ express.json)|

### DevDependencies (Development)

| Package | Version | หน้าที่                              |
| ------- | ------- | ------------------------------------ |
| nodemon | ^3.1.10 | Auto-restart server เมื่อไฟล์เปลี่ยน |

---
# ComTech-Prep

## Client (Frontend)

| Package              | Version  | หน้าที่                                                                   |
| -------------------- | -------- | ------------------------------------------------------------------------- |
| react                | ^19.2.0  | UI library หลัก                                                           |
| react-dom            | ^19.2.0  | React DOM renderer                                                        |
| react-router-dom     | ^7.12.0  | Routing / Navigation ระหว่างหน้า                                          |
| tailwindcss          | ^4.1.18  | Utility-first CSS framework (styling ทั้ง project)                        |
| @tailwindcss/vite    | ^4.1.18  | Tailwind CSS plugin สำหรับ Vite                                           |
| react-icons          | ^5.5.0   | Icon library (ใช้ react-icons/tb, react-icons/ri, react-icons/io5 ฯลฯ)    |
| react-i18next        | ^16.5.3  | Internationalization - สลับภาษา TH/EN                                     |
| i18next              | ^25.7.4  | i18n core engine                                                          |
| recharts             | ^3.6.0   | Charting library (กราฟใน Dashboard, MissionSummary)                       |
| @xyflow/react        | ^12.10.0 | ReactFlow - Interactive flowchart/node diagrams (Homepage, Flowchart Lab) |
| @monaco-editor/react | ^4.7.0   | Monaco Editor - Code editor (Python playground, CodeEditor Lab)           |
| pyodide              | ^0.29.3  | Python runtime ใน browser (WebAssembly) - รัน Python code ฝั่ง client     |
| zustand              | ^5.0.11  | Lightweight state management                                              |
| axios                | ^1.13.2  | HTTP client สำหรับเรียก API                                               |

### Dev Dependencies

|Package|Version|หน้าที่|
|---|---|---|
|vite|^7.2.4|Build tool / Dev server|
|@vitejs/plugin-react-swc|^4.2.2|React plugin (ใช้ SWC compiler แทน Babel - เร็วกว่า)|
|typescript|~5.9.3|TypeScript compiler|
|eslint|^9.39.1|Linter|
|eslint-plugin-react-hooks|^7.0.1|ESLint rules สำหรับ React Hooks|
|eslint-plugin-react-refresh|^0.4.24|ESLint rules สำหรับ React Refresh (HMR)|
|typescript-eslint|^8.46.4|ESLint TypeScript parser|
|@types/react|^19.2.5|TypeScript types for React|
|@types/react-dom|^19.2.3|TypeScript types for React DOM|
|@types/node|^24.10.1|TypeScript types for Node.js|
|globals|^16.5.0|Global variable definitions for ESLint|

---

## Server (Backend)

|Package|Version|หน้าที่|
|---|---|---|
|express|^4.19.2|Web framework (REST API)|
|cors|^2.8.5|Cross-Origin Resource Sharing middleware|
|body-parser|^1.20.2|Parse request body (JSON)|
|jsonwebtoken|^9.0.2|JWT authentication (สร้าง/verify token)|
|nodemon|^3.1.0|Auto-restart server เมื่อแก้ไขไฟล์|