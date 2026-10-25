# 🔧 Troubleshooting Guide

## สารบัญ
1. [ปัญหาที่พบบ่อย](#ปัญหาที่พบบ่อย)
2. [การแก้ไขปัญหา](#การแก้ไขปัญหา)
3. [การตรวจสอบระบบ](#การตรวจสอบระบบ)
4. [ติดต่อทีมพัฒนา](#ติดต่อทีมพัฒนา)

---

## ปัญหาที่พบบ่อย

### 1. Login ไม่ได้

**อาการ:**
- กรอก username/password แล้วไม่เข้า
- แสดง error "Invalid username"

**สาเหตุ:**
- Username/password ไม่ถูกต้อง
- ไม่มี sheet "users" ใน Google Sheets
- Google Sheets API URL ไม่ถูกต้อง

**วิธีแก้:**
1. ตรวจสอบ username/password ในไฟล์ `USER_GUIDE.md`
2. ตรวจสอบว่ามี sheet "users" ใน Google Sheets
3. ตรวจสอบ URL ใน `.env` ว่าถูกต้อง
4. Clear browser cache (Ctrl+Shift+R)

---

### 2. ข้อมูลไม่อัปเดต

**อาการ:**
- แก้ไขข้อมูลใน Google Sheets แล้วไม่แสดงใน Dashboard
- Import ข้อมูลแล้วไม่เห็น

**สาเหตุ:**
- Browser cache ยังเก็บข้อมูลเก่า
- Google Sheets API ไม่ทำงาน
- Sync interval ยังไม่ถึง

**วิธีแก้:**
1. Hard refresh browser (Ctrl+Shift+R)
2. ตรวจสอบ Google Apps Script ว่า Deploy แล้ว
3. ตรวจสอบ Console log ใน browser (F12)
4. รอ 1 นาทีให้ sync อัตโนมัติ

---

### 3. Import CSV ไม่ทำงาน

**อาการ:**
- คลิก Import แล้วไม่มีอะไรเกิดขึ้น
- Import แล้วข้อมูลไม่เข้า
- แสดง error

**สาเหตุ:**
- รูปแบบไฟล์ CSV ไม่ถูกต้อง
- Header ไม่ตรงกับที่กำหนด
- ไฟล์มี character พิเศษ
- Google Sheets API quota หมด

**วิธีแก้:**
1. ตรวจสอบรูปแบบไฟล์ CSV:
   - ต้องมี header row
   - ใช้ comma (,) คั่นคอลัมน์
   - บันทึกเป็น UTF-8
2. ตรวจสอบว่า header ตรงกับที่กำหนดใน `USER_GUIDE.md`
3. เปิดไฟล์ CSV ด้วย text editor ตรวจสอบ character
4. ตรวจสอบ Google Apps Script logs

---

### 4. ข้อมูลหาย

**อาการ:**
- ข้อมูลที่เคยมีหายไป
- Clear browser แล้วข้อมูลหาย

**สาเหตุ:**
- ข้อมูลเก็บใน localStorage (browser)
- Clear browser data
- ไม่ได้ sync กับ Google Sheets

**วิธีแก้:**
1. ตรวจสอบว่าเปิด Google Sheets sync หรือยัง
2. ถ้าข้อมูลหายจาก browser → ดึงจาก Google Sheets
3. ถ้าข้อมูลหายจาก Google Sheets → ไม่มีทางกู้ (ต้อง backup)

**ป้องกัน:**
- เปิด Google Sheets sync เสมอ
- Export ข้อมูลสำรองเป็นประจำ
- อย่า clear browser data

---

### 5. กราฟไม่แสดง

**อาการ:**
- กราฟว่างเปล่า
- แสดง "No data"
- กราฟ error

**สาเหตุ:**
- ไม่มีข้อมูลใน module นั้น
- ข้อมูลมี format ไม่ถูกต้อง
- Recharts error

**วิธีแก้:**
1. ตรวจสอบว่ามีข้อมูลใน module นั้น
2. ตรวจสอบ format ข้อมูล (วันที่, ตัวเลข)
3. ดู Console log ใน browser
4. Refresh หน้า

---

### 6. Export ไม่ทำงาน

**อาการ:**
- คลิก Export แล้วไม่มีไฟล์ดาวน์โหลด
- ไฟล์ CSV ว่างเปล่า

**สาเหตุ:**
- Browser block download
- ไม่มีข้อมูลให้ export
- JavaScript error

**วิธีแก้:**
1. ตรวจสอบ browser settings → Allow downloads
2. ตรวจสอบว่ามีข้อมูลใน module นั้น
3. ลอง browser อื่น
4. ดู Console log

---

### 7. Google Sheets API Error

**อาการ:**
- แสดง error "Failed to fetch"
- CORS error
- 404 Not Found

**สาเหตุ:**
- Google Apps Script ไม่ได้ Deploy
- URL ไม่ถูกต้อง
- CORS issue
- Quota หมด

**วิธีแก้:**
1. ตรวจสอบ Google Apps Script:
   - เปิด Apps Script
   - Deploy → Manage deployments
   - ตรวจสอบว่า Active อยู่
2. ตรวจสอบ URL:
   - คัดลอก URL จาก deployment
   - วางใน `.env`
3. ตรวจสอบ CORS:
   - Apps Script ต้อง return CORS headers
   - ใช้ mode: 'no-cors' ถ้าจำเป็น
4. ตรวจสอบ quota:
   - เปิด Google Cloud Console
   - ดู API usage
   - รอ 24 ชม. ถ้า quota หมด

---

## การแก้ไขปัญหา

### ปัญหา: ข้อมูลไม่ sync กับ Google Sheets

**ขั้นตอนการตรวจสอบ:**

1. **ตรวจสอบ Environment Variables**
```bash
# ใน .env
VITE_GOOGLE_SHEETS_API_URL=https://script.google.com/macros/s/...
VITE_ENABLE_GOOGLE_SHEETS_SYNC=true
```

2. **ตรวจสอบ Google Apps Script**
- เปิด Google Sheets
- Extensions → Apps Script
- ตรวจสอบว่าโค้ดถูกต้อง
- Deploy → Test deployment

3. **ตรวจสอบ Browser Console**
- เปิด browser (F12)
- ดู Console tab
- หา error messages

4. **ตรวจสอบ Network Tab**
- เปิด browser (F12)
- ดู Network tab
- หา request ไป Google Sheets API
- ตรวจสอบ status code

---

### ปัญหา: Import ข้อมูลซ้ำ

**สาเหตุ:**
- ข้อมูลเดิมมีอยู่แล้ว
- ระบบป้องกัน duplicate

**วิธีแก้:**
1. ตรวจสอบผลการ Import:
   - New: ข้อมูลใหม่
   - Updated: ข้อมูลที่อัปเดต
   - Skipped: ข้อมูลที่ข้าม (ซ้ำ)
   - Rejected: ข้อมูลที่ปฏิเสธ
2. ถ้าต้องการอัปเดตข้อมูลเดิม:
   - ใช้ action: 'update' ใน API
   - หรือลบข้อมูลเดิมก่อน

---

### ปัญหา: ข้อมูลแสดงไม่ครบ

**สาเหตุ:**
- Google Sheets มี limit 5 ล้าน cells
- Pagination ไม่ทำงาน
- Filter ซ่อนข้อมูล

**วิธีแก้:**
1. ตรวจสอบจำนวนข้อมูลใน Google Sheets
2. ตรวจสอบ Filter ว่าเปิดอยู่ไหม
3. Reset Filter
4. ตรวจสอบ Console log

---

## การตรวจสอบระบบ

### 1. ตรวจสอบ Google Sheets Connection

```javascript
// เปิด browser console (F12)
// รันคำสั่งนี้:
fetch(import.meta.env.VITE_GOOGLE_SHEETS_API_URL + '?action=readAll')
  .then(r => r.json())
  .then(d => console.log('Data:', d))
  .catch(e => console.error('Error:', e));
```

### 2. ตรวจสอบ LocalStorage

```javascript
// เปิด browser console (F12)
// รันคำสั่งนี้:
const data = localStorage.getItem('crc_dashboard_data');
console.log('Local data:', JSON.parse(data));
```

### 3. ตรวจสอบ Environment Variables

```javascript
// เปิด browser console (F12)
// รันคำสั่งนี้:
console.log('API URL:', import.meta.env.VITE_GOOGLE_SHEETS_API_URL);
console.log('Sync enabled:', import.meta.env.VITE_ENABLE_GOOGLE_SHEETS_SYNC);
```

---

## การ Reset ระบบ

### Reset ข้อมูลใน Browser

```javascript
// เปิด browser console (F12)
// รันคำสั่งนี้:
localStorage.removeItem('crc_dashboard_data');
location.reload();
```

### Reset ข้อมูลใน Google Sheets

1. เปิด Google Sheets
2. ลบข้อมูลใน sheets (เหลือแค่ header)
3. Import ข้อมูลใหม่จาก Export Center

---

## การ Backup ข้อมูล

### วิธีที่ 1: Export จาก Dashboard
1. ไปที่ Export Center
2. Export ทุก dataset
3. เก็บไฟล์ CSV ไว้

### วิธีที่ 2: Download จาก Google Sheets
1. เปิด Google Sheets
2. File → Download → CSV
3. เก็บไฟล์ไว้

### วิธีที่ 3: Copy Google Sheets
1. เปิด Google Sheets
2. File → Make a copy
3. เก็บ copy ไว้

---

## การ Update ระบบ

### Update จาก GitHub

```bash
# Pull code ใหม่
git pull origin main

# Install dependencies ใหม่ (ถ้ามี)
npm install

# Build ใหม่
npm run build

# Deploy ใหม่ (Cloudflare จะ auto-deploy)
```

---

## ติดต่อทีมพัฒนา

### สร้าง Issue ใน GitHub
1. ไปที่ GitHub repository
2. คลิก Issues → New Issue
3. กรอกข้อมูล:
   - ปัญหาที่พบ
   - ขั้นตอนที่ทำให้เกิด
   - Expected vs Actual
   - Screenshots
   - Browser version
   - Console logs

### ข้อมูลที่ต้องแจ้ง
- URL ของ Dashboard
- Browser และ version
-操作步骤 (step-by-step)
- Error messages (จาก Console)
- Screenshots

---

## คำแนะนำทั่วไป

### 1. ใช้ Browser ล่าสุด
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### 2. Clear Cache เป็นประจำ
- กด Ctrl+Shift+R (hard refresh)
- หรือ Clear browser cache

### 3. ตรวจสอบ Internet Connection
- ระบบต้องใช้อินเทอร์เน็ต
- ตรวจสอบว่าเชื่อมต่อ Google Sheets ได้

### 4. Backup ข้อมูลเป็นประจำ
- Export ข้อมูลทุกสัปดาห์
- เก็บไฟล์ CSV ไว้หลายๆ ที่

### 5. แจ้งปัญหาทันที
- พบปัญหา → แจ้งทีมพัฒนา
- พร้อม screenshots และ logs
- จะได้รับการแก้ไขเร็วขึ้น

---

**อัปเดตล่าสุด:** 2026  
**เวอร์ชัน:** 1.0.0
