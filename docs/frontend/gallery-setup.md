# Gallery Setup Guide

## สรุปการตั้งค่า Gallery

### ✅ สิ่งที่ทำสำเร็จแล้ว

1. **รูปภาพใน MongoDB**: เพิ่มรูปภาพทั้งหมด 29 รูปจาก `server/uploads/images/` เข้า MongoDB แล้ว
   - ใช้ script `server/src/syncGallery.js` ในการ sync
   - รูปทั้งหมดถูกเก็บใน collection `galleries`

2. **Gallery Model**: มี schema ที่กำหนดไว้แล้วใน `server/src/models/Gallery.js`
   ```javascript
   {
     name: String,        // ชื่อไฟล์
     img: String,         // path ของรูป (เช่น /uploads/images/000002.JPG)
     created_at: Date     // วันที่สร้าง
   }
   ```

3. **API Endpoints**: 
   - `GET /api/gallery` - ดึงรูปทั้งหมด
   - `POST /api/gallery/upload` - อัพโหลดรูปใหม่

4. **Gallery.tsx**: Frontend พร้อมแสดงรูปแล้ว
   - แสดงรูปในรูปแบบ grid
   - มี lightbox สำหรับดูรูปขนาดใหญ่
   - มีฟีเจอร์อัพโหลดรูปใหม่

### 📝 วิธีใช้งาน

#### 1. รัน Backend Server
```bash
cd server
npm start
```
Server จะรันที่ `http://localhost:3000`

#### 2. รัน Frontend
```bash
cd client
npm run dev
```
Frontend จะรันที่ `http://localhost:5173`

#### 3. ดู Gallery
เปิดเบราว์เซอร์ไปที่ `http://localhost:5173/gallery` จะเห็นรูปภาพทั้งหมด 30 รูป

### 🔄 Sync รูปใหม่จาก Folder

หากมีรูปใหม่ใน `server/uploads/images/` และต้องการเพิ่มเข้า database:

```bash
cd server
node src/syncGallery.js
```

Script จะ:
- ตรวจสอบรูปทั้งหมดใน folder
- เพิ่มเฉพาะรูปที่ยังไม่มีใน database
- ข้ามรูปที่มีอยู่แล้ว (ไม่ซ้ำ)

### 📂 โครงสร้างไฟล์

```
server/
├── uploads/
│   └── images/          # รูปภาพทั้งหมด (29 รูป)
├── src/
│   ├── models/
│   │   └── Gallery.js   # Schema สำหรับ gallery
│   ├── syncGallery.js   # Script สำหรับ sync รูปเข้า DB
│   └── server.js        # API endpoints

client/
└── src/
    └── pages/
        └── Gallery.tsx  # หน้าแสดงรูป
```

### 🎯 Features

1. **Grid Layout**: แสดงรูปในรูปแบบ responsive grid
2. **Lightbox**: คลิกรูปเพื่อดูขนาดใหญ่
3. **Navigation**: ใช้ลูกศรหรือปุ่มเพื่อเลื่อนดูรูป
4. **Keyboard Support**: 
   - `Escape` - ปิด lightbox
   - `Arrow Left/Right` - เลื่อนดูรูป
5. **Upload**: อัพโหลดรูปใหม่ได้จากหน้า Gallery

### 📊 Database Info

- **Database**: `nevinas_db`
- **Collection**: `galleries`
- **Total Images**: 30 รูป
- **Connection**: MongoDB running on `localhost:27017`

