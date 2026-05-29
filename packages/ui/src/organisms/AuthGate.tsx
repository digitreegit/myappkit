import { useEffect, useState } from "react";
import { Button } from "../atoms/Button";
import { Text } from "../atoms/Text";
import { LoadingState } from "../molecules/LoadingState";
import { AuthForm, type AuthFormValues } from "./AuthForm";

interface SessionUser {
  id: string;
  email?: string;
}

/**
 * AuthGate 가 요구하는 최소 인터페이스. @skyface/api 의 createAuth() 결과가
 * 구조적으로 이 모양에 맞으므로 그대로 주입하면 됩니다. (ui ↔ api 비결합)
 */
export interface AuthAdapter {
  getUser(): Promise<{ data: { user: SessionUser | null } }>;
  onAuthStateChange(
    cb: (event: string, session: { user: SessionUser | null } | null) => void | Promise<void>,
  ): () => void;
  signInWithPassword(
    email: string,
    password: string,
  ): Promise<{ error: { message: string } | null }>;
  signUp(
    email: string,
    password: string,
  ): Promise<{ data: { session: unknown | null }; error: { message: string } | null }>;
  signOut(): Promise<unknown>;
}

export interface AuthGateProps {
  auth: AuthAdapter;
  /** 로그인된 경우 렌더. user 와 signOut 을 내려줍니다. */
  children: (ctx: { user: SessionUser; signOut: () => Promise<void> }) => React.ReactNode;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** 이메일/비밀번호 로그인 게이트. 미인증이면 AuthForm, 인증되면 children 을 렌더. */
export function AuthGate({ auth, children }: AuthGateProps) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof AuthFormValues, string>>>({});
  const [notice, setNotice] = useState<string>();

  useEffect(() => {
    let active = true;
    auth.getUser().then(({ data }) => {
      if (!active) return;
      setUser(data.user);
      setLoading(false);
    });
    const unsubscribe = auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, [auth]);

  function validate({ email, password }: AuthFormValues) {
    const next: Partial<Record<keyof AuthFormValues, string>> = {};
    if (!EMAIL_RE.test(email)) next.email = "올바른 이메일을 입력하세요.";
    if (password.length < 6) next.password = "비밀번호는 6자 이상이어야 합니다.";
    return next;
  }

  async function handleSubmit(values: AuthFormValues) {
    setNotice(undefined);
    const v = validate(values);
    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      if (mode === "signup") {
        const { data, error } = await auth.signUp(values.email, values.password);
        if (error) {
          setErrors({ email: error.message });
        } else if (!data.session) {
          setMode("login");
          setNotice("확인 메일을 보냈어요. 메일의 링크를 클릭한 뒤 로그인하세요.");
        }
      } else {
        const { error } = await auth.signInWithPassword(values.email, values.password);
        if (error) {
          setErrors({ password: "이메일/비밀번호가 틀렸거나 메일 인증이 필요합니다." });
        }
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function signOut() {
    await auth.signOut();
    setUser(null);
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <LoadingState message="세션을 확인하는 중…" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
        <AuthForm
          mode={mode}
          isLoading={submitting}
          errors={errors}
          onSubmit={handleSubmit}
          footer={
            <div className="flex flex-col gap-2 text-center">
              {notice && (
                <Text variant="caption" className="text-success">
                  {notice}
                </Text>
              )}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setErrors({});
                  setNotice(undefined);
                  setMode((m) => (m === "login" ? "signup" : "login"));
                }}
              >
                {mode === "login" ? "계정이 없으신가요? 회원가입" : "이미 계정이 있으신가요? 로그인"}
              </Button>
            </div>
          }
        />
      </div>
    );
  }

  return <>{children({ user, signOut })}</>;
}
