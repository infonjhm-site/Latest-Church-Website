import { UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MobileNav } from "./mobile-nav";

export function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-4">
        <MobileNav />
      </div>
      <div className="flex items-center gap-4">
        <a 
          href="/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hidden sm:flex inline-flex shrink-0 items-center justify-center rounded-lg border border-border bg-background hover:bg-muted hover:text-foreground text-sm font-medium h-7 gap-1 px-2.5"
        >
          View Live Site
        </a>
        <Button variant="ghost" size="icon" className="rounded-full">
          <UserCircle className="h-7 w-7 text-muted-foreground" />
          <span className="sr-only">User Menu</span>
        </Button>
      </div>
    </header>
  );
}
