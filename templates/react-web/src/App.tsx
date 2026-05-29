import { useState } from "react";
import { AuthForm, Badge, Button, Text, type AuthFormValues } from "@skyface/ui";
import { useToggle } from "@skyface/hooks";
import { loginSchema, formatZodErrors } from "@skyface/utils";

export function App() {
  const [dark, { toggle }] = useToggle(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(values: AuthFormValues) {
    const parsed = loginSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(formatZodErrors(parsed.error));
      return;
    }
    setErrors({});
    alert(`로그인 시도: ${values.email}`);
  }

  return (
    <div className={dark ? "dark" : ""}>
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-6">
        <div className="flex items-center gap-3">
          <Text variant="h1">Skyface App</Text>
          <Badge tone="primary">starter</Badge>
        </div>
        <Text variant="caption">@skyface/* 라이브러리로 만든 데모 화면입니다.</Text>

        <AuthForm mode="login" errors={errors} onSubmit={handleSubmit} />

        <Button variant="ghost" size="sm" onClick={toggle}>
          {dark ? "☀️ 라이트" : "🌙 다크"} 모드
        </Button>
      </main>
    </div>
  );
}
