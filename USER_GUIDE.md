# 📘 คู่มือการใช้งาน CRC Marketing & Sales Dashboard

## สารบัญ
1. [เข้าสู่ระบบ](#เข้าสู่ระบบ)
2. [Executive Overview](#executive-overview)
3. [Marketing Performance](#marketing-performance)
4. [Lead Management](#lead-management)
5. [Quotation Management](#quotation-management)
6. [Sales Management](#sales-management)
7. [Import ข้อมูล](#import-ข้อมูล)
8. [Export ข้อมูล](#export-ข้อมูล)

---

## เข้าสู่ระบบ

### ขั้นตอนการ Login
1. เปิด URL ที่ได้รับ (เช่น `crc-dashboard.pages.dev`)
2. กรอก Username และ Password
3. คลิก **Sign In**

### บัญชีทดสอบ (Demo)
| Username | Password | Role | สิทธิ์ |
|----------|----------|------|--------|
| admin | admin123 | Admin | เข้าถึงทุกเมนู |
| wichai | sales123 | Sales | Leads, Quotations, Sales |
| somsri | sales123 | Sales | Leads, Quotations, Sales |
| marketing | mkt123 | Marketing | Marketing, Social, Website, Leads |

---

## Executive Overview

**วัตถุประสงค์:** ดูภาพรวมธุรกิจจากหน้าเดียว

### KPI ที่แสดง
- **Ad Spend:** ค่าโฆษณาทั้งหมด
- **Total Leads:** จำนวนลูกค้าที่ติดต่อเข้ามา
- **Qualified Leads:** ลูกค้าที่มีศักยภาพ
- **CPL (Cost per Lead):** ค่าใช้จ่ายต่อ Lead
- **Quotations:** จำนวนใบเสนอราคา
- **Orders:** จำนวนคำสั่งซื้อ
- **Total Sales:** ยอดขายรวม
- **Gross Profit:** กำไรขั้นต้น
- **ROAS:** ผลตอบแทนจากค่าโฆษณา

### กราฟที่แสดง
1. **Monthly Sales & Leads Trend** - แนวโน้มยอดขายและ Leads รายเดือน
2. **Leads by Source** - สัดส่วน Leads ตามช่องทาง
3. **Sales Funnel** - การเปลี่ยนจาก Lead → Order
4. **Quotation Status** - สถานะใบเสนอราคา
5. **Top Products** - สินค้าที่สร้างยอดขายสูงสุด

### ตัวกรอง (Filters)
- ช่วงวันที่ (From/To)
- ช่องทางการตลาด (Channel)

---

## Marketing Performance

**วัตถุประสงค์:** วิเคราะห์ประสิทธิภาพโฆษณาแต่ละช่องทาง

### วิธีใช้งาน
1. ดู KPI ด้านบน (Spend, Impressions, Clicks, CTR, etc.)
2. ดูกราฟเปรียบเทียบแพลตฟอร์ม
3. ดูตารางข้อมูลด้านล่าง

### การ Import ข้อมูลโฆษณา
1. คลิกปุ่ม **Import CSV** มุมขวาบน
2. เลือกไฟล์ CSV ที่มีข้อมูลโฆษณา
3. ตรวจสอบ Preview ข้อมูล
4. คลิก **Confirm Import**

### รูปแบบไฟล์ CSV ที่รองรับ
```csv
campaign_id,platform,report_level,date,spend,impressions,reach,clicks,ctr,cpc,cpm,leads,qualified_leads
C001,Facebook Ads,Campaign,2025-01-15,2500,15000,12000,450,3.0,5.56,166.67,12,5
```

---

## Lead Management

**วัตถุประสงค์:** จัดการลูกค้าตั้งแต่เริ่มสอบถามจนถึงปิดการขาย

### สถานะ Lead (Pipeline)
```
New Lead → Contacting → Contacted → Requirement Gathering → 
Qualified → Quotation Requested → Quotation Sent → 
Negotiation → Won / Lost
```

### ระดับความพร้อมซื้อ (Temperature)
- 🔥 **Hot:** ต้องการซื้อเร็ว, มีงบประมาณชัดเจน
- 🌡️ **Warm:** กำลังเปรียบเทียบ, สนใจแต่ยังไม่รีบ
- ❄️ **Cold:** แค่สอบถามข้อมูล, ยังไม่มีแผนซื้อ

### ประเภทลูกค้า
- ผู้รับเหมา
- ช่าง
- ร้านวัสดุก่อสร้าง
- โรงงาน
- ผู้ผลิต
- ผู้ประกอบการ
- เจ้าของโครงการ
- ลูกค้าทั่วไป
- ร้านค้าตัวแทน
- ลูกค้ารายใหญ่

### วิธีใช้งาน

#### ดูรายการ Leads
1. ใช้ช่องค้นหาเพื่อหาตามชื่อ, เบอร์โทร, บริษัท
2. ใช้ Filter เพื่อกรองตาม Status, Source, Customer Type
3. คลิกที่ Lead เพื่อดูรายละเอียด

#### เพิ่ม Lead ใหม่
1. คลิกปุ่ม **Add Lead**
2. กรอกข้อมูลลูกค้า (ชื่อ, เบอร์, ประเภท, สินค้าที่สนใจ)
3. คลิก **Add Lead**

#### เปลี่ยนสถานะ Lead
1. ในตาราง Lead คลิกที่ dropdown ในคอลัมน์ Status
2. เลือกสถานะใหม่
3. ระบบจะบันทึกประวัติการเปลี่ยนสถานะอัตโนมัติ

#### ดูรายละเอียด Lead
1. คลิกที่ชื่อ Lead ในตาราง
2. ดูข้อมูลลูกค้า, สินค้า, ประวัติการติดต่อ
3. ดู Quotation ที่เชื่อมโยง (ถ้ามี)

### การ Import Leads
1. คลิกปุ่ม **Import CSV**
2. เตรียมไฟล์ CSV ตามรูปแบบ:
```csv
customer_name,contact_person,phone,email,source,customer_type,product_category,steel_type,quantity,unit,estimated_budget,assigned_to
บริษัท ABC,สมชาย,081-234-5678,somchai@abc.co.th,Facebook Ads,ผู้รับเหมา,เหล็กเส้น,เหล็กเส้นกลม,500,เส้น,150000,วิชัย
```
3. ตรวจสอบ Preview
4. คลิก **Confirm Import**

---

## Quotation Management

**วัตถุประสงค์:** ติดตามใบเสนอราคาและอัตราการปิดการขาย

### สถานะใบเสนอราคา
- **Draft** - ยังไม่ส่ง
- **Pending Approval** - รอการอนุมัติ
- **Sent** - ส่งให้ลูกค้าแล้ว
- **Negotiation** - กำลังเจรจา
- **Accepted** - ลูกค้ายอมรับ
- **Rejected** - ลูกค้าปฏิเสธ
- **Expired** - หมดอายุ
- **Converted to Order** - เปลี่ยนเป็นคำสั่งซื้อ
- **Cancelled** - ยกเลิก

### วิธีใช้งาน

#### ดูรายการ Quotations
1. ดู KPI ด้านบน (จำนวน, มูลค่า, อัตราการเปลี่ยน)
2. ใช้ Filter เพื่อกรองตาม Status
3. คลิกที่ Quotation # เพื่อดูรายละเอียด

#### เปลี่ยนสถานะ Quotation
1. ในตาราง คลิกที่ dropdown ในคอลัมน์ Status
2. เลือกสถานะใหม่

#### ดูรายละเอียด Quotation
1. คลิกที่ Quotation #
2. ดูรายการสินค้า, ยอดรวม, ลูกค้า
3. ดู Lead ที่เชื่อมโยง

### การ Import Quotations
```csv
quotation_number,lead_id,quotation_date,valid_until,salesperson,status,subtotal,discount,tax,shipping,grand_total
CRC-2025-001,L001,2025-01-15,2025-02-15,วิชัย,Sent,140000,0,9800,3000,152800
```

---

## Sales Management

**วัตถุประสงค์:** ติดตามยอดขายจริงและวิเคราะห์ประสิทธิภาพ

### สถานะคำสั่งซื้อ (Order Status)
- **Draft** - ยังไม่ยืนยัน
- **Confirmed** - ยืนยันแล้ว
- **Preparing** - กำลังเตรียมสินค้า
- **Partially Delivered** - ส่งมอบบางส่วน
- **Delivered** - ส่งมอบแล้ว
- **Completed** - เสร็จสมบูรณ์
- **Cancelled** - ยกเลิก
- **Returned** - ส่งคืน

### สถานะการชำระเงิน (Payment Status)
- **Unpaid** - ยังไม่ได้ชำระ
- **Partially Paid** - ชำระบางส่วน
- **Paid** - ชำระแล้ว
- **Overdue** - เกินกำหนด
- **Refunded** - คืนเงิน

### วิธีใช้งาน

#### ดูรายการ Sales
1. ดู KPI ด้านบน (ยอดขาย, กำไร, Outstanding)
2. ดูกราฟแยกตาม Channel, Customer Type, Salesperson
3. ใช้ Filter เพื่อกรองตาม Order Status, Payment Status

#### ดูรายละเอียด Order
1. คลิกที่ Order #
2. ดูรายการสินค้า, ยอดรวม, สถานะ
3. ดู Marketing Source (ถ้ามี)

### การ Import Sales
```csv
order_number,invoice_number,order_date,customer_name,customer_type,sales_channel,salesperson,order_status,payment_status,subtotal,discount,tax,grand_total,net_sales,gross_profit,marketing_source
ORD-2025-001,INV-2025-001,2025-01-25,บริษัท สร้างดี จำกัด,ผู้รับเหมา,Direct,วิชัย,Completed,Paid,140000,0,9800,152800,140000,35000,Facebook Ads
```

---

## Import ข้อมูล

### ขั้นตอนการ Import (ใช้เหมือนกันทุกหน้า)

1. **เตรียมไฟล์ CSV**
   - ใช้ Excel หรือ Google Sheets สร้างไฟล์
   - บันทึกเป็น CSV (Comma delimited)
   - ตรวจสอบว่า header ตรงกับที่กำหนด

2. **คลิกปุ่ม Import CSV**
   - แต่ละหน้ามีปุ่ม Import ของตัวเอง
   - Marketing Performance → Import Advertising Data
   - Lead Management → Import Leads
   - etc.

3. **เลือกไฟล์**
   - คลิก Choose File
   - เลือกไฟล์ CSV จากเครื่อง

4. **ตรวจสอบ Preview**
   - ระบบจะแสดง 10 แถวแรก
   - ตรวจสอบว่าข้อมูลถูกต้อง

5. **Confirm Import**
   - คลิก Confirm Import
   - ระบบจะ:
     - ✅ เพิ่มข้อมูลใหม่
     - ⚠️ ข้ามข้อมูลซ้ำ (duplicate)
     - ❌ ปฏิเสธข้อมูลที่มี error

6. **ดูผลการ Import**
   - New: จำนวนข้อมูลที่เพิ่ม
   - Updated: จำนวนข้อมูลที่อัปเดต
   - Skipped: จำนวนข้อมูลที่ข้าม (ซ้ำ)
   - Rejected: จำนวนข้อมูลที่ปฏิเสธ

### การป้องกันข้อมูลซ้ำ
ระบบจะตรวจสอบข้อมูลซ้ำอัตโนมัติ:
- **Leads:** ตรวจสอบตามเบอร์โทรศัพท์
- **Quotations:** ตรวจสอบตาม quotation_number
- **Sales:** ตรวจสอบตาม order_number
- **Advertising:** ตรวจสอบตาม campaign_id + date + report_level

### ตัวอย่างไฟล์ CSV

#### Leads
```csv
customer_name,contact_person,phone,source,customer_type,product_category,steel_type,quantity,unit,estimated_budget,assigned_to
```

#### Quotations
```csv
quotation_number,lead_id,quotation_date,valid_until,salesperson,status,subtotal,grand_total
```

#### Sales
```csv
order_number,order_date,customer_name,sales_channel,salesperson,order_status,payment_status,net_sales,grand_total
```

---

## Export ข้อมูล

### วิธี Export
1. ไปที่เมนู **Export Center**
2. เลือก dataset ที่ต้องการ export
3. คลิกปุ่ม **Export**
4. ไฟล์ CSV จะถูกดาวน์โหลด

### Dataset ที่ Export ได้
- Campaign Performance
- Paid Media (Advertising)
- Social Content
- Website Analytics
- Lead Register
- Quotation Register
- Sales Register
- Sales Line Items
- Import History
- Data Quality Report

### การใช้ข้อมูลกับ Google Sheets / Looker Studio

#### Import เข้า Google Sheets
1. เปิด Google Sheets ใหม่
2. File → Import → Upload
3. เลือกไฟล์ CSV ที่ export
4. เลือก "Replace current sheet" หรือ "Insert new sheet(s)"
5. คลิก Import data

#### เชื่อมต่อ Looker Studio
1. เปิด Looker Studio
2. Create → Report
3. Add Data → Google Sheets
4. เลือก Google Sheets ที่มีข้อมูล
5. สร้าง charts ตามต้องการ

---

## การแก้ไขปัญหา

### ข้อมูลไม่อัปเดต
- Refresh หน้าเว็บ (F5)
- ตรวจสอบว่า Google Sheets API URL ถูกต้อง

### Import ไม่ทำงาน
- ตรวจสอบรูปแบบไฟล์ CSV
- ตรวจสอบว่า header ตรงกับที่กำหนด
- ดู Console log ใน browser (F12)

### Login ไม่ได้
- ตรวจสอบ username/password
- ตรวจสอบว่ามี sheet "users" ใน Google Sheets

### ข้อมูลหาย
- ตรวจสอบว่าไม่ได้ clear browser data
- ข้อมูลสำรองอยู่ใน Google Sheets

---

## คำแนะนำการใช้งาน

### สำหรับทีมขาย
1. **ตรวจสอบ Leads ทุกเช้า** - ดู Lead ใหม่, Lead ที่ต้องติดตาม
2. **อัปเดตสถานะทันที** - เมื่อติดต่อลูกค้าหรือได้ข้อมูลเพิ่ม
3. **บันทึกหมายเหตุ** - บันทึกความต้องการลูกค้าใน Lead
4. **ติดตาม Quotation** - ตรวจสอบสถานะใบเสนอราคา

### สำหรับทีมการตลาด
1. **Import ข้อมูลโฆษณาทุกสัปดาห์** - จาก Facebook Ads, Google Ads
2. **วิเคราะห์ ROAS** - ดูว่าช่องทางไหนคุ้มค่าที่สุด
3. **ติดตาม Content Performance** - ดูว่าคอนเทนต์ไหนได้ผล
4. **รายงานผลรายเดือน** - Export ข้อมูลไปทำรายงาน

### สำหรับผู้บริหาร
1. **ดู Executive Overview ทุกวัน** - ติดตามภาพรวมธุรกิจ
2. **ตรวจสอบ KPI** - ดูว่าเป้าหมายเป็นอย่างไร
3. **วิเคราะห์แนวโน้ม** - ดูกราฟเพื่อดูทิศทาง
4. **Export รายงาน** - นำข้อมูลไปประชุม

---

## การสนับสนุน

### ติดต่อทีมพัฒนา
- สร้าง Issue ใน GitHub
- หรือติดต่อ Admin ของระบบ

### เอกสารเพิ่มเติม
- `SETUP_GUIDE.md` - คู่มือการติดตั้ง
- `TROUBLESHOOTING.md` - การแก้ไขปัญหา
- `google-apps-script.js` - โค้ด Google Apps Script

---

**เวอร์ชัน:** 1.0.0  
**อัปเดตล่าสุด:** 2026  
**พัฒนาโดย:** CRC Development Team
