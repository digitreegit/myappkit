# @skyface/utils

순수 함수 유틸 모음. UI/프레임워크 의존성 없음.

```ts
import { formatCurrency, formatRelativeTime, loginSchema, formatZodErrors, tryCatch } from "@skyface/utils";

formatCurrency(12000);              // "₩12,000"
formatRelativeTime(Date.now() - 60000); // "1분 전"

const parsed = loginSchema.safeParse(values);
if (!parsed.success) setErrors(formatZodErrors(parsed.error));

const [err, data] = await tryCatch(fetchSomething());
```

- `format.ts` — currency / number / date / relative time / mask
- `validation.ts` — zod 스키마 (login/signup) + 에러 변환
- `helpers.ts` — sleep, clamp, groupBy, pick/omit, isEmpty, uuid, tryCatch
