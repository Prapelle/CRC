# 🚨 แก้ไขปัญหา Netlify Build Error (Exit Code 2)

## ❌ ปัญหา

```
Failed during stage 'building site': Build script returned non-zero exit code: 2
```

**Exit code 2** มักเกิดจาก:
- TypeScript errors
- Missing dependencies
- Node version ไม่ตรง
- Build cache เก่า

---

## ✅ วิธีแก้ไข (ทำทีละขั้นตอน)

### ขั้นตอนที่ 1: Push ไฟล์แก้ไขขึ้น GitHub

ผมได้แก้ไขไฟล์เหล่านี้แล้ว:

1. ✅ **`.nvmrc`** - กำหนด Node version = 18
2. ✅ **`tsconfig.json`** - เพิ่ม vite-env.d.ts ใน include
3. ✅ **`src/vite-env.d.ts`** - Type declarations สำหรับ import.meta.env
4. ✅ **`netlify.toml`** - เพิ่ม NPM_FLAGS

**Push ไฟล์ทั้งหมด:**

```bash
git add .
git commit -m "Fix Netlify build errors"
git push origin main
```

### ขั้นตอนที่ 2: Clear Cache ใน Netlify

1. เปิด https://app.netlify.com
2. คลิกโปรเจกต์ของคุณ
3. คลิก **Deploys** tab
4. คลิก **Trigger deploy** → **Clear cache and deploy site**
5. รอ ~2-3 นาที

### ขั้นตอนที่ 3: ตรวจสอบ Build Log

1. คลิก deployment ล่าสุด
2. ดู **Deploy log**
3. หา error message

---

## 🔍 Error ที่พบบ่อยและวิธีแก้

### Error 1: TypeScript errors

```
error TS2304: Cannot find name 'import'
```

**วิธีแก้:**
- ✅ แก้ไขแล้วใน `src/vite-env.d.ts`
- ✅ แก้ไขแล้วใน `tsconfig.json`

### Error 2: Node version ไม่ตรง

```
npm ERR! Unsupported engine
```

**วิธีแก้:**
- ✅ เพิ่มไฟล์ `.nvmrc` (Node 18)
- ✅ เพิ่ม `NODE_VERSION = "18"` ใน netlify.toml

### Error 3: Dependencies conflicts

```
npm ERR! ERESOLVE could not resolve
```

**วิธีแก้:**
- ✅ เพิ่ม `NPM_FLAGS = "--legacy-peer-deps"` ใน netlify.toml

### Error 4: Build cache เก่า

```
Module not found
```

**วิธีแก้:**
- Clear cache ใน Netlify
- Deploy ใหม่

---

## 📋 Checklist การแก้ไข

- [ ] Push ไฟล์แก้ไขขึ้น GitHub
  - [ ] `.nvmrc`
  - [ ] `tsconfig.json`
  - [ ] `src/vite-env.d.ts`
  - [ ] `netlify.toml`
- [ ] Clear cache ใน Netlify
- [ ] Trigger deploy ใหม่
- [ ] รอ ~2-3 นาที
- [ ] ตรวจสอบ build log
- [ ] เปิด URL ทดสอบ

---

## 🎯 ถ้ายังไม่ได้

### วิธีที่ 1: ดู Build Log แบบละเอียด

1. เปิด Netlify Dashboard
2. คลิก deployment ที่ล้มเหลว
3. คลิก **Deploy log**
4. Copy error message ทั้งหมด
5. ส่งมาให้ผมดู

### วิธีที่ 2: ทดสอบ Build ในเครื่อง

```bash
# รัน build ในเครื่อง
npm run build

# ถ้าสำเร็จ → ควรเห็น folder dist/
# ถ้า error → แก้ไข error ก่อน push
```

### วิธีที่ 3: ใช้ Vercel แทน

ถ้า Netlify มีปัญหา太多 → ลองใช้ Vercel

1. เปิด https://vercel.com
2. Import project
3. เลือก repo
4. Deploy

---

## 💡 คำแนะนำ

### ไฟล์ที่แก้ไขแล้ว

| ไฟล์ | การแก้ไข |
|------|---------|
| `.nvmrc` | เพิ่ม Node version = 18 |
| `tsconfig.json` | เพิ่ม vite-env.d.ts ใน include |
| `src/vite-env.d.ts` | Type declarations |
| `netlify.toml` | เพิ่ม NPM_FLAGS |

### สิ่งที่ต้องทำ

```bash
# 1. Push ไฟล์แก้ไข
git add .
git commit -m "Fix Netlify build errors"
git push origin main

# 2. Clear cache ใน Netlify
# 3. Trigger deploy ใหม่
# 4. รอ ~2-3 นาที
```

---

## 📞 สรุปสั้นๆ

**ปัญหา:** Build error exit code 2

**วิธีแก้:**
1. ✅ Push ไฟล์แก้ไขขึ้น GitHub (แก้ไขให้แล้ว)
2. Clear cache ใน Netlify
3. Trigger deploy ใหม่

**ไฟล์ที่แก้ไข:**
- `.nvmrc` - Node version
- `tsconfig.json` - TypeScript config
- `src/vite-env.d.ts` - Type declarations
- `netlify.toml` - Netlify config

---

## 🆘 ยังไม่ได้?

### ส่งข้อมูลมาให้ผมดู

1. **Build log ทั้งหมด** (copy จาก Netlify)
2. **Error message** (บรรทัดที่มี ❌ หรือ error)
3. **Node version** (ดูใน build log)

---

**อัปเดต:** 2026  
**สถานะ:** ✅ พร้อมแก้ไข
