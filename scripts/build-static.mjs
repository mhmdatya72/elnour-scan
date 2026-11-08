// بناء نسخة ثابتة في out/ للاستضافة العادية (Hostinger public_html).
// بيشيل مجلد src/app/api مؤقتًا لأن التصدير الثابت ما بيدعمش استقبال POST،
// وبيرجّعه دايمًا في الآخر، حتى لو البناء فشل.
import { spawnSync } from "node:child_process";
import { existsSync, renameSync, rmSync } from "node:fs";

const api = "src/app/api";
const parked = "src/.api-parked";

if (existsSync(parked)) {
  console.error(`${parked} موجود من بناء سابق اتقطع. رجّعه لـ ${api} يدويًا الأول.`);
  process.exit(1);
}

const hadApi = existsSync(api);
if (hadApi) renameSync(api, parked);

// أنواع المسارات اللي next dev ولّدها قبل كده بتشاور على /api، فبتوقف فحص الأنواع.
// دي ملفات مولّدة بس، وبتتعمل من تاني مع أي next dev أو next build عادي.
rmSync(".next/dev/types", { recursive: true, force: true });
rmSync(".next/types", { recursive: true, force: true });

let status = 1;
try {
  const result = spawnSync("npx", ["next", "build"], {
    stdio: "inherit",
    shell: true,
    env: { ...process.env, STATIC_EXPORT: "1" },
  });
  status = result.status ?? 1;
} finally {
  if (hadApi) renameSync(parked, api);
}
process.exit(status);
