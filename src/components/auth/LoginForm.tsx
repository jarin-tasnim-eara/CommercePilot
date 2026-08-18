"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { loginSchema, LoginFormValues } from "@/lib/validators/authSchema";
import { findUserByCredentials } from "@/lib/utils/auth";
import { setSessionCookie } from "@/lib/utils/session";
import { useAppDispatch } from "@/lib/redux/hooks";
import { loginSuccess } from "@/lib/redux/slices/authSlice";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: true },
  });

  function onSubmit(values: LoginFormValues) {
    setFormError(null);
    const user = findUserByCredentials(values.email, values.password);

    if (!user) {
      setFormError("Incorrect email or password.");
      return;
    }

    dispatch(loginSuccess(user));
    setSessionCookie(user.role, values.rememberMe);

    const next = searchParams.get("next");
    router.push(next && next !== "/login" ? next : "/dashboard");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Email"
        type="email"
        placeholder="admin@commercepilot.test"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register("password")}
      />

      <label className="flex items-center gap-2 text-sm text-ink-700">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-ink-300 text-brand-500 focus:ring-brand-500"
          {...register("rememberMe")}
        />
        Remember me
      </label>

      {formError && (
        <p role="alert" className="text-sm text-danger-500">
          {formError}
        </p>
      )}

      <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
        Sign in
      </Button>

      <div className="mt-2 rounded-lg bg-ink-50 px-3 py-2.5 text-xs text-ink-500">
        <p className="font-medium text-ink-700">Demo accounts</p>
        <p>admin@commercepilot.test / admin123</p>
        <p>staff@commercepilot.test / staff123</p>
      </div>
    </form>
  );
}