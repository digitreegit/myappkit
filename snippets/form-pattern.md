# 패턴: 폼 (검증 + 에러 표시)

`@skyface/ui`(FormField) + `@skyface/utils`(zod) 표준 폼 패턴.

## 재사용 가능한 폼 훅

```tsx
import { useState } from "react";
import { z } from "@skyface/utils";
import { formatZodErrors } from "@skyface/utils";

export function useZodForm<T extends z.ZodTypeAny>(schema: T, initial: z.infer<T>) {
  const [values, setValues] = useState<z.infer<T>>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const field = (name: keyof z.infer<T>) => ({
    value: (values as any)[name] ?? "",
    error: errors[name as string],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setValues((v) => ({ ...v, [name]: e.target.value })),
  });

  function validate(): z.infer<T> | null {
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      setErrors(formatZodErrors(parsed.error));
      return null;
    }
    setErrors({});
    return parsed.data;
  }

  return { values, errors, field, validate, setValues };
}
```

## 사용

```tsx
import { FormField, Button } from "@skyface/ui";
import { signupSchema } from "@skyface/utils";

function SignupForm() {
  const form = useZodForm(signupSchema, { email: "", password: "", confirmPassword: "" });

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        const data = form.validate();
        if (data) console.log("submit", data);
      }}
    >
      <FormField label="이메일" type="email" {...form.field("email")} />
      <FormField label="비밀번호" type="password" {...form.field("password")} />
      <FormField label="비밀번호 확인" type="password" {...form.field("confirmPassword")} />
      <Button type="submit" fullWidth>가입</Button>
    </form>
  );
}
```

## 규칙
- 검증 스키마는 `@skyface/utils` 에 모아 서버/클라이언트 공유.
- 에러는 항상 `formatZodErrors` 로 `{ field: message }` 형태 변환 후 FormField 에 전달.
