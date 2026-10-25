# CRC Marketing & Sales Dashboard - Setup Guide

## 🎯 สถาปัตยกรรมระบบ (ฟรีทั้งหมด)

```
GitHub Repository
    ↓
Cloudflare Pages (Host)
    ↓
Google Sheets (Database)
    ↓
Google Apps Script (API)
```

**ค่าใช้จ่าย: 0 บาท**
- GitHub: ฟรี (เก็บโค้ด)
- Cloudflare Pages: ฟรี (hosting ไม่จำกัด)
- Google Sheets: ฟรี (ฐานข้อมูล 5MB)
- Google Apps Script: ฟรี (API 10,000 calls/day)

---

## 📋 ขั้นตอนการติดตั้ง (30 นาที)

### ขั้นตอนที่ 1: สร้าง Google Sheets

1. ไปที่ https://sheets.google.com
2. สร้าง Spreadsheet ใหม่ ชื่อ "CRC Marketing Dashboard"
3. สร้าง Sheets (tabs) ดังนี้:

#### Tab 1: "campaigns"
```
campaign_id | campaign_name | platform | start_date | end_date | status | budget
```

#### Tab 2: "advertising"
```
id | campaign_id | platform | report_level | date | spend | impressions | reach | clicks | ctr | cpc | cpm | leads | qualified_leads
```

#### Tab 3: "leads"
```
lead_id | created_at | inquiry_date | source | customer_type | customer_name | contact_person | phone | email | product_category | steel_type | quantity | unit | estimated_budget | lead_status | lead_temperature | assigned_to
```

#### Tab 4: "quotations"
```
quotation_id | quotation_number | lead_id | quotation_date | valid_until | salesperson | quotation_status | subtotal | discount | tax_amount | shipping_fee | grand_total
```

#### Tab 5: "sales"
```
sales_id | order_number | invoice_number | order_date | customer_name | customer_type | sales_channel | salesperson | order_status | payment_status | subtotal | discount | tax_amount | grand_total | net_sales | gross_profit | marketing_source
```

#### Tab 6: "users"
```
user_id | username | password | full_name | email | role
```

### ขั้นตอนที่ 2: สร้าง Google Apps Script (API)

1. ใน Google Sheets คลิก **Extensions → Apps Script**
2. ลบโค้ดเดิม แล้ววางโค้ดจากไฟล์ `google-apps-script.js` (ผมจะสร้างให้)
3. Deploy:
   - คลิก **Deploy → New deployment**
   - เลือก **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - คลิก **Deploy**
   - **คัดลอก URL** (จะใช้อยู่ใน .env)

### ขั้นตอนที่ 3: ตั้งค่า Environment Variables

1. ใน GitHub repo ของคุณ ไปที่ **Settings → Secrets and variables → Actions**
2. เพิ่ม variables:
   - `VITE_GOOGLE_SHEETS_API_URL` = URL จากขั้นตอน 2
   - `VITE_GOOGLE_SHEET_ID` = ID ของ Google Sheets (ดูจาก URL)

### ขั้นตอนที่ 4: Deploy บน Cloudflare Pages

1. ไปที่ https://dash.cloudflare.com
2. เลือก **Workers & Pages → Create → Pages**
3. เลือก **Connect to Git**
4. เลือก GitHub repository ของคุณ
5. ตั้งค่า Build:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
6. คลิก **Save and Deploy**
7. รอ ~2 นาที → ได้ URL เช่น `crc-dashboard.pages.dev`

### ขั้นตอนที่ 5: ทดสอบระบบ

1. เปิด URL จาก Cloudflare
2. Login ด้วย username: `admin` (password: `admin123`)
3. ทดสอบ Import/Export
4. ตรวจสอบว่าข้อมูล sync กับ Google Sheets

---

## 🔧 การใช้งาน

### เพิ่มข้อมูลผ่าน Google Sheets
- แก้ไขข้อมูลใน Sheets ได้โดยตรง
- Dashboard จะ sync อัตโนมัติเมื่อ refresh

### Import ข้อมูล
- ใช้ปุ่ม Import CSV ในแต่ละหน้า
- ข้อมูลจะถูกบันทึกทั้งใน localStorage และ Google Sheets

### Export ข้อมูล
- ใช้ Export Center
- ข้อมูลจะ export เป็น CSV พร้อมใช้กับ Looker Studio

---

## 📊 เชื่อมต่อ Looker Studio (ฟรี)

1. ไปที่ https://lookerstudio.google.com
2. Create → Report
3. Add Data → Google Sheets
4. เลือก "CRC Marketing Dashboard"
5. สร้าง charts ตามต้องการ

---

## 🎓 คู่มือการใช้งานสำหรับทีมงาน

ดูไฟล์ `USER_GUIDE.md`

---

## ⚠️ ข้อจำกัดของระบบฟรี

- Google Sheets: สูงสุด 5 ล้าน cells (เพียงพอสำหรับ CRC)
- Google Apps Script: 10,000 calls/day (เพียงพอ)
- Cloudflare Pages: ไม่จำกัด bandwidth
- GitHub: ไม่จำกัด storage

**สรุป:** ระบบนี้รองรับ CRC ได้สบาย ไม่ต้องอัพเกรดเป็น paid plan

---

## 🆘 การแก้ไขปัญหา

### ข้อมูลไม่ sync
- ตรวจสอบว่า Google Apps Script Deploy แล้ว
- ตรวจสอบ URL ใน .env ถูกต้อง
- ดู Console log ใน browser

### Login ไม่ได้
- ตรวจสอบว่ามี sheet "users" แล้ว
- ตรวจสอบ username/password ใน sheet

### Import ไม่ทำงาน
- ตรวจสอบว่า Google Sheets API URL ถูกต้อง
- ตรวจสอบว่า sheet มี header ครบ

---

## 📞 ต้องการความช่วยเหลือ?

- ดูไฟล์ `TROUBLESHOOTING.md`
- หรือสร้าง Issue ใน GitHub

---

**สถานะ:** ✅ พร้อมใช้งาน
**เวอร์ชัน:** 1.0.0
**อัปเดตล่าสุด:** 2026
