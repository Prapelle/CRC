# ✅ แก้ไขปัญหา: Deploy Command ผิด

## ❌ ปัญหาที่พบ

```
✘ [ERROR] Your Wrangler configuration is missing a `previews` block
Failed: error occurred while running deploy command
```

## 🔍 สาเหตุ

**Build สำเร็จแล้ว** ✅ แต่ **deploy command ผิด** ❌

คุณตั้ง deploy command เป็น `npx wrangler preview` ซึ่ง:
- ❌ ไม่ใช่คำสั่งสำหรับ Cloudflare Pages
- ❌ wrangler.toml ที่สร้างไว้เป็นของ Cloudflare Workers ไม่ใช่ Pages
- ❌ Cloudflare Pages ไม่ต้องใช้ wrangler CLI

---

## ✅ วิธีแก้ไข (2 นาที)

### ขั้นตอนที่ 1: ลบ Deploy Command

1. เปิด Cloudflare Dashboard
2. ไปที่ **Workers & Pages** → โปรเจกต์ของคุณ
3. คลิก **Settings** tab
4. คลิก **Builds & deployments**
5. หา **Deploy command**
6. **ลบออก** (เว้นว่างไว้)

### ขั้นตอนที่ 2: ตรวจสอบ Settings

ตรวจสอบว่าตั้งค่าถูกต้อง:

```
Build command:        npm run build
Build output directory: dist
Deploy command:       (เว้นว่าง)
Root directory:       (เว้นว่าง)
```

### ขั้นตอนที่ 3: Retry Deploy

1. คลิก **Deployments** tab
2. คลิก **Retry deployment** หรือ **Create new deployment**
3. รอ ~2 นาที
4. ✅ สำเร็จ!

---

## 🎯 Cloudflare Pages ทำงานยังไง

### ถูกต้อง ✅
```
GitHub Push → Cloudflare Auto Build → Deploy
```

### ผิด ❌
```
GitHub Push → Build → Wrangler Deploy (ไม่จำเป็น)
```

**Cloudflare Pages:**
- ไม่ต้องใช้ wrangler.toml
- ไม่ต้องใช้ wrangler CLI
- ไม่ต้องตั้ง deploy command
- แค่ตั้ง build command และ output directory

---

## 📋 Checklist

- [ ] ลบ deploy command ออกจาก Cloudflare settings
- [ ] ตรวจสอบ build command = `npm run build`
- [ ] ตรวจสอบ output directory = `dist`
- [ ] Retry deployment
- [ ] รอ ~2 นาที
- [ ] เปิด URL ที่ได้จาก Cloudflare

---

## 💡 คำแนะนำ

### สำหรับ Cloudflare Pages

**ไม่ต้องทำ:**
- ❌ ไม่ต้องใช้ wrangler.toml
- ❌ ไม่ต้องใช้ wrangler CLI
- ❌ ไม่ต้องตั้ง deploy command

**ต้องทำ:**
- ✅ ตั้ง build command = `npm run build`
- ✅ ตั้ง output directory = `dist`
- ✅ เชื่อมต่อ GitHub repository
- ✅ เลือก branch (main/master)

### Cloudflare จะทำอัตโนมัติ:
1. Detect การ push ใหม่
2. รัน `npm run build`
3. Deploy จาก folder `dist`
4. ให้ URL เช่น `crc-dashboard.pages.dev`

---

## 🆘 ยังไม่ได้?

### ตรวจสอบ Log

1. เปิด Deployments
2. คลิก deployment ล่าสุด
3. ดู Build logs
4. ควรเห็น:
   ```
   ✓ built in X.XXs
   Success: Build command completed
   ```

### ถ้ายัง error

1. ตรวจสอบว่าลบ deploy command แล้ว
2. ตรวจสอบ build command และ output directory
3. ลองสร้าง deployment ใหม่

---

## 📞 สรุปสั้นๆ

**ปัญหา:** ตั้ง deploy command ผิด (`npx wrangler preview`)

**วิธีแก้:**
1. ลบ deploy command ออกจาก Cloudflare settings
2. Retry deployment
3. ✅ สำเร็จ!

**Cloudflare Pages ไม่ต้องใช้ wrangler เลย!**

---

**อัปเดต:** 2026  
**สถานะ:** ✅ พร้อม deploy
