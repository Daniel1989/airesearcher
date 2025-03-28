'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Users, MessageSquare, Home } from 'lucide-react';

const navigation = [
  {
    name: 'Home',
    href: '/',
    icon: Home,
  },
  {
    name: 'Agents',
    href: '/agents/manage',
    icon: Users,
  },
  {
    name: 'Roundtable',
    href: '/roundtable',
    icon: MessageSquare,
  }
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6 ml-4 mt-4">
      {navigation.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link key={item.name} href={item.href}>
            <Button
              variant={isActive ? 'default' : 'ghost'}
              className={cn(
                'flex items-center gap-2',
                isActive && 'bg-primary text-primary-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Button>
          </Link>
        );
      })}
    </nav>
  );
} 