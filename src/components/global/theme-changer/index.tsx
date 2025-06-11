"use client";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";

export const ThemeChanger = () => {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();

  if (!session) return null;

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div suppressHydrationWarning className="fixed top-4 right-8">
      <Button size="icon" className="w-10 h-10" variant="outline" onClick={toggleTheme}>
        {theme === "light" ? <Sun size={20} /> : <Moon size={20} />}
      </Button>
    </div>
  );
};
