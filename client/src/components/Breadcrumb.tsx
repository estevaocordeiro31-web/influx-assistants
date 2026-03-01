import { Link } from 'wouter';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
      {/* Home */}
      <Link href="/" className="flex items-center gap-1 hover:text-foreground transition-colors">
        <Home className="w-4 h-4" />
        <span>Home</span>
      </Link>

      {/* Breadcrumb items */}
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1">
          <ChevronRight className="w-4 h-4 text-border" />
          {item.current ? (
            <span className="text-foreground font-medium">{item.label}</span>
          ) : item.href ? (
            <Link href={item.href} className="hover:text-foreground transition-colors">
              {item.label}
            </Link>
          ) : (
            <span>{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
