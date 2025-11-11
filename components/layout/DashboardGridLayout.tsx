"use client";

import { ReactNode } from "react";

interface DashboardGridLayoutProps {
  children: ReactNode;
}

export function DashboardGridLayout({ children }: DashboardGridLayoutProps) {
  return <div className="dashboard-grid">{children}</div>;
}

