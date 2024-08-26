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
          href: "/organizations",
          label: "Organizaciones",
          active: pathname.includes("/organizations"),
          icon: "Organization",
          submenus: [],
        },
        {
          href: "/users",
          label: "Usuarios",
          active: pathname.includes("/users"),
          icon: "Groups",
          submenus: [
            {
              href: "/users/administrators",
              label: "Administradores",
              active: pathname === "/users/administrators",
            },
            {
              href: "/users/participants",
              label: "Participantes",
              active: pathname === "/users/participants",
            },
          ],
        },
        {
          href: "/roles",
          label: "Roles",
          active: pathname.includes("/roles"),
          icon: "WorkOutline",
          submenus: [],
        },
        {
          href: "",
          label: "Eventos",
          active: pathname ==="/events",
          icon: "Event",
          submenus: [],
        },
      ],
    },
  ];
}
