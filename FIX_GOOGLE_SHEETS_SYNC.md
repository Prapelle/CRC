# 🔧 แก้ไขปัญหา Google Sheets Sync

## ❌ ปัญหา: Google Sheets ยังไม่ Sync

### สาเหตุที่เป็นไปได้

1. **CORS Error** - Google Apps Script ไม่อนุญาตให้เรียกจาก browser
2. **API URL ไม่ถูกต้อง** - คัดลอก URL มาไม่ครบ
3. **Google Apps Script ยังไม่ได้ Deploy** - หรือ Deploy settings ผิด
4. **Permission ไม่ถูกต้อง** - "Who has access" ไม่ได้ตั้งเป็น "Anyone"

---

## ✅ วิธีแก้ไขทีละขั้นตอน

### ขั้นตอนที่ 1: ตรวจสอบ Google Apps Script

1. เปิด Google Sheets ของคุณ
2. คลิก **Extensions → Apps Script**
3. ตรวจสอบว่าโค้ดจาก `google-apps-script.js` ถูกวางแล้ว
4. คลิก **Save** (💾)

### ขั้นตอนที่ 2: Deploy Apps Script

1. คลิก **Deploy → New deployment**
2. คลิก ⚙️ (gear icon) → เลือก **Web app**
3. ตั้งค่า:
   - **Description:** CRC Dashboard API
   - **Execute as:** Me (your email)
   - **Who has access:** **Anyone** ⭐ สำคัญมาก!
4. คลิก **Deploy**
5. **คัดลอก URL** (เช่น `https://script.google.com/macros/s/AKfycbz.../exec`)

### ขั้นตอนที่ 3: ทดสอบ URL ใน Browser

1. เปิด URL ที่คัดลอกมาใน browser
2. เพิ่ม `?action=readAll` ต่อท้าย
3. ตัวอย่าง: `https://script.google.com/macros/s/.../exec?action=readAll`
4. กด Enter
5. ควรเห็น JSON response เช่น:
   ```json
   {
     "campaigns": [...],
     "advertising": [...],
     "leads": [...]
   }
   ```

**ถ้าเห็น JSON → API ทำงานถูกต้อง ✅**

**ถ้าเห็น Error → มีปัญหาที่ Apps Script ❌**

### ขั้นตอนที่ 4: วาง URL ใน Dashboard

1. เปิด CRC Dashboard
2. ไปที่ **Settings**
3. หาส่วน **Google Sheets Integration**
4. วาง URL ในช่อง **Google Apps Script API URL**
5. คลิก **ทดสอบการเชื่อมต่อ**

### ขั้นตอนที่ 5: ตรวจสอบ Console (F12)

1. กด F12 เพื่อเปิด Developer Tools
2. คลิก tab **Console**
3. คลิก **ทดสอบการเชื่อมต่อ**
4. ดู log:
   ```
   🔍 Testing connection to: https://script.google.com/...
   📡 Response: Response {...}
   ```

**ถ้าเห็น log → กำลังพยายามเชื่อมต่อ**

**ถ้าเห็น Error → มีปัญหา CORS หรือ URL**

---

## 🔍 ปัญหาที่พบบ่อย

### ปัญหาที่ 1: CORS Error

**อาการ:**
```
❌ CORS Error: กรุณาตรวจสอบว่า Google Apps Script Deploy แล้วและตั้ง "Who has access" เป็น "Anyone"
```

**สาเหตุ:**
- Google Apps Script ไม่ได้ตั้ง "Who has access" เป็น "Anyone"
- หรือยังไม่ได้ Deploy

**วิธีแก้:**
1. เปิด Apps Script
2. คลิก **Deploy → Manage deployments**
3. คลิก ✏️ (Edit)
4. เปลี่ยน **Who has access** เป็น **Anyone**
5. คลิก **Deploy**
6. คัดลอก URL ใหม่

---

### ปัญหาที่ 2: 404 Not Found

**อาการ:**
```
❌ Connection failed: 404
```

**สาเหตุ:**
- URL ไม่ถูกต้อง
- หรือ Apps Script ยังไม่ได้ Deploy

**วิธีแก้:**
1. ตรวจสอบ URL ว่าคัดลอกมาครบถ้วน
2. ตรวจสอบว่า Apps Script Deploy แล้ว
3. ลอง Deploy ใหม่

---

### ปัญหาที่ 3: Permission Denied

**อาการ:**
```
❌ Error: Permission denied
```

**สาเหตุ:**
- Apps Script ต้องการ permission เพื่อเข้าถึง Google Sheets

**วิธีแก้:**
1. เปิด Apps Script
2. รัน function `testAPI()` หนึ่งครั้ง
3. อนุญาต permission ที่ขอ
4. ลองอีกครั้ง

---

### ปัญหาที่ 4: Quota Exceeded

**อาการ:**
```
❌ Error: Quota exceeded
```

**สาเหตุ:**
- Google Apps Script มี quota 10,000 calls/day
- ใช้เกิน quota แล้ว

**วิธีแก้:**
- รอ 24 ชั่วโมงให้ quota รีเซ็ต
- หรือลดจำนวนการ sync

---

## 🧪 ทดสอบการเชื่อมต่อ

### วิธีที่ 1: ทดสอบใน Browser

1. เปิด URL: `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=readAll`
2. ควรเห็น JSON response
3. ถ้าเห็น JSON → API ทำงาน ✅

### วิธีที่ 2: ทดสอบใน Dashboard

1. เปิด Dashboard → Settings
2. วาง API URL
3. คลิก **ทดสอบการเชื่อมต่อ**
4. ดู Console (F12) → ดู log

### วิธีที่ 3: ทดสอบด้วย curl

```bash
curl "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=readAll"
```

ควรเห็น JSON response

---

## 📊 ตรวจสอบว่า Sync ทำงานไหม

### วิธีตรวจสอบใน Google Sheets

1. เปิด Google Sheets
2. คลิกที่ sheet ใดก็ได้ (เช่น "leads")
3. ดูว่ามีข้อมูลเพิ่มเข้ามาไหม
4. ถ้ามีข้อมูล → Sync ทำงาน ✅
5. ถ้าไม่มีข้อมูล → Sync ไม่ทำงาน ❌

### วิธีตรวจสอบใน Dashboard

1. เปิด Dashboard → Settings
2. ดูส่วน **Google Sheets Integration**
3. ดูสถานะ:
   - ✅ **Sync สำเร็จ!** → Sync ทำงาน
   - ❌ **Sync failed** → มีปัญหา
   - 🔄 **กำลัง sync** → รอจนเสร็จ

---

## 🔄 Auto-Sync

### เปิด Auto-Sync

1. เปิด Dashboard → Settings
2. หาส่วน **Google Sheets Integration**
3. เปิด toggle **Auto-Sync**
4. ระบบจะ sync อัตโนมัติทุก 5 นาที

### ปิด Auto-Sync

1. ปิด toggle **Auto-Sync**
2. ระบบจะหยุด sync อัตโนมัติ
3. ต้อง sync ด้วยตนเอง

---

## 💡 เคล็ดลับ

### ใช้ Console Debug

1. กด F12 → Console
2. ลอง sync
3. ดู log:
   ```
   📤 Syncing leads: 10 records
   ✅ leads synced successfully
   ```

### ตรวจสอบ Network Tab

1. กด F12 → Network
2. ลอง sync
3. ดู request ไป Google Apps Script
4. ตรวจสอบ:
   - Status code: 200 = สำเร็จ
   - Response: JSON = ทำงานถูกต้อง

### ใช้ Incognito Mode

ถ้ามีปัญหา cache:
1. เปิด Incognito Mode (Ctrl+Shift+N)
2. เปิด Dashboard
3. ตั้งค่า Google Sheets ใหม่
4. ทดสอบอีกครั้ง

---

## 📞 สรุป

### ขั้นตอนการแก้ไขปัญหา

1. ✅ ตรวจสอบ Google Apps Script Deploy แล้ว
2. ✅ ตรวจสอบ "Who has access" = "Anyone"
3. ✅ ทดสอบ URL ใน browser
4. ✅ วาง URL ใน Dashboard
5. ✅ ทดสอบการเชื่อมต่อ
6. ✅ ดู Console (F12) สำหรับ debug
7. ✅ ตรวจสอบ Google Sheets ว่ามีข้อมูลไหม

### ถ้ายังไม่ได้

1. ส่ง screenshot ของ:
   - Console log (F12)
   - Network tab
   - Google Apps Script Deploy settings
   - ผลการทดสอบใน Dashboard

---

## 🆘 ต้องการความช่วยเหลือ?

- อ่านไฟล์ `GOOGLE_SHEETS_INTEGRATION.md`
- อ่านไฟล์ `google-apps-script.js`
- สร้าง Issue ใน GitHub

---

**อัปเดตล่าสุด:** 2026  
**เวอร์ชัน:** 1.0.0
