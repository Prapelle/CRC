# 📍 คำอธิบาย: Build Output Directory vs Root Directory

## ❓ คำถามของคุณ

> "ไม่เจอ Build output directory ใช่ Root directory ไหม"

## ✅ คำตอบ

**ไม่ใช่!** ทั้ง 2 ช่องต่างกัน:

| ช่อง | คืออะไร | ค่าที่ตั้ง |
|-----|---------|----------|
| **Build output directory** | โฟลเดอร์ที่เก็บไฟล์หลัง build | `dist` |
| **Root directory** | โฟลเดอร์รากของโปรเจกต์ | (เว้นว่าง) |

---

## 🎯 อธิบายแต่ละช่อง

### 1. Build Command
```
npm run build
```
**คืออะไร:** คำสั่งที่ Cloudflare จะรันเพื่อ build โปรเจกต์

**ค่าที่ตั้ง:** `npm run build`

---

### 2. Build Output Directory ⭐ (สำคัญ!)
```
dist
```
**คืออะไร:** โฟลเดอร์ที่เก็บไฟล์ HTML/CSS/JS หลัง build สำเร็จ

**ค่าที่ตั้ง:** `dist`

**ทำไมต้อง `dist`:**
- Vite build แล้วสร้างไฟล์ในโฟลเดอร์ `dist`
- Cloudflare จะ deploy ไฟล์จากโฟลเดอร์นี้
- ถ้าตั้งผิด → Deploy ล้มเหลว

---

### 3. Root Directory
```
(เว้นว่าง)
```
**คืออะไร:** โฟลเดอร์รากของโปรเจกต์ใน GitHub

**ค่าที่ตั้ง:** (เว้นว่าง)

**ทำไมต้องเว้นว่าง:**
- โปรเจกต์อยู่รากของ repository
- ถ้ามีค่าอื่น → Cloudflare หาไฟล์ไม่เจอ

---

## 📸 ตำแหน่งใน Cloudflare Dashboard

```
Settings → Builds & deployments

┌─────────────────────────────────────────┐
│ Build settings                          │
├─────────────────────────────────────────┤
│ Framework preset:  [ None          ▼ ]  │
│                                         │
│ Build command:     [ npm run build  ]  │ ← ช่องที่ 1
│                                         │
│ Build output       [ dist           ]  │ ← ช่องที่ 2 ⭐
│ directory:                               │
│                                         │
│ Root directory:    [                  ] │ ← ช่องที่ 3 (เว้นว่าง)
│                                         │
│ Deploy command:    [                  ] │ ← ช่องที่ 4 (เว้นว่าง)
└─────────────────────────────────────────┘
```

---

## ✅ การตั้งค่าที่ถูกต้อง

### สำหรับโปรเจกต์ CRC Dashboard

```
Build command:          npm run build
Build output directory: dist
Root directory:         (เว้นว่าง)
Deploy command:         (เว้นว่าง)
```

---

## 🔍 วิธีหา Build Output Directory

### วิธีที่ 1: ดูจาก Vite Config

เปิดไฟล์ `vite.config.js`:
```javascript
export default defineConfig({
  build: {
    outDir: 'dist'  // ← นี่คือ Build output directory
  }
})
```

### วิธีที่ 2: รัน Build ในเครื่อง

```bash
npm run build
```

ดูว่าสร้างโฟลเดอร์อะไร:
- ✅ เห็น `dist/` → ตั้งเป็น `dist`
- ✅ เห็น `build/` → ตั้งเป็น `build`

### วิธีที่ 3: ดูจาก Log

ใน Cloudflare build log จะเห็น:
```
dist/index.html                   3.21 kB
dist/assets/index-CXF83yjc.css   28.09 kB
dist/assets/index-IkYT4bYB.js   714.17 kB
```

→ Build output directory = `dist`

---

## ❌ ถ้าตั้งผิดจะเกิดอะไรขึ้น

### ตั้ง Build output directory ผิด

```
❌ ตั้งเป็น: build
✅ จริงๆ คือ: dist

ผลลัพธ์: Cloudflare หาไฟล์ไม่เจอ → Deploy ล้มเหลว
```

### ตั้ง Root directory ผิด

```
❌ ตั้งเป็น: /app
✅ จริงๆ คือ: (เว้นว่าง)

ผลลัพธ์: Cloudflare หา package.json ไม่เจอ → Build ล้มเหลว
```

---

## 📋 Checklist การตั้งค่า

- [ ] **Build command** = `npm run build`
- [ ] **Build output directory** = `dist` ⭐
- [ ] **Root directory** = (เว้นว่าง)
- [ ] **Deploy command** = (เว้นว่าง)
- [ ] **Production branch** = `main` หรือ `master`

---

## 🎯 สรุปสั้นๆ

| ช่อง | ค่าที่ตั้ง | หมายเหตุ |
|-----|----------|----------|
| Build command | `npm run build` | คำสั่ง build |
| **Build output directory** | **`dist`** | ⭐ **สำคัญ!** |
| Root directory | (เว้นว่าง) | ไม่ต้องตั้ง |
| Deploy command | (เว้นว่าง) | ไม่ต้องตั้ง |

---

## 🆘 ถ้ายังไม่เห็น Build output directory

### กรณี 1: ใช้ Cloudflare Pages (ใหม่)

ช่องอาจชื่อต่างกัน:
- **Old UI:** "Build output directory"
- **New UI:** "Output directory" หรือ "Build output"

### กรณี 2: ใช้ Cloudflare Workers

ถ้าใช้ Workers (ไม่ใช่ Pages) จะไม่มีช่องนี้
→ ใช้ Wrangler แทน

### กรณี 3: หาไม่เจอจริงๆ

1. ลองค้นหาในหน้า Settings
2. ใช้ Ctrl+F หา "output" หรือ "dist"
3. ดูเอกสาร Cloudflare: https://developers.cloudflare.com/pages/

---

## 💡 คำแนะนำ

### สำหรับ CRC Dashboard

**ใช้ Cloudflare Pages:**
- ✅ มีช่อง Build output directory
- ✅ ตั้งเป็น `dist`
- ✅ ไม่ต้องใช้ Wrangler

**ไม่ต้องทำ:**
- ❌ ไม่ต้องใช้ wrangler.toml
- ❌ ไม่ต้องใช้ wrangler CLI
- ❌ ไม่ต้องตั้ง deploy command

---

## 📞 สรุป

**คำถาม:** "ไม่เจอ Build output directory ใช่ Root directory ไหม"

**คำตอบ:** ❌ **ไม่ใช่!**

- **Build output directory** = `dist` (โฟลเดอร์ที่เก็บไฟล์หลัง build)
- **Root directory** = (เว้นว่าง) (โฟลเดอร์รากของโปรเจกต์)

**ต้องตั้ง:**
- Build output directory = `dist`
- Root directory = (เว้นว่าง)

---

**อัปเดต:** 2026  
**สถานะ:** ✅ พร้อม deploy
