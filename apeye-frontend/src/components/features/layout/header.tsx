'use client';

import { Menu, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSession, signOut } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
    router.push('/login');
  };

  const userPlan = (session?.user as any)?.plan || 'free';

  return (
    <header className="h-14 border-b flex items-center justify-between px-2 sm:px-4 bg-card">
      <div className="flex items-center gap-2 sm:gap-3">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-lg sm:text-xl font-dm-sans tracking-tight font-bold">
          <a href="/">APEye</a>
        </h1>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <div className="text-sm mr-1 sm:mr-2 hidden sm:block">
          <span className="text-muted-foreground">Plan: </span>
          <span className="font-medium capitalize text-primary">{userPlan}</span>
        </div>

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              {session?.user?.image ? (
                <img 
                  src={session.user.image} 
                  alt={session.user.name || 'User'} 
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <User className="h-5 w-5" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{session?.user?.name || 'User'}</span>
                <span className="text-xs text-muted-foreground">{session?.user?.email}</span>
                <span className="text-xs text-muted-foreground sm:hidden mt-1">Plan: <span className="capitalize text-primary">{userPlan}</span></span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}