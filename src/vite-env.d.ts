/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_SHEETS_API_URL: string
  readonly VITE_GOOGLE_SHEET_ID: string
  readonly VITE_ENABLE_GOOGLE_SHEETS_SYNC: string
  readonly VITE_SYNC_INTERVAL: string
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
