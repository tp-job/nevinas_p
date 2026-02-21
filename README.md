# Nevinas — Developer Portfolio & Work Hub

> โปรเจกต์ **nevinas_ka_i** — แพลตฟอร์มรวมผลงานและเอกสารสำหรับ Developer

## Project Title & Description

**Nevinas** เป็นแพลตฟอร์มรวมผลงานและศูนย์กลางข้อมูลสำหรับ Developer — รวม Dashboard แบบ Real-time, เอกสาร API/โปรเจกต์, Gallery, Blog และการซิงค์กับ GitHub ไว้ในที่เดียว

**Value Proposition:** ลดเวลาในการจัดเก็บและนำเสนอผลงาน, เอกสารเทคนิค และเมตริกจาก GitHub ให้ทีมหรือผู้สนใจเข้าถึงได้ง่ายผ่าน UI ที่ทันสมัยและมี Analytics ชัดเจน

---

## Tech Stack

| Layer      | Technologies |
|-----------|--------------|
| **Frontend** | React 19, TypeScript, Vite 7, Tailwind CSS 4, MUI (Material UI), Recharts / MUI X-Charts, React Router, Axios |
| **Backend**  | Node.js, Express 5, TypeScript, Mongoose (MongoDB), JWT, Helmet, Multer, node-cron |
| **Database** | MongoDB |
| **Tools**    | Git, ESLint, dotenv |

---

## Getting Started

### Prerequisites

- **Node.js** (v18+)
- **MongoDB** (รัน locally หรือใช้ Atlas)
- **npm** หรือ yarn

### Step 1: Clone repository

```bash
git clone <repository-url>
cd nevinas_ka_i
```

### Step 2: Backend — ติดตั้งและตั้งค่า

```bash
cd server
npm install
cp .env.example .env
```

แก้ไขไฟล์ `server/.env` ตามค่าจริง เช่น:

- `MONGODB_URI` — เชื่อมต่อ MongoDB
- `JWT_SECRET` — ค่า secret สำหรับ JWT
- `GITHUB_TOKEN`, `GITHUB_USERNAME` — ถ้าใช้ฟีเจอร์ซิงค์ GitHub

### Step 3: Frontend — ติดตั้ง

```bash
cd ../client
npm install
```

### Step 4: รันโปรเจกต์

**Terminal 1 — Backend:**

```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**

```bash
cd client
npm run dev
```

### Access

- **Frontend:** http://localhost:5173  
- **Backend API:** http://localhost:3000  

---

## Key Features

- **Dashboard & Analytics** — สถิติจาก GitHub (repos, stars, languages), กราฟกิจกรรม, contribution heatmap และ KPI cards
- **Documentation** — หน้า Docs รวม API endpoints, data models, สถาปัตยกรรม, โครงสร้างโฟลเดอร์ และคู่มือเริ่มต้น
- **Repository** — แสดงรายการ repo จาก GitHub พร้อม topics และลิงก์
- **Gallery** — จัดการและแสดงรูปภาพ (รองรับ sync จาก backend)
- **Blog** — อ่านบทความจาก API
- **Tech Stack / Performance / Tools** — หน้าแสดงสแต็ก เทคโนโลยี และเครื่องมือที่ใช้
- **Theme** — รองรับ Light/Dark mode
- **GitHub Sync** — ซิงค์โปรไฟล์และ repo จาก GitHub (ใช้ token จาก env)

---

## Security Note

**ห้าม commit ค่า API Keys หรือ Secrets เข้า Git.**

- เก็บค่าเช่น `JWT_SECRET`, `GITHUB_TOKEN`, หรือ API keys อื่น (เช่น Stripe, payment, third-party) ในไฟล์ **`.env`** เท่านั้น
- ใช้ **`.env.example`** เป็นเทมเพลต (ไม่มีค่าจริง) และให้ `.env` ถูก **`.gitignore`** เสมอ  
- เคสที่พบบ่อย: ค่าเช่น Stripe API key ถูก commit โดยไม่ตั้งใจ → key รั่ว → ต้อง revoke และเปลี่ยน key ทันที  
- โปรเจกต์นี้มี `server/.env` และ `.env*` ใน `.gitignore แล้ว — ตรวจสอบว่าไม่มี `.env` ถูก add ก่อน push

---

## Folder Structure

```
nevinas_ka_i/
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/      # UI components, cards, charts, layouts
│   │   ├── context/         # Theme, global state
│   │   ├── data/            # Static data (docData, techData, toolsData)
│   │   ├── layouts/         # WorkLayout, Sidebar
│   │   ├── pages/           # หน้าเว็บ (Dashboard, Docs, Gallery, Blog, …)
│   │   ├── routes/          # AppRoutes
│   │   ├── styles/          # CSS / Tailwind
│   │   └── utils/           # api, helpers
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── server/                  # Backend (Express + MongoDB)
│   ├── src/
│   │   ├── routes/          # API routes (github, blogs, gallery, …)
│   │   ├── models/          # Mongoose models
│   │   ├── sync/            # GitHub sync scripts
│   │   └── server.ts
│   ├── .env.example         # เทมเพลต env (ไม่มีค่าจริง)
│   └── package.json
├── docs/                    # เอกสารเพิ่มเติม (overview, API, frontend/backend)
├── .gitignore               # รวม .env และ server/.env
└── README.md
```

---

**Last Updated:** 2025-02-21
