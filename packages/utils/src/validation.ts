import { z } from "zod";

/** 자주 쓰는 필드 스키마 모음. 폼/서버 양쪽에서 재사용. */
export const fields = {
  email: z.string().email("올바른 이메일을 입력하세요."),
  password: z
    .string()
    .min(8, "비밀번호는 8자 이상이어야 합니다.")
    .regex(/[A-Za-z]/, "영문을 포함해야 합니다.")
    .regex(/[0-9]/, "숫자를 포함해야 합니다."),
  nonEmpty: z.string().trim().min(1, "필수 입력 항목입니다."),
  phoneKR: z.string().regex(/^01[0-9]-?\d{3,4}-?\d{4}$/, "올바른 휴대폰 번호를 입력하세요."),
};

export const loginSchema = z.object({
  email: fields.email,
  password: z.string().min(1, "비밀번호를 입력하세요."),
});

export const signupSchema = z
  .object({
    email: fields.email,
    password: fields.password,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;

/** 단순 이메일 형식 검증 (zod 없이 boolean 만 필요할 때). */
export function validateEmail(email: string): boolean {
  return fields.email.safeParse(email).success;
}

/** zod 에러를 { field: message } 형태로 변환 (폼에 바로 매핑). */
export function formatZodErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export { z };
