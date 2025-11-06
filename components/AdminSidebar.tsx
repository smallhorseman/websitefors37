"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Image,
  Settings,
  Calendar,
  MessageSquare,
  ChevronDown,
  Menu,
  X,
  Camera,
  LogOut,
  User,
  Shield,
  Brain,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    content: false,
    gallery: false,
  });
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;

    "use client";

    // Deprecated stub: AdminSidebar is no longer used. This component intentionally renders nothing.
    // Kept as a no-op to avoid import errors if any stale references exist.
    export default function AdminSidebar() {
      return null;
    }

