# 🚀 Deployment Guide - Cloudflare Pages

## ภาพรวม

คู่มือนี้จะแสดงวิธี deploy CRC Dashboard บน Cloudflare Pages (ฟรี) พร้อมเชื่อมต่อ Google Sheets

---

## 📋 สิ่งที่ต้องเตรียม

1. ✅ GitHub Account
2. ✅ Cloudflare Account (สมัครฟรีที่ https://dash.cloudflare.com)
3. ✅ Google Account
4. ✅ โค้ดที่ push ขึ้น GitHub แล้ว

---

## 🎯 ขั้นตอนการ Deploy

### ขั้นตอนที่ 1: สร้าง Google Sheets และ Apps Script

#### 1.1 สร้าง Google Sheets

1. เปิด https://sheets.google.com
2. คลิก **+ Blank** เพื่อสร้าง Spreadsheet ใหม่
3. ตั้งชื่อ: **"CRC Marketing Dashboard"**
4. สร้าง 6 sheets (tabs) โดยคลิก **+** ที่มุมซ้ายล่าง:

**Sheet 1: campaigns**
```
campaign_id | campaign_name | platform | start_date | end_date | status | budget
```

**Sheet 2: advertising**
```
id | campaign_id | platform | report_level | date | spend | impressions | reach | clicks | ctr | cpc | cpm | leads | qualified_leads
```

**Sheet 3: leads**
```
lead_id | created_at | inquiry_date | source | customer_type | customer_name | contact_person | phone | email | product_category | steel_type | quantity | unit | estimated_budget | lead_status | lead_temperature | assigned_to
```

**Sheet 4: quotations**
```
quotation_id | quotation_number | lead_id | quotation_date | valid_until | salesperson | quotation_status | subtotal | discount | tax_amount | shipping_fee | grand_total
```

**Sheet 5: sales**
```
sales_id | order_number | invoice_number | order_date | customer_name | customer_type | sales_channel | salesperson | order_status | payment_status | subtotal | discount | tax_amount | grand_total | net_sales | gross_profit | marketing_source
```

**Sheet 6: users**
```
user_id | username | password | full_name | email | role
U001 | admin | admin123 | ผู้ดูแลระบบ CRC | admin@crc.com | Admin
U002 | wichai | sales123 | วิชัย ขายเก่ง | wichai@crc.com | Sales
U003 | somsri | sales123 | สมศรี ดีเด่น | somsri@crc.com | Sales
U004 | marketing | mkt123 | ทีมการตลาด | mkt@crc.com | Marketing
```

#### 1.2 สร้าง Google Apps Script

1. ใน Google Sheets คลิก **Extensions → Apps Script**
2. ลบโค้ดเดิมทั้งหมด
3. เปิดไฟล์ `google-apps-script.js` จาก repo ของคุณ
4. คัดลอกโค้ดทั้งหมดวางลงใน Apps Script
5. คลิก **Save** (💾)
6. คลิก **Deploy → New deployment**
7. คลิก ⚙️ (gear icon) → เลือก **Web app**
8. ตั้งค่า:
   - **Description:** CRC Dashboard API
   - **Execute as:** Me (your email)
   - **Who has access:** Anyone
9. คลิก **Deploy**
10. **สำคัญ:** คัดลอก **Web app URL** (เช่น `https://script.google.com/macros/s/AKfycbz.../exec`)
11. เก็บ URL นี้ไว้ (จะใช้ในขั้นตอนที่ 3)

#### 1.3 หา Google Sheet ID

1. ดู URL ของ Google Sheets:
   ```
   https://docs.google.com/spreadsheets/d/THIS_IS_THE_ID/edit#gid=0
   ```
2. คัดลอก ID (ส่วนที่อยู่ระหว่าง `/d/` และ `/edit`)
3. เก็บ ID นี้ไว้ (จะใช้ในขั้นตอนที่ 3)

---

### ขั้นตอนที่ 2: ตั้งค่า GitHub Repository

#### 2.1 เพิ่ม Environment Variables

1. ไปที่ GitHub repository ของคุณ
2. คลิก **Settings** (tab ด้านบน)
3. คลิก **Secrets and variables → Actions** (เมนูซ้าย)
4. คลิก **Variables** tab
5. คลิก **New repository variable**
6. เพิ่ม 3 variables:

**Variable 1:**
- Name: `VITE_GOOGLE_SHEETS_API_URL`
- Value: URL จากขั้นตอน 1.2

**Variable 2:**
- Name: `VITE_GOOGLE_SHEET_ID`
- Value: ID จากขั้นตอน 1.3

**Variable 3:**
- Name: `VITE_ENABLE_GOOGLE_SHEETS_SYNC`
- Value: `true`

7. คลิก **Add variable** สำหรับแต่ละตัว

---

### ขั้นตอนที่ 3: Deploy บน Cloudflare Pages

#### 3.1 สร้าง Cloudflare Pages Project

1. เปิด https://dash.cloudflare.com
2. ล็อกอิน (หรือสมัครใหม่)
3. คลิก **Workers & Pages** (เมนูซ้าย)
4. คลิก **Create application**
5. คลิก **Pages** tab
6. คลิก **Connect to Git**

#### 3.2 เชื่อมต่อ GitHub

1. คลิก **GitHub**
2. เลือก GitHub account ของคุณ
3. เลือก repository `crc-marketing-dashboard`
4. คลิก **Begin setup**

#### 3.3 ตั้งค่า Build

1. **Framework preset:** เลือก **Vite** (หรือ None)
2. **Build command:** `npm run build`
3. **Build output directory:** `dist`
4. **Root directory:** (เว้นว่าง)
5. คลิก **Environment variables**
6. เพิ่ม variables เดียวกับใน GitHub:
   - `VITE_GOOGLE_SHEETS_API_URL` = URL จากขั้นตอน 1.2
   - `VITE_GOOGLE_SHEET_ID` = ID จากขั้นตอน 1.3
   - `VITE_ENABLE_GOOGLE_SHEETS_SYNC` = `true`
7. คลิก **Save and Deploy**

#### 3.4 รอ Deployment

1. รอ ~2-3 นาที
2. เมื่อเสร็จจะเห็น:
   - ✅ Build success
   - URL: `https://crc-dashboard.pages.dev` (หรือชื่อที่คุณตั้ง)
3. คลิก URL เพื่อเปิด Dashboard

---

### ขั้นตอนที่ 4: ทดสอบระบบ

#### 4.1 ทดสอบ Login

1. เปิด URL จาก Cloudflare
2. Login ด้วย:
   - Username: `admin`
   - Password: `admin123`
3. ควรเข้าหน้า Executive Overview ได้

#### 4.2 ทดสอบ Google Sheets Sync

1. เปิด Google Sheets
2. แก้ไขข้อมูลใน sheet ใดก็ได้ (เช่น เพิ่ม campaign ใหม่)
3. กลับมาที่ Dashboard
4. กด F5 (refresh)
5. ข้อมูลที่แก้ไขควรแสดงใน Dashboard

#### 4.3 ทดสอบ Import

1. ไปที่หน้า Lead Management
2. คลิก **Import CSV**
3. สร้างไฟล์ CSV ทดสอบ:
```csv
customer_name,contact_person,phone,source,customer_type,product_category,steel_type,quantity,unit,estimated_budget,assigned_to
บริษัททดสอบ,นายทดสอบ,081-111-2222,Walk-in,ลูกค้าทั่วไป,เหล็กเส้น,เหล็กเส้นกลม,100,เส้น,50000,วิชัย
```
4. Import ไฟล์
5. ตรวจสอบว่า:
   - ข้อมูลแสดงใน Dashboard
   - ข้อมูลเพิ่มใน Google Sheets (sheet "leads")

#### 4.4 ทดสอบ Export

1. ไปที่ Export Center
2. คลิก **Export** สำหรับ Lead Register
3. เปิดไฟล์ CSV ที่ดาวน์โหลด
4. ตรวจสอบว่ามีข้อมูลถูกต้อง

---

### ขั้นตอนที่ 5: ตั้ง Custom Domain (Optional)

ถ้ามี domain ของตัวเอง (เช่น `crc-steel.com`):

#### 5.1 เพิ่ม Custom Domain ใน Cloudflare

1. ไปที่ Cloudflare Pages project
2. คลิก **Custom domains** tab
3. คลิก **Set up a custom domain**
4. พิมพ์ domain (เช่น `dashboard.crc-steel.com`)
5. คลิก **Continue**
6. Cloudflare จะแสดง DNS records ที่ต้องเพิ่ม
7. ไปที่ domain registrar ของคุณ
8. เพิ่ม DNS records ตามที่ Cloudflare แสดง
9. รอ ~5-10 นาที
10. กลับมาที่ Cloudflare → คลิก **Activate**

---

## 🔧 การ Update ระบบ

เมื่อมีโค้ดใหม่ใน GitHub:

### Auto Deploy (แนะนำ)
1. Push code ใหม่ขึ้น GitHub
2. Cloudflare จะ auto-deploy อัตโนมัติ
3. รอ ~2 นาที
4. เปิด URL → เห็นเวอร์ชันใหม่

### Manual Deploy
1. ไปที่ Cloudflare Pages project
2. คลิก **Deployments** tab
3. คลิก **Create deployment**
4. เลือก branch (main)
5. คลิก **Create deployment**

---

## 📊 เชื่อมต่อ Looker Studio

### 1. Import ข้อมูลเข้า Google Sheets

1. เปิด Dashboard → Export Center
2. Export dataset ที่ต้องการ
3. เปิด Google Sheets
4. File → Import → Upload
5. เลือกไฟล์ CSV
6. เลือก **Replace current sheet** หรือ **Insert new sheet(s)**
7. คลิก **Import data**

### 2. สร้าง Report ใน Looker Studio

1. เปิด https://lookerstudio.google.com
2. คลิก **Create → Report**
3. คลิก **Add data**
4. เลือก **Google Sheets**
5. เลือก Google Sheets "CRC Marketing Dashboard"
6. เลือก sheet ที่ต้องการ (เช่น "sales")
7. คลิก **Add**
8. สร้าง charts:
   - คลิก **Add a chart**
   - เลือก chart type (Bar, Line, Pie, etc.)
   - เลือก dimension และ metric
   - Customize ตามต้องการ
9. คลิก **View** เพื่อดู report
10. คลิก **Share** เพื่อแชร์ให้ทีม

### 3. ตั้ง Auto Refresh

1. ใน Looker Studio
2. คลิก **Report settings** (⚙️)
3. คลิก **Data refresh**
4. เลือก interval (เช่น ทุก 1 ชั่วโมง)
5. คลิก **Done**

---

## ⚠️ ข้อจำกัดและข้อควรระวัง

### Google Sheets
- สูงสุด 5 ล้าน cells (เพียงพอสำหรับ CRC)
- ความเร็วลดลงเมื่อข้อมูลมาก (>100,000 rows)
- ไม่เหมาะสำหรับ real-time updates

### Google Apps Script
- Quota: 10,000 calls/day (เพียงพอ)
- Execution time limit: 6 นาที/request
- ถ้า quota หมด → รอ 24 ชม.

### Cloudflare Pages
- ไม่จำกัด bandwidth
- ไม่จำกัด requests
- Build time limit: 20 นาที

---

## 🆘 การแก้ไขปัญหา

### ปัญหา: Deploy ล้มเหลว
**วิธีแก้:**
1. ตรวจสอบ Build log ใน Cloudflare
2. ตรวจสอบว่า `npm run build` ทำงานได้บนเครื่อง local
3. ตรวจสอบ Node.js version (ควรเป็น 18+)

### ปัญหา: ข้อมูลไม่ sync
**วิธีแก้:**
1. ตรวจสอบ Google Apps Script ว่า Deploy แล้ว
2. ตรวจสอบ URL ใน Environment Variables
3. ดู Console log ใน browser (F12)
4. ตรวจสอบ Google Sheets API quota

### ปัญหา: Login ไม่ได้
**วิธีแก้:**
1. ตรวจสอบว่ามี sheet "users" ใน Google Sheets
2. ตรวจสอบ username/password ใน sheet
3. Hard refresh browser (Ctrl+Shift+R)

### ปัญหา: Import ไม่ทำงาน
**วิธีแก้:**
1. ตรวจสอบรูปแบบไฟล์ CSV
2. ตรวจสอบว่า header ตรงกับที่กำหนด
3. ดู Console log ใน browser

---

## 📞 ติดต่อทีมพัฒนา

### สร้าง Issue ใน GitHub
1. ไปที่ GitHub repository
2. คลิก **Issues → New Issue**
3. กรอกข้อมูล:
   - ปัญหาที่พบ
   - ขั้นตอนที่ทำให้เกิด
   - Expected vs Actual
   - Screenshots
   - Browser version
   - Console logs

---

## ✅ Checklist การ Deploy

- [ ] สร้าง Google Sheets ครบ 6 sheets
- [ ] เพิ่ม header ในแต่ละ sheet
- [ ] เพิ่มข้อมูล users ใน sheet
- [ ] สร้าง Google Apps Script
- [ ] Deploy Apps Script เป็น Web app
- [ ] คัดลอก Web app URL
- [ ] คัดลอก Google Sheet ID
- [ ] เพิ่ม Environment Variables ใน GitHub
- [ ] สร้าง Cloudflare Pages project
- [ ] เชื่อมต่อ GitHub repository
- [ ] ตั้งค่า Build command และ output directory
- [ ] เพิ่ม Environment Variables ใน Cloudflare
- [ ] Deploy สำเร็จ
- [ ] ทดสอบ Login
- [ ] ทดสอบ Google Sheets sync
- [ ] ทดสอบ Import
- [ ] ทดสอบ Export
- [ ] (Optional) ตั้ง Custom domain

---

**เวลา deploy ทั้งหมด:** ~10-15 นาที  
**ค่าใช้จ่าย:** 0 บาท  
**สถานะ:** ✅ พร้อมใช้งาน

---

**อัปเดตล่าสุด:** 2026  
**เวอร์ชัน:** 1.0.0
