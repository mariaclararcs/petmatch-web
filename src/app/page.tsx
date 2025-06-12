"use client"

import LoginForm from "@/components/login-form"

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center bg-background">
      <div className="w-full">
        <LoginForm />
      </div>
    </div>
  )
}
