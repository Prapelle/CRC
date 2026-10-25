# 📋 ไฟล์ที่จำเป็นสำหรับ Deploy

## ไฟล์ที่ต้องมีใน GitHub Repository

### Root Directory
```
CRC/
├── package.json              ← สำคัญมาก!
├── package-lock.json         ← สำคัญมาก!
├── vite.config.js
├── tsconfig.json
├── index.html
├── vercel.json               ← สำหรับ Vercel
├── netlify.toml              ← สำหรับ Netlify (backup)
├── .gitignore
├── .nvmrc
├── README.md
└── src/                      ← folder
```

### src/ Directory
```
src/
├── App.tsx
├── main.tsx
├── index.css
├── vite-env.d.ts
├── components/
│   ├── Layout.tsx
│   └── shared.tsx
├── contexts/
│   ├── AuthContext.tsx
│   └── DataContext.tsx
├── data/
│   └── store.ts
├── pages/
│   ├── Login.tsx
│   ├── ExecutiveOverview.tsx
│   ├── MarketingPerformance.tsx
│   ├── SocialContent.tsx
│   ├── WebsiteAnalytics.tsx
│   ├── LeadManagement.tsx
│   ├── QuotationManagement.tsx
│   ├── SalesManagement.tsx
│   ├── DataQuality.tsx
│   ├── ExportCenter.tsx
│   └── Settings.tsx
├── services/
│   └── googleSheets.ts
└── types/
    └── index.ts
```

### public/ Directory
```
public/
├── _redirects
└── 404.html
```

---

## 🔍 ตรวจสอบว่าไฟล์ครบไหม

### วิธีที่ 1: ดูบน GitHub

เปิด https://github.com/Prapelle/CRC

ต้องเห็น:
- ✅ `package.json` (คลิกแล้วเห็น JSON)
- ✅ `src/` folder (คลิกแล้วเห็นไฟล์ .tsx)
- ✅ `index.html`

### วิธีที่ 2: ตรวจสอบในเครื่อง

```bash
cd CRC

# ดูรายการไฟล์
ls -la

# ดูไฟล์ใน src/
ls -la src/

# ดูไฟล์ใน public/
ls -la public/
```

---

## 🚨 ถ้าไฟล์หาย

### วิธีที่ 1: Copy จาก Sandbox

1. เปิด sandbox
2. Copy ไฟล์ที่จำเป็น
3. Paste ลงในเครื่อง
4. Push ขึ้น GitHub

### วิธีที่ 2: สร้างไฟล์ใหม่

สร้างไฟล์ `package.json`:

```json
{
  "name": "crc-dashboard",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "recharts": "^2.10.0",
    "lucide-react": "^0.294.0",
    "date-fns": "^2.30.0",
    "uuid": "^9.0.1",
    "framer-motion": "^11.16.1",
    "@supabase/supabase-js": "^2.98.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/uuid": "^9.0.7",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5.7.0",
    "vite": "^6.3.5",
    "tailwindcss": "^4.1.7",
    "@tailwindcss/vite": "^4.1.7"
  }
}
```

สร้างไฟล์ `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

สร้างไฟล์ `vite.config.js`:

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  publicDir: "public",
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
```

สร้างไฟล์ `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "noEmit": true,
    "allowImportingTsExtensions": true
  },
  "include": ["src", "src/vite-env.d.ts"]
}
```

สร้างไฟล์ `index.html`:

```html
<!doctype html>
<html lang="th">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CRC Marketing & Sales Dashboard</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

สร้างไฟล์ `.nvmrc`:

```
22
```

สร้างไฟล์ `.gitignore`:

```
node_modules/
dist/
.env
.env.local
*.log
.DS_Store
```

สร้างไฟล์ `public/_redirects`:

```
/*    /index.html   200
```

---

## 🚀 ขั้นตอนการ Deploy

### ขั้นตอนที่ 1: ตรวจสอบไฟล์

```bash
cd CRC
ls -la
```

ต้องเห็น:
- ✅ package.json
- ✅ src/
- ✅ index.html

### ขั้นตอนที่ 2: Push ขึ้น GitHub

```bash
git add .
git commit -m "Add all project files"
git push origin main
```

### ขั้นตอนที่ 3: Deploy บน Vercel

1. เปิด https://vercel.com
2. Import project
3. เลือก repository
4. Deploy

---

## 📞 สรุป

**ปัญหา:** ไฟล์ไม่ได้ถูก push ขึ้น GitHub

**วิธีแก้:**
1. ตรวจสอบว่ามีไฟล์ครบในเครื่อง
2. Push ขึ้น GitHub
3. Deploy บน Vercel

**ไฟล์ที่สำคัญที่สุด:**
- ✅ `package.json`
- ✅ `src/` folder
- ✅ `index.html`

---

**อัปเดต:** 2026  
**สถานะ:** ✅ พร้อมแก้ไข
