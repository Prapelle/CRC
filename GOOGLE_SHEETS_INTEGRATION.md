# 🔗 คู่มือ Google Sheets Integration

## 📋 ภาพรวม

ระบบ CRC Dashboard สามารถเชื่อมต่อกับ Google Sheets เพื่อ:
- ✅ Sync ข้อมูลจาก Dashboard ไป Google Sheets
- ✅ โหลดข้อมูลจาก Google Sheets กลับมาที่ Dashboard
- ✅ ใช้ Google Sheets เป็นฐานข้อมูลสำรอง
- ✅ แชร์ข้อมูลกับทีมผ่าน Google Sheets

---

## 🚀 ขั้นตอนการตั้งค่า (10 นาที)

### ขั้นตอนที่ 1: สร้าง Google Sheets

1. เปิด https://sheets.google.com
2. คลิก **+ Blank** เพื่อสร้าง Spreadsheet ใหม่
3. ตั้งชื่อ: **"CRC Marketing Dashboard"**
4. สร้าง 6 sheets (tabs) โดยคลิก **+** ที่มุมซ้ายล่าง:

#### Sheet 1: "campaigns"
```
campaign_id | campaign_name | platform | start_date | end_date | status | budget
```

#### Sheet 2: "advertising"
```
id | campaign_id | platform | report_level | date | spend | impressions | reach | clicks | ctr | cpc | cpm | leads | qualified_leads
```

#### Sheet 3: "leads"
```
lead_id | created_at | inquiry_date | source | customer_type | customer_name | contact_person | phone | email | product_category | steel_type | quantity | unit | estimated_budget | lead_status | lead_temperature | assigned_to
```

#### Sheet 4: "quotations"
```
quotation_id | quotation_number | lead_id | quotation_date | valid_until | salesperson | quotation_status | subtotal | discount | tax_amount | shipping_fee | grand_total
```

#### Sheet 5: "sales"
```
sales_id | order_number | invoice_number | order_date | customer_name | customer_type | sales_channel | salesperson | order_status | payment_status | subtotal | discount | tax_amount | grand_total | net_sales | gross_profit | marketing_source
```

#### Sheet 6: "users"
```
user_id | username | password | full_name | email | role
U001 | admin | admin123 | ผู้ดูแลระบบ CRC | admin@crc.com | Admin
U002 | wichai | sales123 | วิชัย ขายเก่ง | wichai@crc.com | Sales
U003 | somsri | sales123 | สมศรี ดีเด่น | somsri@crc.com | Sales
U004 | marketing | mkt123 | ทีมการตลาด CRC | mkt@crc.com | Marketing
```

---

### ขั้นตอนที่ 2: สร้าง Google Apps Script

1. ใน Google Sheets คลิก **Extensions → Apps Script**
2. ลบโค้ดเดิมทั้งหมด
3. เปิดไฟล์ `google-apps-script.js` จาก repository ของคุณ
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

---

### ขั้นตอนที่ 3: ตั้งค่าใน Dashboard

1. เปิด CRC Dashboard
2. Login ด้วย admin account
3. ไปที่เมนู **Settings**
4. หาส่วน **Google Sheets Integration**
5. วาง **API URL** ที่คัดลอกมาจากขั้นตอนที่ 2
6. (Optional) วาง **Sheet ID** จาก URL ของ Google Sheets
7. คลิก **ทดสอบการเชื่อมต่อ**
8. ถ้าเห็น "เชื่อมต่อสำเร็จ! ✅" → คลิก **บันทึกการตั้งค่า**

---

### ขั้นตอนที่ 4: Sync ข้อมูล

#### Sync จาก Dashboard ไป Google Sheets

1. คลิกปุ่ม **Sync ไป Google Sheets**
2. รอจนเห็น "Sync สำเร็จ!"
3. เปิด Google Sheets → ตรวจสอบข้อมูล

#### Load จาก Google Sheets กลับมาที่ Dashboard

1. คลิกปุ่ม **โหลดจาก Google Sheets**
2. รอจนเห็น "โหลดข้อมูลสำเร็จ!"
3. รีเฟรชหน้า Dashboard → ตรวจสอบข้อมูล

---

## 🎯 วิธีใช้งาน

### การ Sync ข้อมูล

**Sync จาก Dashboard → Google Sheets:**
- ใช้เมื่อเพิ่ม/แก้ไขข้อมูลใน Dashboard
- ข้อมูลจะถูกอัปโหลดไป Google Sheets
- ทีมงานสามารถดูข้อมูลใน Google Sheets ได้

**Load จาก Google Sheets → Dashboard:**
- ใช้เมื่อแก้ไขข้อมูลใน Google Sheets
- ข้อมูลจะถูกดาวน์โหลดกลับมาที่ Dashboard
- ใช้ sync ข้ามเครื่อง/ข้าม browser

### ตัวอย่างการใช้งาน

#### กรณีที่ 1: เพิ่ม Lead ใหม่
1. เพิ่ม Lead ใน Dashboard (Lead Management)
2. คลิก **Sync ไป Google Sheets** ใน Settings
3. ข้อมูล Lead จะถูกอัปโหลดไป Google Sheets
4. ทีมงานเปิด Google Sheets → เห็น Lead ใหม่

#### กรณีที่ 2: แก้ไขข้อมูลใน Google Sheets
1. แก้ไขข้อมูลใน Google Sheets
2. เปิด Dashboard → Settings
3. คลิก **โหลดจาก Google Sheets**
4. ข้อมูลใหม่จะถูกดาวน์โหลดมา
5. รีเฟรชหน้า → เห็นข้อมูลที่แก้ไข

#### กรณีที่ 3: ใช้หลายเครื่อง
1. เครื่อง A: เพิ่มข้อมูล → Sync ไป Google Sheets
2. เครื่อง B: โหลดจาก Google Sheets → ได้ข้อมูลใหม่
3. ข้อมูล sync กันผ่าน Google Sheets

---

## 🔧 การแก้ไขปัญหา

### ปัญหา: ทดสอบการเชื่อมต่อไม่ผ่าน

**สาเหตุ:**
- API URL ไม่ถูกต้อง
- Google Apps Script ไม่ได้ Deploy
- Permission ไม่ถูกต้อง

**วิธีแก้:**
1. ตรวจสอบ API URL ว่าคัดลอกมาครบถ้วน
2. เปิด Google Apps Script → ตรวจสอบว่า Deploy แล้ว
3. ตรวจสอบ Deploy settings:
   - Execute as: Me
   - Who has access: Anyone
4. ลอง Deploy ใหม่

---

### ปัญหา: Sync ไม่ทำงาน

**สาเหตุ:**
- ยังไม่ได้ทดสอบการเชื่อมต่อก่อน
- Google Sheets ไม่มี sheets ที่ต้องการ
- Quota หมด (10,000 calls/day)

**วิธีแก้:**
1. คลิก **ทดสอบการเชื่อมต่อ** ก่อน
2. ตรวจสอบว่ามี sheets ครบ 6 tabs
3. รอ 24 ชั่วโมงถ้า quota หมด

---

### ปัญหา: ข้อมูลไม่อัปเดต

**สาเหตุ:**
- ไม่ได้ Sync หลังแก้ไขข้อมูล
- Browser cache

**วิธีแก้:**
1. คลิก **Sync ไป Google Sheets** หลังแก้ไขข้อมูล
2. Hard refresh browser (Ctrl+Shift+R)
3. คลิก **โหลดจาก Google Sheets**

---

## 📊 ข้อจำกัด

### Google Sheets
- สูงสุด 5 ล้าน cells (เพียงพอสำหรับ CRC)
- ความเร็วลดลงเมื่อข้อมูลมาก (>100,000 rows)

### Google Apps Script
- Quota: 10,000 calls/day
- Execution time limit: 6 นาที/request
- ถ้า quota หมด → รอ 24 ชม.

### Dashboard
- ข้อมูลเก็บใน localStorage (browser)
- ต้อง Sync ด้วยตนเอง (ไม่มี auto-sync)
- ข้อมูลหายเมื่อ clear browser

---

## 💡 เคล็ดลับ

### Auto-Sync (อนาคต)
ปัจจุบันต้อง Sync ด้วยตนเอง แต่ในอนาคตสามารถ:
- ตั้ง auto-sync ทุก 5 นาที
- ใช้ Google Apps Script Trigger
- ใช้ Webhook จาก Dashboard

### Backup ข้อมูล
- Sync ไป Google Sheets ทุกวัน
- Google Sheets มี version history
- สามารถ restore ข้อมูลเก่าได้

### แชร์ข้อมูล
- Share Google Sheets กับทีมงาน
- ตั้ง permission: View only / Edit
- ทีมงานดูข้อมูลแบบ real-time

---

## 📞 สรุป

### ขั้นตอนการตั้งค่า
1. ✅ สร้าง Google Sheets (6 sheets)
2. ✅ สร้าง Google Apps Script
3. ✅ Deploy เป็น Web app
4. ✅ คัดลอก API URL
5. ✅ วางใน Dashboard Settings
6. ✅ ทดสอบการเชื่อมต่อ
7. ✅ Sync ข้อมูล

### ปุ่มสำคัญ
- **ทดสอบการเชื่อมต่อ** - ตรวจสอบว่า API URL ถูกต้อง
- **Sync ไป Google Sheets** - อัปโหลดข้อมูลจาก Dashboard
- **โหลดจาก Google Sheets** - ดาวน์โหลดข้อมูลกลับมา
- **บันทึกการตั้งค่า** - บันทึก API URL และ Sheet ID

### สถานะการเชื่อมต่อ
- 🟢 **เชื่อมต่อสำเร็จ** - พร้อมใช้งาน
- 🔴 **Connection failed** - ตรวจสอบ API URL
- 🔵 **กำลัง sync** - รอจนเสร็จ
- ⚪ **ยังไม่ได้ตั้งค่า** - วาง API URL ก่อน

---

## 🆘 ต้องการความช่วยเหลือ?

- อ่านไฟล์ `SETUP_GUIDE.md` สำหรับรายละเอียด
- อ่านไฟล์ `google-apps-script.js` สำหรับโค้ด Apps Script
- สร้าง Issue ใน GitHub

---

**อัปเดตล่าสุด:** 2026  
**เวอร์ชัน:** 1.0.0
