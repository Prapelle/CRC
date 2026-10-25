# ✅ Installation Checklist

ใช้ checklist นี้เพื่อตรวจสอบว่าติดตั้งระบบครบถ้วนแล้ว

---

## 📋 ก่อนเริ่มติดตั้ง

- [ ] มี GitHub Account
- [ ] มี Google Account
- [ ] มี Cloudflare Account (สมัครฟรี)
- [ ] โค้ด push ขึ้น GitHub แล้ว

---

## 🔧 ขั้นตอนที่ 1: สร้าง Google Sheets

- [ ] สร้าง Google Spreadsheet ใหม่
- [ ] ตั้งชื่อ "CRC Marketing Dashboard"
- [ ] สร้าง sheet `campaigns` พร้อม header
- [ ] สร้าง sheet `advertising` พร้อม header
- [ ] สร้าง sheet `leads` พร้อม header
- [ ] สร้าง sheet `quotations` พร้อม header
- [ ] สร้าง sheet `sales` พร้อม header
- [ ] สร้าง sheet `users` พร้อม header
- [ ] เพิ่มข้อมูล users (admin, wichai, somsri, marketing)

---

## 🔧 ขั้นตอนที่ 2: สร้าง Google Apps Script

- [ ] เปิด Extensions → Apps Script
- [ ] คัดลอกโค้ดจาก `google-apps-script.js`
- [ ] Save โค้ด
- [ ] Deploy → New deployment
- [ ] เลือก Web app
- [ ] Execute as: Me
- [ ] Who has access: Anyone
- [ ] Deploy สำเร็จ
- [ ] คัดลอก Web app URL
- [ ] ทดสอบ URL ใน browser (ควรเห็น JSON)

---

## 🔧 ขั้นตอนที่ 3: หา Google Sheet ID

- [ ] เปิด Google Sheets
- [ ] ดู URL: `https://docs.google.com/spreadsheets/d/ID/edit`
- [ ] คัดลอก ID (ระหว่าง `/d/` และ `/edit`)

---

## 🔧 ขั้นตอนที่ 4: ตั้งค่า GitHub

- [ ] ไปที่ Settings → Secrets and variables → Actions
- [ ] เพิ่ม variable `VITE_GOOGLE_SHEETS_API_URL`
- [ ] เพิ่ม variable `VITE_GOOGLE_SHEET_ID`
- [ ] เพิ่ม variable `VITE_ENABLE_GOOGLE_SHEETS_SYNC` = `true`

---

## 🔧 ขั้นตอนที่ 5: Deploy บน Cloudflare

- [ ] เปิด dash.cloudflare.com
- [ ] Workers & Pages → Create → Pages
- [ ] Connect to Git
- [ ] เลือก repository
- [ ] Build command: `npm run build`
- [ ] Build output directory: `dist`
- [ ] เพิ่ม Environment Variables (3 ตัว)
- [ ] Save and Deploy
- [ ] รอ deploy สำเร็จ (~2 นาที)
- [ ] คัดลอก URL (เช่น `crc-dashboard.pages.dev`)

---

## 🧪 ขั้นตอนที่ 6: ทดสอบระบบ

### 6.1 ทดสอบ Login
- [ ] เปิด URL จาก Cloudflare
- [ ] Login ด้วย admin/admin123
- [ ] เข้าหน้า Executive Overview ได้
- [ ] Logout ได้

### 6.2 ทดสอบทุก Role
- [ ] Login ด้วย wichai/sales123 → เห็นเมนู Sales
- [ ] Login ด้วย somsri/sales123 → เห็นเมนู Sales
- [ ] Login ด้วย marketing/mkt123 → เห็นเมนู Marketing
- [ ] แต่ละ role เห็นเมนูตามสิทธิ์

### 6.3 ทดสอบ Google Sheets Sync
- [ ] แก้ไขข้อมูลใน Google Sheets
- [ ] Refresh Dashboard (F5)
- [ ] ข้อมูลอัปเดตใน Dashboard
- [ ] เพิ่มข้อมูลใน Dashboard
- [ ] ข้อมูลเพิ่มใน Google Sheets

### 6.4 ทดสอบ Import
- [ ] ไปที่ Lead Management
- [ ] คลิก Import CSV
- [ ] สร้างไฟล์ CSV ทดสอบ
- [ ] Import ไฟล์
- [ ] ข้อมูลแสดงใน Dashboard
- [ ] ข้อมูลเพิ่มใน Google Sheets

### 6.5 ทดสอบ Export
- [ ] ไปที่ Export Center
- [ ] Export Lead Register
- [ ] ดาวน์โหลดไฟล์ CSV
- [ ] เปิดไฟล์ → มีข้อมูลถูกต้อง

### 6.6 ทดสอบทุกหน้า
- [ ] Executive Overview → เห็น KPIs และกราฟ
- [ ] Marketing Performance → เห็นข้อมูลโฆษณา
- [ ] Social & Content → เห็นข้อมูล social
- [ ] Website Analytics → เห็นข้อมูล website
- [ ] Lead Management → เห็นรายการ leads
- [ ] Quotation Management → เห็น quotations
- [ ] Sales Management → เห็น orders
- [ ] Data Quality → เห็น quality issues
- [ ] Export Center → export ได้ทุก dataset
- [ ] Settings → เห็นข้อมูลระบบ

### 6.7 ทดสอบ Responsive
- [ ] เปิดบน Desktop → แสดงผลปกติ
- [ ] เปิดบน Tablet → แสดงผลปกติ
- [ ] เปิดบน Mobile → แสดงผลปกติ
- [ ] Sidebar เปิด/ปิด ได้บน mobile

---

## 📊 ขั้นตอนที่ 7: เชื่อมต่อ Looker Studio (Optional)

- [ ] Export ข้อมูลจาก Dashboard
- [ ] Import เข้า Google Sheets
- [ ] เปิด Looker Studio
- [ ] สร้าง Report ใหม่
- [ ] Add data → Google Sheets
- [ ] เลือก Google Sheets
- [ ] สร้าง charts
- [ ] แชร์ report ให้ทีม

---

## 🌐 ขั้นตอนที่ 8: ตั้ง Custom Domain (Optional)

- [ ] มี domain ของตัวเอง
- [ ] ไปที่ Cloudflare Pages → Custom domains
- [ ] เพิ่ม domain
- [ ] เพิ่ม DNS records ที่ domain registrar
- [ ] รอ DNS propagate (~5-10 นาที)
- [ ] Activate domain ใน Cloudflare
- [ ] ทดสอบเปิด domain

---

## 📚 ขั้นตอนที่ 9: อ่านเอกสาร

- [ ] อ่าน `QUICK_START.md`
- [ ] อ่าน `USER_GUIDE.md`
- [ ] อ่าน `TROUBLESHOOTING.md`
- [ ] ส่งต่อ `USER_GUIDE.md` ให้ทีมงาน

---

## 🎉 เสร็จสมบูรณ์!

ถ้า checklist ทุกข้อเป็น ✅ = ระบบพร้อมใช้งาน

### สิ่งที่ทำต่อไปได้:
1. เพิ่มข้อมูลจริงจาก Google Ads, Facebook Ads
2. Import leads จากไฟล์ Excel เดิม
3. สร้างรายงานใน Looker Studio
4. อบรมทีมงานให้ใช้ระบบ
5. ตั้ง LINE Notify แจ้งเตือน (ถ้าต้องการ)

---

## 🆘 ถ้ามีปัญหา

1. อ่าน `TROUBLESHOOTING.md`
2. ตรวจสอบ Console log (F12)
3. ตรวจสอบ Google Apps Script logs
4. สร้าง Issue ใน GitHub

---

## 📞 ติดต่อทีมพัฒนา

- GitHub Issues: สร้าง issue ใน repository
- Email: admin@crc-steel.com (ตัวอย่าง)

---

**วันที่ติดตั้ง:** _______________  
**ผู้ติดตั้ง:** _______________  
**URL Dashboard:** _______________  
**สถานะ:** ☐ สำเร็จ ☐ มีปัญหา

---

**เวอร์ชัน:** 1.0.0  
**อัปเดตล่าสุด:** 2026
