import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
} from "lucide-vue-next";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: string;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          active: pathname === "/dashboard",
          icon: "Dashboard",
          submenus: [],
        },
        {
          href: "/dashboard/users/organizations",
          label: "Organizaciones",
          active: pathname === "/dashboard/users/organizations",
          icon: "Organization",
          submenus: [],
        },
        {
          href: "/categories",
          label: "Usuarios",
          active: pathname.includes("/dashboard/users"),
          icon: "Groups",
          submenus: [
            {
              href: "/posts",
              label: "Administradores",
              active: pathname === "/posts",
            },
            {
              href: "/posts/new",
              label: "Participantes",
              active: pathname === "/posts/new",
            },
          ],
        },
        {
          href: "",
          label: "Roles",
          active: pathname.includes("/roles"),
          icon: "WorkOutline",
          submenus: [],
        },
        {
          href: "",
          label: "Eventos",
          active: pathname.includes("/events"),
          icon: "Event",
          submenus: [],
        },
      ],
    },
  ];
}
