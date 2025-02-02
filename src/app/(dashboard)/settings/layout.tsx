"use client";

import {
  IconNotification,
  IconPalette,
  IconTool,
  IconUser,
} from "@tabler/icons-react";

import { Layout } from "@/components/custom/layout";
import { Separator } from "@/components/ui/separator";
import PageContainer from "@/components/layouts/page-container";
import SidebarNav from "./_components/sidebar-nav";
import { useEffect, useState } from "react";
import { User } from "@/db/schema";
import axios from "axios";
import Loader from "@/components/custom/loader";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);

  const handleGetUser = async () => {
    try {
      const response = await axios.get(`/api/users`);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetUser();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <PageContainer scrollable={true}>
      <Layout>
        {/* ===== Top Heading ===== */}
        <Layout.Header>
          <div className="space-y-0.5">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Configuraciones
            </h1>
            <p className="text-muted-foreground">
              Maneja las configuraciones de tu cuenta.
            </p>
          </div>
        </Layout.Header>

        <Layout.Body className="flex flex-col">
          <Separator className="mb-4 lg:mb-6" />
          <div className="flex flex-1 flex-col space-y-8 md:space-y-2 md:overflow-hidden lg:flex-row lg:space-x-12 lg:space-y-0">
            <aside className="top-0 lg:sticky lg:w-1/5">
              <SidebarNav
                items={
                  user?.roleId === "0" ? sidebarNavItemsAdmin : sidebarNavItems
                }
              />
            </aside>
            <div className="flex w-full p-1 pr-4 md:overflow-y-hidden">
              {children}
            </div>
          </div>
        </Layout.Body>
      </Layout>
    </PageContainer>
  );
}

const sidebarNavItemsAdmin = [
  {
    title: "Usuarios",
    icon: <IconUser size={18} />,
    href: "/settings",
  },
  {
    title: "Perfil",
    icon: <IconTool size={18} />,
    href: "/settings/account",
  },
  {
    title: "Costos",
    icon: <IconPalette size={18} />,
    href: "/settings/costs",
  },
  {
    title: "Cortinas",
    icon: <IconNotification size={18} />,
    href: "/settings/curtains",
  },
];
const sidebarNavItems = [
  {
    title: "Perfil",
    icon: <IconTool size={18} />,
    href: "/settings/account",
  },
];
