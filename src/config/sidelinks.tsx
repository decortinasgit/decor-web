import {
  IconArticle,
  IconBoxSeam,
  IconLayoutDashboard,
  IconRouteAltLeft,
  IconSettings,
  IconTruck,
} from "@tabler/icons-react"

export interface NavLink {
  title: string
  label?: string
  href: string
  icon: JSX.Element
}

export interface SideLink extends NavLink {
  sub?: NavLink[]
}

export const sidelinks: SideLink[] = [
  {
    title: "Inicio",
    label: "",
    href: "/",
    icon: <IconLayoutDashboard size={18} />,
  },
  {
    title: "Presupuestador",
    label: "",
    href: "/budget",
    icon: <IconArticle size={18} />,
  },
  {
    title: "Pedidos",
    label: "10",
    href: "/orders",
    icon: <IconRouteAltLeft size={18} />,
    sub: [
      {
        title: "Estados",
        label: "9",
        href: "/orders/states",
        icon: <IconTruck size={18} />,
      },
      {
        title: "Control",
        label: "",
        href: "/orders/control",
        icon: <IconBoxSeam size={18} />,
      },
    ],
  },
  {
    title: "Configuraciones",
    label: "",
    href: "/settings",
    icon: <IconSettings size={18} />,
  },
]
