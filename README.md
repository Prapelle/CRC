# 🏗️ CRC Marketing & Sales Dashboard

ระบบ Dashboard สำหรับธุรกิจร้านจำหน่ายเหล็ก CRC ติดตามผลการตลาด จัดการลูกค้า และวิเคราะห์ยอดขาย

![Version](https://img.shields.io/badge/version-1.0.0-orange)
![License](https://img.shields.io/badge/license-MIT-blue)
![Status](https://img.shields.io/badge/status-Production%20Ready-green)

---

## 🎯 ภาพรวม

**CRC Marketing & Sales Dashboard** เป็นระบบที่ช่วยให้เจ้าของธุรกิจและทีมงานสามารถ:

- ✅ ติดตามผลการตลาดทุกช่องทาง (Facebook, Google, LINE, Website)
- ✅ จัดการลูกค้าตั้งแต่ Lead จนถึงการปิดการขาย
- ✅ ติดตามใบเสนอราคาและอัตราการแปลง
- ✅ วิเคราะห์ยอดขายและกำไร
- ✅ Export ข้อมูลไปใช้ต่อใน Google Sheets และ Looker Studio

### สถาปัตยกรรมระบบ (ฟรีทั้งหมด)

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

## 🚀 เริ่มต้นใช้งาน

### วิธีที่ 1: Deploy บน Cloudflare Pages (แนะนำ)

ดูรายละเอียดใน [SETUP_GUIDE.md](./SETUP_GUIDE.md)

### วิธีที่ 2: รันบนเครื่อง Local

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/crc-marketing-dashboard.git
cd crc-marketing-dashboard

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# แก้ไข .env (ใส่ Google Sheets API URL)
nano .env

# Run development server
npm run dev
```

เปิด browser ที่ `http://localhost:3000`

---

## 📊 ฟีเจอร์หลัก

### 1. Executive Overview
- KPI ภาพรวมธุรกิจ (Ad Spend, Leads, Sales, ROAS)
- กราฟแนวโน้มยอดขายและ Leads
- Sales Funnel (Lead → Quotation → Order)
- วิเคราะห์ตามช่องทางและสินค้า

### 2. Marketing Performance
- ติดตามประสิทธิภาพโฆษณา (Facebook, Google, LINE)
- คำนวณ CPL, CTR, ROAS
- Import ข้อมูลโฆษณาจาก CSV
- เปรียบเทียบผลตามแพลตฟอร์ม

### 3. Social & Content
- ติดตาม performance ของคอนเทนต์
- วิเคราะห์ตามประเภทคอนเทนต์
- ดู Top Content ที่สร้าง engagement
- Import ข้อมูล Social Media

### 4. Website Analytics
- วิเคราะห์ traffic จาก Google Analytics
- ดู Landing Page ที่สร้าง conversion
- ติดตาม Form Submissions, Click to Call
- Import ข้อมูลจาก GA4

### 5. Lead Management
- จัดการลูกค้าแบบ CRM
- Status Pipeline (New → Contacted → Won/Lost)
- Temperature (Hot/Warm/Cold)
- บันทึกประวัติการติดต่อ
- Import/Export Leads

### 6. Quotation Management
- ติดตามใบเสนอราคา
- ดูรายการสินค้าและยอดรวม
- เปลี่ยนสถานะ (Draft → Sent → Accepted)
- คำนวณอัตราการแปลงเป็น Order

### 7. Sales Management
- ติดตามยอดขายจริง
- แยก Marketing-attributed Sales
- วิเคราะห์ตาม Channel, Customer Type, Salesperson
- ดูกำไรขั้นต้น (ถ้ามีข้อมูลต้นทุน)

### 8. Data Quality
- ตรวจสอบคุณภาพข้อมูล
- แจ้งเตือนข้อมูลที่ไม่สมบูรณ์
- ดู Data Completeness

### 9. Export Center
- Export ข้อมูลเป็น CSV
- รองรับทุก module
- ใช้กับ Google Sheets / Looker Studio

### 10. Settings
- ดูข้อมูลผู้ใช้
- จัดการข้อมูล (Reset Demo Data)
- ดู Role Permissions

---

## 🛠️ เทคโนโลยี

- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS 4
- **Charts:** Recharts
- **Icons:** Lucide React
- **Database:** Google Sheets (via Apps Script)
- **Hosting:** Cloudflare Pages
- **Version Control:** GitHub

---

## 📁 โครงสร้างโปรเจกต์

```
crc-marketing-dashboard/
├── src/
│   ├── components/          # Shared components
│   │   ├── Layout.tsx       # Sidebar + TopBar
│   │   └── shared.tsx       # KPICard, ImportModal, etc.
│   ├── contexts/            # React Contexts
│   │   ├── AuthContext.tsx  # Authentication
│   │   └── DataContext.tsx  # Data management
│   ├── data/
│   │   └── store.ts         # Data store + utilities
│   ├── pages/               # Page components
│   │   ├── Login.tsx
│   │   ├── ExecutiveOverview.tsx
│   │   ├── MarketingPerformance.tsx
│   │   ├── SocialContent.tsx
│   │   ├── WebsiteAnalytics.tsx
│   │   ├── LeadManagement.tsx
│   │   ├── QuotationManagement.tsx
│   │   ├── SalesManagement.tsx
│   │   ├── DataQuality.tsx
│   │   ├── ExportCenter.tsx
│   │   └── Settings.tsx
│   ├── services/
│   │   └── googleSheets.ts  # Google Sheets API service
│   ├── types/
│   │   └── index.ts         # TypeScript types
│   ├── App.tsx              # Main app
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── public/
│   └── _redirects           # Cloudflare redirects
├── .env.example             # Environment variables template
├── SETUP_GUIDE.md           # Installation guide
├── USER_GUIDE.md            # User manual
├── google-apps-script.js    # Google Apps Script code
├── wrangler.toml            # Cloudflare config
└── README.md                # This file
```

---

## 🔐 การเข้าถึง (Roles)

| Role | สิทธิ์ |
|------|--------|
| **Admin** | เข้าถึงทุกเมนู |
| **Management** | เข้าถึงทุกเมนู |
| **Marketing** | Marketing, Social, Website, Leads, Export |
| **Sales** | Leads, Quotations, Sales, Export |
| **Data Analyst** | ทุกเมนูยกเว้น Settings |

### บัญชีทดสอบ (Demo)
```
Username: admin
Password: admin123
Role: Admin

Username: wichai
Password: sales123
Role: Sales

Username: somsri
Password: sales123
Role: Sales

Username: marketing
Password: mkt123
Role: Marketing
```

---

## 📥 การ Import ข้อมูล

### รูปแบบไฟล์ CSV

#### Leads
```csv
customer_name,contact_person,phone,source,customer_type,product_category,steel_type,quantity,unit,estimated_budget,assigned_to
บริษัท ABC,สมชาย,081-234-5678,Facebook Ads,ผู้รับเหมา,เหล็กเส้น,เหล็กเส้นกลม,500,เส้น,150000,วิชัย
```

#### Quotations
```csv
quotation_number,lead_id,quotation_date,valid_until,salesperson,status,subtotal,grand_total
CRC-2025-001,L001,2025-01-15,2025-02-15,วิชัย,Sent,140000,152800
```

#### Sales
```csv
order_number,order_date,customer_name,sales_channel,salesperson,order_status,payment_status,net_sales,grand_total
ORD-2025-001,2025-01-25,บริษัท สร้างดี จำกัด,Direct,วิชัย,Completed,Paid,140000,152800
```

### การป้องกันข้อมูลซ้ำ
ระบบจะตรวจสอบข้อมูลซ้ำอัตโนมัติ:
- **Leads:** ตรวจสอบตามเบอร์โทรศัพท์
- **Quotations:** ตรวจสอบตาม quotation_number
- **Sales:** ตรวจสอบตาม order_number
- **Advertising:** ตรวจสอบตาม campaign_id + date + report_level

---

## 📤 การ Export ข้อมูล

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

### การใช้กับ Looker Studio
1. Export ข้อมูลเป็น CSV
2. Import เข้า Google Sheets
3. เชื่อมต่อ Google Sheets กับ Looker Studio
4. สร้าง Dashboard ใน Looker Studio

---

## 📚 เอกสาร

- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - คู่มือการติดตั้ง
- [USER_GUIDE.md](./USER_GUIDE.md) - คู่มือการใช้งาน
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - การแก้ไขปัญหา

---

## ⚠️ ข้อจำกัด

### ระบบ Demo (localStorage)
- ข้อมูลเก็บใน browser ของแต่ละคน
- ไม่ sync ข้ามเครื่อง
- ข้อมูลหายเมื่อ clear browser

### ระบบ Production (Google Sheets)
- ต้องตั้งค่า Google Apps Script
- มี quota 10,000 calls/day
- ต้องมี internet connection

### ข้อจำกัดของ Google Sheets
- สูงสุด 5 ล้าน cells
- ความเร็วลดลงเมื่อข้อมูลมาก
- ไม่เหมาะสำหรับ real-time updates

---

## 🤝 การสนับสนุน

### รายงานปัญหา
สร้าง Issue ใน GitHub พร้อมรายละเอียด:
- ขั้นตอนที่ทำให้เกิดปัญหา
- Expected behavior
- Actual behavior
- Screenshots (ถ้ามี)

### ขอฟีเจอร์ใหม่
สร้าง Issue และติดป้าย `enhancement`

---

## 📄 License

MIT License - ใช้งานได้อย่างอิสระ

---

## 👥 ทีมพัฒนา

- **Developer:** CRC Development Team
- **Version:** 1.0.0
- **Last Updated:** 2026

---

## 🙏 Acknowledgments

- React Team
- Vite Team
- Tailwind CSS Team
- Recharts Team
- Lucide Icons
- Cloudflare
- Google Sheets

---

**Made with ❤️ for CRC Steel Business**
