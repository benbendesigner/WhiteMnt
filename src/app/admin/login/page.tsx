"use client";

import { useActionState } from "react";
import { loginAction } from "@/actions/auth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SITE_NAME } from "@/lib/constants";

const initial: { error?: string } = {};

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, initial);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">{SITE_NAME}</CardTitle>
          <p className="text-sm text-muted-foreground">Admin sign in</p>
        </CardHeader>
        <CardContent>
          {state.error && (
            <p className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {state.error}
            </p>
          )}
          <form action={action} className="space-y-4">
            <Input
              label="Email"
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
            />
            <Input
              label="Password"
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
            <Button type="submit" disabled={pending} className="w-full">
              {pending ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
