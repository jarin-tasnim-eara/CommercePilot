import { Suspense } from "react";
import { Rocket } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";
import Card from "@/components/ui/Card";

export const metadata = {
  title: "Sign in — CommercePilot",
};

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="mb-6 flex flex-col items-center gap-2 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500">
          <Rocket className="h-5 w-5 text-white" />
        </div>
        <h1 className="text-lg font-semibold text-ink-900">CommercePilot</h1>
        <p className="text-sm text-ink-500">
          Sign in to manage your store operations
        </p>
      </div>

      <Card className="p-6">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </Card>
    </div>
  );
}