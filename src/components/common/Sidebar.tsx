// src/components/common/Sidebar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks/useRedux';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  AlertTriangle,
  Activity,
  Settings,
  Users,
  Tag,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  ClipboardList,
  Truck,
  BarChart3,
  LogOut
} from 'lucide-react';

interface MenuItem {
  name: string;
  href: string;
  icon: any;
  roles?: ('ADMIN' | 'MANAGER' | 'VIEWER')[];
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['ADMIN', 'MANAGER', 'VIEWER'],
  },
  {
    name: 'Products',
    href: '/product',
    icon: Package,
    roles: ['ADMIN', 'MANAGER', 'VIEWER'],
  },
  {
    name: 'Categories',
    href: '/category',
    icon: Tag,
    roles: ['ADMIN', 'MANAGER', 'VIEWER'],
  },
  {
    name: 'Orders',
    href: '/order',
    icon: ShoppingCart,
    roles: ['ADMIN', 'MANAGER', 'VIEWER'],
    children: [
      { name: 'All Orders', href: '/orders', icon: ClipboardList },
      { name: 'Create Order', href: '/orders/create', icon: ShoppingCart },
      { name: 'Pending Orders', href: '/orders?status=pending', icon: Truck },
    ],
  },
  {
    name: 'Restock Queue',
    href: '/restock-queue',
    icon: AlertTriangle,
    roles: ['ADMIN', 'MANAGER', 'VIEWER'],
  },
  {
    name: 'Activity Log',
    href: '/activity-log',
    icon: Activity,
    roles: ['ADMIN', 'MANAGER', 'VIEWER'],
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    roles: ['ADMIN', 'MANAGER', 'VIEWER'],
  },
  {
    name: 'Users',
    href: '/users',
    icon: Users,
    roles: ['ADMIN'],
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: ['ADMIN', 'MANAGER'],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAppSelector((state) => state.auth);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  // Load sidebar state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebar-collapsed');
    if (savedState !== null) {
      setIsCollapsed(JSON.parse(savedState));
    }
  }, []);

  // Save sidebar state
  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', JSON.stringify(newState));
  };

  const toggleMenu = (menuName: string) => {
    setExpandedMenus(prev =>
      prev.includes(menuName)
        ? prev.filter(m => m !== menuName)
        : [...prev, menuName]
    );
  };

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => {
    if (!item.roles) return true;
    return item.roles.includes(user?.role || 'VIEWER');
  });

  const isActive = (href: string) => {
    if (href === '/dashboard' && pathname === '/dashboard') return true;
    if (href !== '/dashboard' && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <aside
      className={`bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo Section */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">IMS</span>
            </div>
            <span className="font-bold text-lg">InventoryMS</span>
          </div>
        )}
        {isCollapsed && (
          <div className="h-8 w-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-lg">I</span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-lg hover:bg-gray-700 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {filteredMenuItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedMenus.includes(item.name);
            const active = isActive(item.href);

            return (
              <li key={item.name}>
                {hasChildren ? (
                  <>
                    <button
                      onClick={() => toggleMenu(item.name)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                        active
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className="h-5 w-5" />
                        {!isCollapsed && <span>{item.name}</span>}
                      </div>
                      {!isCollapsed && (
                        <ChevronRight
                          className={`h-4 w-4 transition-transform ${
                            isExpanded ? 'rotate-90' : ''
                          }`}
                        />
                      )}
                    </button>
                    
                    {!isCollapsed && isExpanded && (
                      <ul className="mt-1 ml-8 space-y-1">
                        {item.children?.map((child) => (
                          <li key={child.name}>
                            <Link
                              href={child.href}
                              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                                pathname === child.href
                                  ? 'bg-primary-600 text-white'
                                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                              }`}
                            >
                              <child.icon className="h-4 w-4" />
                              <span className="text-sm">{child.name}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      active
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Section - User Info */}
      <div className="border-t border-gray-700 p-4">
        {!isCollapsed ? (
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
              <span className="text-white font-medium">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {user?.role || 'Viewer'}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
              <span className="text-white font-medium">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}