import { useState } from "react";
import { Button } from "../atoms/Button";
import { Text } from "../atoms/Text";
import { FormField } from "../molecules/FormField";
import { Card, CardBody, CardHeader } from "../molecules/Card";

export interface AuthFormValues {
  email: string;
  password: string;
}

export interface AuthFormProps {
  mode?: "login" | "signup";
  isLoading?: boolean;
  errors?: Partial<Record<keyof AuthFormValues, string>>;
  onSubmit: (values: AuthFormValues) => void;
  footer?: React.ReactNode;
}

/**
 * 로그인/회원가입 폼 organism.
 * 검증 로직은 호출 측에서(@skyface/utils 의 loginSchema 등) 수행하고 errors 로 내려주세요.
 */
export function AuthForm({
  mode = "login",
  isLoading,
  errors = {},
  onSubmit,
  footer,
}: AuthFormProps) {
  const [values, setValues] = useState<AuthFormValues>({ email: "", password: "" });
  const title = mode === "login" ? "로그인" : "회원가입";

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <Text variant="h2">{title}</Text>
        <Text variant="caption">계정 정보를 입력하세요.</Text>
      </CardHeader>
      <CardBody>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(values);
          }}
        >
          <FormField
            label="이메일"
            type="email"
            autoComplete="email"
            value={values.email}
            error={errors.email}
            onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          />
          <FormField
            label="비밀번호"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            value={values.password}
            error={errors.password}
            onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
          />
          <Button type="submit" fullWidth isLoading={isLoading}>
            {title}
          </Button>
          {footer}
        </form>
      </CardBody>
    </Card>
  );
}
