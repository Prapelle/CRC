# 🚀 Quick Start Guide (5 นาที)

## ขั้นตอนการติดตั้งแบบเร็ว

### 1. สร้าง Google Sheets (2 นาที)

1. เปิด https://sheets.google.com
2. สร้าง Spreadsheet ใหม่ ชื่อ "CRC Marketing Dashboard"
3. สร้าง 6 sheets (tabs):
   - `campaigns`
   - `advertising`
   - `leads`
   - `quotations`
   - `sales`
   - `users`

4. เพิ่ม header ในแต่ละ sheet (ดูตัวอย่างใน `SETUP_GUIDE.md`)

5. ใน sheet `users` เพิ่มข้อมูล:
```
user_id | username | password | full_name | email | role
U001 | admin | admin123 | ผู้ดูแลระบบ | admin@crc.com | Admin
U002 | wichai | sales123 | วิชัย | wichai@crc.com | Sales
U003 | somsri | sales123 | สมศรี | somsri@crc.com | Sales
U004 | marketing | mkt123 | การตลาด | mkt@crc.com | Marketing
```

### 2. สร้าง Google Apps Script (2 นาที)

1. ใน Google Sheets คลิก **Extensions → Apps Script**
2. ลบโค้ดเดิม
3. คัดลอกโค้ดจากไฟล์ `google-apps-script.js` วางลงไป
4. คลิก **Deploy → New deployment**
5. เลือก **Web app**
6. ตั้งค่า:
   - Execute as: **Me**
   - Who has access: **Anyone**
7. คลิก **Deploy**
8. **คัดลอก URL** (เช่น `https://script.google.com/macros/s/AKfycb.../exec`)

### 3. ตั้งค่า Environment Variables (1 นาที)

1. ใน GitHub repo → **Settings → Secrets and variables → Actions**
2. เพิ่ม Variables:
   - `VITE_GOOGLE_SHEETS_API_URL` = URL จากขั้นตอน 2
   - `VITE_GOOGLE_SHEET_ID` = ID ของ Google Sheets (จาก URL)
   - `VITE_ENABLE_GOOGLE_SHEETS_SYNC` = `true`

### 4. Deploy บน Cloudflare Pages (30 วินาที)

1. ไปที่ https://dash.cloudflare.com
2. **Workers & Pages → Create → Pages**
3. **Connect to Git** → เลือก repo ของคุณ
4. ตั้งค่า Build:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. คลิก **Save and Deploy**
6. รอ ~2 นาที
7. ได้ URL เช่น `crc-dashboard.pages.dev`

### 5. ทดสอบระบบ (30 วินาที)

1. เปิด URL จาก Cloudflare
2. Login:
   - Username: `admin`
   - Password: `admin123`
3. ทดสอบ:
   - ดู Executive Overview
   - Import CSV
   - Export ข้อมูล

---

## ✅ เสร็จแล้ว!

ตอนนี้คุณสามารถ:
- เข้าถึง Dashboard ที่ `crc-dashboard.pages.dev`
- แก้ไขข้อมูลใน Google Sheets ได้โดยตรง
- Import/Export ข้อมูลผ่าน Dashboard
- เชื่อมต่อ Looker Studio ได้

---

## 📚 เอกสารเพิ่มเติม

- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - คู่มือละเอียด
- [USER_GUIDE.md](./USER_GUIDE.md) - คู่มือการใช้งาน
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - การแก้ไขปัญหา

---

## 🆘 ต้องการความช่วยเหลือ?

- ปัญหา → ดู `TROUBLESHOOTING.md`
- วิธีใช้ → ดู `USER_GUIDE.md`
- สร้าง Issue ใน GitHub

---

**เวลาติดตั้งทั้งหมด:** ~5 นาที  
**ค่าใช้จ่าย:** 0 บาท  
**สถานะ:** ✅ พร้อมใช้งาน
