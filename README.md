# pdpa-poc-web

หน้าเว็บหลังบ้านของ POC การเข้ารหัสข้อมูลส่วนบุคคลตาม **พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)**
ใช้คู่กับ API: **[pdpa-poc-api](https://github.com/plaisamudcha/pdpa-poc-api)** — หลักการเข้ารหัส (KEK / DEK / Blind index) และ flow ฝั่ง server อธิบายไว้ละเอียดใน README ของ API

- **Stack:** Vite + React 19 + TypeScript + MUI 5 + TanStack Query + react-hook-form + axios
- **โครงสร้างโฟลเดอร์:** ตาม citizen-portal-admin-web
- **หน้าที่มี:** หน้า login, จัดการผู้ใช้ (CRUD + ค้นหา + ส่งออก + ความยินยอม PDPA), เอกสาร PDPA (PDF แบบมีเวอร์ชัน), audit log

---

## เริ่มต้นใช้งาน

ต้องรัน `pdpa-poc-api` ก่อน (port 3041) และสร้างบัญชีพนักงานด้วย `bun run seed-staff` ฝั่ง API

```bash
bun install
cp .env.example .env
bun run dev          # http://localhost:5173
```

| ตัวแปร | ความหมาย |
|---|---|
| `VITE_APP_API_URL` | URL ของ API (ค่าเริ่มต้น `http://localhost:3041/api/v1`) |
| `VITE_APP_PORT` | port ของหน้าเว็บ (ค่าเริ่มต้น 5173) |
| `VITE_APP_BASE_NAME` | base path ของ router |

origin ของหน้าเว็บต้องตรงกับ `ALLOW_ORIGIN` ฝั่ง API ไม่งั้นเบราว์เซอร์จะไม่ส่ง cookie ของ login

---

## หลักการสำคัญฝั่งหน้าเว็บ

> **หน้าเว็บไม่มี key และไม่เคย encrypt/decrypt อะไรเอง** — การเข้ารหัส ถอดรหัส และ mask ทำที่ API ทั้งหมด
> หน้าเว็บได้รับเฉพาะข้อมูลที่ผ่านการตรวจสิทธิ์แล้ว ค่าเต็มจึงไม่ไปอยู่ใน network / cache ของคนที่ไม่มีสิทธิ์

| หลัก | ทำอย่างไร |
|---|---|
| ไม่เก็บ token ในเบราว์เซอร์ | JWT อยู่ใน **httpOnly cookie** ที่ API ตั้ง — JavaScript อ่านไม่ได้ (กัน token หลุดจาก XSS), ไม่ใช้ localStorage |
| role มาจาก server | `GET /auth/me` บอกว่าใคร login และ role อะไร — UI ใช้แค่ปิดปุ่ม ส่วนการบังคับสิทธิ์จริงอยู่ที่ API |
| แสดงแบบ mask เป็นค่าเริ่มต้น | ตารางแสดงค่า mask เสมอ ดูค่าเต็มต้องเปิดทีละคน + ระบุเหตุผล (บันทึกใน audit log) |
| ไม่ถอดรหัสโดยไม่จำเป็น | ฟอร์มแก้ไขไม่ดึงค่าจริงมาแสดง — กรอกเฉพาะช่องที่จะแก้ (data minimization) |
| ล้าง cache เมื่อเปลี่ยนคน | login / logout / session หมดอายุ → `queryClient.clear()` ไม่ให้ข้อมูลของคนก่อนค้างให้คนถัดไปเห็น |

---

## Flow การ login

```
เปิดเว็บ
 └─ AuthProvider → GET /auth/me (ส่ง cookie อัตโนมัติ)
      ├─ 200 → เก็บ user { username, displayName, role } ใน context
      └─ 401 → user = null
AuthGuard: ยังไม่ login → /login (จำหน้าที่จะกลับมา)
GuestGuard: login แล้วเข้า /login → /admin/users

หน้า /login → POST /auth/login
 ├─ สำเร็จ → API ตั้ง httpOnly cookie → queryClient.clear() → กลับหน้าที่ตั้งใจจะไป
 └─ ไม่สำเร็จ → แสดง "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" / "บัญชีถูกล็อกชั่วคราว..." และล้างช่องรหัสผ่าน

ระหว่างใช้งาน: API ตอบ 401 (หมดอายุ / ถูกเพิกถอน / ปิดบัญชี)
 └─ axios interceptor ยิง event "pdpa-poc:session-expired" → AuthContext ล้าง user + cache → AuthGuard พากลับ /login

ออกจากระบบ → POST /auth/logout (API ลบ cookie + เพิกถอน token ทุกตัวของบัญชี) → ล้าง user + cache
```

### Role

| สิทธิ์ | support | admin | dpo |
|---|---|---|---|
| ดูรายการ (mask) | ✅ | ✅ | ✅ |
| เปิดดูข้อมูลเต็ม | ❌ | ✅ ยกเว้นข้อมูลสุขภาพ | ✅ |
| เพิ่มผู้ใช้ | ✅ | ✅ | ✅ |
| แก้ไข (ม.35) | ❌ | ✅ | ✅ |
| ส่งออก JSON (ม.30, 31) | ❌ | ❌ | ✅ |
| ลบ (ม.33) | ❌ | ❌ | ✅ |
| บันทึกยอมรับ / ถอนความยินยอม | ✅ | ✅ | ✅ |
| อัปโหลดเอกสาร PDPA | ❌ | ❌ | ✅ |

ปุ่มที่ไม่มีสิทธิ์จะเป็นสีเทาพร้อม tooltip "(ไม่มีสิทธิ์)" — ตาราง `ROLE_POLICY` ใน `src/constants/pdpa.ts` ต้องตรงกับฝั่ง API

---

## Flow CRUD ของผู้ใช้ (หน้า `/admin/users`)

### รายการ + ค้นหา

```
useListUserTable: state { search, page, pageSize }
 → useGetUsersQuery  queryKey ['GET_LIST_USERS', role, search, page, pageSize]
 → GET /user?search=&page=&pageSize=
 → ตารางแสดงค่าที่ API mask มาแล้ว + TablePagination (ข้อมูลถูก decrypt ทีละหน้าที่ server)
```

**ค้นหาได้ด้วย** (ข้อมูลถูกเข้ารหัส ค้นผ่าน blind index ที่ API):

| พิมพ์ | ตัวอย่าง | ค้นจาก |
|---|---|---|
| อีเมลเต็ม | `somchai@example.com` | อีเมลตรงตัว |
| เลขบัตร 13 หลัก | `1-1037-00123-45-8` | เลขบัตรตรงตัว |
| ตัวเลข 4 หลัก | `5678` | 4 ตัวท้ายเบอร์โทร หรือเลขบัตร |
| ข้อความ 3 ตัวขึ้นไป | `สมช`, `john`, `som` | ชื่อ / นามสกุล / อีเมล **ขึ้นต้นด้วย** (ใช้ 5 ตัวแรกของคำค้น) |

ค้นกลางคำไม่ได้ (เช่น `ชาย` ไม่เจอ `สมชาย`) — ตั้งใจ เพื่อไม่ให้ blind index รั่วรูปแบบข้อมูลมากเกินไป

### เพิ่ม — `UserFormModal` (mode create)

```
กรอกฟอร์ม → validate ฝั่งเว็บ (อีเมล, checksum เลขบัตรไทย, เบอร์โทร)
 → POST /user (ส่งเฉพาะช่องที่กรอก) → API encrypt ทุก field ก่อนบันทึก
 → 409 อีเมล/เลขบัตรซ้ำ → แสดงข้อความ / สำเร็จ → invalidate รายการ
```

### ดูรายละเอียด / เปิดดูข้อมูลเต็ม — `UserDetailModal`

```
เปิด modal → แสดงค่าแบบ mask จากตาราง
 → (admin, dpo) กรอกเหตุผล → "เปิดดูข้อมูลเต็ม"
 → GET /user/:id?reveal=true&reason=...  (เป็น mutation — ไม่ cache, บันทึก audit ทุกครั้ง)
 → แสดงค่าเต็ม + chip "ถอดรหัสแล้ว" เฉพาะ field ที่ role มีสิทธิ์
```

### แก้ไข — `UserFormModal` (mode edit)

```
ฟอร์มว่าง + placeholder เป็นค่า mask (ไม่ดึงค่าจริงมา)
 → กรอกเฉพาะช่องที่ต้องการแก้ (ช่องว่าง = ไม่เปลี่ยน)
 → PUT /user/:id ส่งเฉพาะช่องที่กรอก → invalidate รายการ + รายละเอียด
```

### ลบ — `DeleteUserModal` (dpo)

```
ต้องกรอกเหตุผล → เตือนว่าย้อนกลับไม่ได้
 → DELETE /user/:id { reason } → API ทำลาย key ของผู้ใช้ (crypto-shredding)
 → ข้อมูลทุกที่รวม backup ถอดรหัสไม่ได้อีก → invalidate รายการ
```

### ส่งออก (dpo)

`GET /user/:id/export` → ดาวน์โหลด `user-<id>.json` (สิทธิขอรับสำเนา / โอนย้ายข้อมูล)

---

## ความยินยอม PDPA + เอกสารแบบมีเวอร์ชัน

### หน้าเอกสาร PDPA (`/admin/consent-documents`)

ทุก role เปิดดูได้ (ใช้เปิดให้เจ้าของข้อมูลอ่าน) — อัปโหลดได้เฉพาะ dpo

```
"อัปโหลดเวอร์ชันใหม่" → UploadConsentDocumentModal: ชื่อเอกสาร, สรุปสิ่งที่เปลี่ยน, ไฟล์ PDF (≤ 10 MB)
 → POST /consent-document?title=&note=&fileName=  body = ไฟล์ (Content-Type: application/pdf)
 → API ตั้งเลขเวอร์ชัน = ล่าสุด + 1 เอง (หน้าเว็บแค่แสดงว่า "จะเป็นเวอร์ชัน N")
 → invalidate รายการเอกสาร + รายการผู้ใช้ (สถานะของคนที่ยอมรับเวอร์ชันเก่าเปลี่ยนเป็น "ต้องยอมรับใหม่")
```

ไฟล์ PDF ดึงผ่าน `GET /consent-document/:version/file` (ส่ง cookie) แล้วแสดงใน `PdfViewerDialog` เป็น blob URL — cache ต่อเวอร์ชันได้ตลอดเพราะไฟล์ไม่เปลี่ยน

### ยอมรับตอนเพิ่มผู้ใช้

```
UserFormModal (create) → GET /consent-document/latest
 ├─ มีเอกสาร → ConsentAcceptBox: "เปิดอ่านเอกสาร" (ต้องเปิดก่อนถึงติ๊กได้) → ติ๊กยอมรับ → ปุ่มบันทึกถึงกดได้
 │   → POST /user { ...pii, consentVersion: N }
 │   → 409 มีเวอร์ชันใหม่ระหว่างกรอก → ดึงเวอร์ชันล่าสุดใหม่ ช่องติ๊กถูกล้าง ต้องเปิดอ่านใหม่
 └─ ยังไม่มีเอกสาร → แจ้งเตือน และบันทึกได้โดยไม่มีการยอมรับ
```

### ความยินยอมของผู้ใช้แต่ละคน — `UserConsentModal`

เปิดจากคอลัมน์ "PDPA" (chip สถานะ) หรือไอคอน ✓ ในตาราง → `GET /user/:id/consent`

| สถานะ | chip | ทำอะไรได้ |
|---|---|---|
| `accepted` | ยอมรับแล้ว v3 | ถอนความยินยอม (ต้องระบุเหตุผล) |
| `outdated` | ต้องยอมรับใหม่ v2 → v3 | เปิดอ่าน v3 แล้วบันทึกการยอมรับ / ถอน |
| `withdrawn` | ถอนความยินยอม v3 | บันทึกการยอมรับเวอร์ชันล่าสุดใหม่ |
| `none` | ยังไม่ยอมรับ | บันทึกการยอมรับ |

- บันทึกยอมรับส่ง `version` ที่เปิดให้อ่าน → ถ้ามีเวอร์ชันใหม่ระหว่างนั้น API ตอบ 409 และ modal ดึงข้อมูลใหม่
- ตารางประวัติ: วันที่ / ยอมรับ-ถอน / เวอร์ชัน (คลิกเปิด PDF ของเวอร์ชันนั้น) / staff ที่บันทึก / เหตุผล
- การถอนไม่ลบข้อมูล — ถ้าต้องการลบให้ใช้ปุ่มลบ (ม.33) แยกต่างหาก

---

## หน้า Audit log (`/admin/audit-logs`, dpo เท่านั้น)

เมนู "Audit log" แสดงเฉพาะ role ที่มีสิทธิ์ `audit` — พิมพ์ URL ตรงก็ถูก `PermissionGuard` พากลับ และ API ตอบ 403 อีกชั้น

```
useListAuditLogTable: ฟอร์มตัวกรอง → กด "ค้นหา" → useGetAuditLogsQuery
 → GET /audit-log?action=&result=&username=&subjectId=&from=&to=&page=&pageSize=
 → ตาราง: เวลา / ผู้ทำรายการ / การกระทำ / ผลลัพธ์ / รหัสผู้ใช้ / field ที่ถอดรหัสหรือแก้ไข / เหตุผล
```

- **ตัวกรอง:** การกระทำ, ผลลัพธ์ (สำเร็จ / ถูกปฏิเสธ / ไม่พบ), username พนักงาน, รหัสผู้ใช้, ช่วงวันที่
- **คลิก username** → ดูทุกอย่างที่พนักงานคนนั้นทำ / **คลิกรหัสผู้ใช้** → ดูทุกคนที่เข้าถึงข้อมูลของผู้ใช้คนนั้น
- จากหน้ารายละเอียดผู้ใช้ dpo กด "ดูประวัติการเข้าถึง" → เปิด `/admin/audit-logs?subjectId=<id>`
- log ไม่มี PII ของผู้ใช้ — แสดงแค่รหัสอ้างอิงและชื่อ field (`healthNote` ไฮไลต์สีส้มเพราะเป็นข้อมูลอ่อนไหว)
- ชื่อพนักงาน API เติมให้ตอนแสดงจาก `staffs` — login ด้วย username ที่ไม่มีจริงแสดงเป็น "ไม่ทราบตัวตน", job ลบอัตโนมัติแสดงเป็น "ระบบ"

---

## โครงสร้างโฟลเดอร์

```
src/
├── App.tsx  index.tsx           Theme → AuthProvider → Snackbar → Router (+ QueryClientProvider)
├── config.ts                    API_URL, page size, ชื่อ event session หมดอายุ
├── constants/pdpa.ts            label ของ field, ROLE_POLICY (ต้องตรงกับ API)
├── contexts/
│   ├── AuthContext.tsx          สถานะ login, login/logout, ฟัง event session หมดอายุ
│   └── SnackbarContext.tsx
├── hooks/                       useAuth, useSnackbar
├── routes/
│   ├── index.tsx                /login, /admin/users, /admin/consent-documents, /admin/audit-logs
│   └── route-guard/             AuthGuard, GuestGuard, PermissionGuard (ซ่อนหน้าตามสิทธิ์)
├── layout/MainLayout/           แถบบน: เมนู (ตามสิทธิ์), ชื่อ, role, ออกจากระบบ
├── pages/
│   ├── Auth/                    Login.tsx + useLogin.tsx
│   ├── Admin/AuditLog/          AuditLogTable.tsx + useListAuditLogTable.tsx (dpo)
│   ├── Admin/ConsentDocument/   ConsentDocumentTable.tsx + UploadConsentDocumentModal (อัปโหลด dpo)
│   └── Admin/User/              UserTable.tsx + useListUserTable.tsx
│       ├── component/           UserFormModal, UserDetailModal, DeleteUserModal, UserConsentModal
│       └── type/
├── components/ProductComponent/
│   ├── User/UserForm/           ฟอร์มผู้ใช้ + useUserForm (+ ยอมรับเอกสาร PDPA ตอนสร้าง)
│   └── Consent/                 PdfViewerDialog, ConsentAcceptBox, ConsentStatusChip
├── services/
│   ├── api/                     axios (withCredentials + 401 interceptor), auth, user, auditLog, consent
│   └── queries/                 TanStack Query hooks, queryClient (retry: false)
├── types/products/              auth, user, auditLog, consent
├── themes/                      MUI theme (ฟอนต์ Sarabun)
└── utils/                       validators (checksum เลขบัตรไทย), downloadJson
```

---

## ข้อจำกัด / ก่อนขึ้น production

- เมื่อ deploy บน HTTPS ฝั่ง API ต้องตั้ง `COOKIE_SECURE=true` และถ้าหน้าเว็บกับ API อยู่คนละ site ต้องพิจารณา CSRF token
- ยังไม่มีหน้าจัดการบัญชีพนักงาน / เปลี่ยนรหัสผ่าน
- แก้ไขลบค่า field ให้ว่างไม่ได้ (ช่องว่าง = ไม่เปลี่ยน)
- `ROLE_POLICY` ฝั่งเว็บเป็นแค่การปิดปุ่ม — ถ้าแก้สิทธิ์ต้องแก้ที่ API เป็นหลัก
