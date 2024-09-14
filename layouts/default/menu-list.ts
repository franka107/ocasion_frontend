import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
} from "lucide-vue-next";
import { GrantId } from "~/types/Grant";

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

// export function getMenuList(pathname: string, grants: GrantId[]): Group[] {
//   return [
//     {
//       groupLabel: "",
//       menus: [
//         {
//           href: "/dashboard",
//           label: "Dashboard",
//           active: pathname === "/dashboard",
//           icon: "Dashboard",
//           submenus: [],
//         },
//         {
//           href: "/organizations",
//           label: "Organizaciones",
//           active: pathname.includes("/organizations"),
//           icon: "Organization",
//           submenus: [],
//         },
//         {
//           href: "/users",
//           label: "Usuarios",
//           active: pathname.includes("/users"),
//           icon: "Groups",
//           submenus: [
//             {
//               href: "/users/administrators",
//               label: "Administradores",
//               active: pathname === "/users/administrators",
//             },
//             {
//               href: "/users/participants",
//               label: "Participantes",
//               active: pathname === "/users/participants",
//             },
//           ],
//         },
//         {
//           href: "/roles",
//           label: "Roles",
//           active: pathname.includes("/roles"),
//           icon: "WorkOutline",
//           submenus: [],
//         },
//         {
//           href: "",
//           label: "Eventos",
//           active: pathname === "/events",
//           icon: "Event",
//           submenus: [],
//         },
//       ],
//     },
//   ];
// }

export function getMenuList(pathname: string, grants: GrantId[]): Group[] {
  console.log(grants);
  const menuList = [
    ...(grants.includes(GrantId.ManagePlatformDashboard)
      ? [
          {
            href: "/dashboard",
            label: "Dashboard",
            active: pathname === "/dashboard",
            icon: "Dashboard",
            submenus: [],
          },
        ]
      : []),
    ...(grants.includes(GrantId.ManagePlatformOrganizations)
      ? [
          {
            href: "/organizations",
            label: "Organizaciones",
            active: pathname.includes("/organizations"),
            icon: "Organization",
            submenus: [],
          },
        ]
      : []),
    ...(grants.includes(GrantId.ManagePlatformUsers)
      ? [
          {
            href: "/users",
            label: "Usuarios",
            active: pathname.includes("/users"),
            icon: "Groups",
            submenus: [
              ...(grants.includes(GrantId.ViewPlatformAdministrators)
                ? [
                    {
                      href: "/users/administrators",
                      label: "Administradores",
                      active: pathname === "/users/administrators",
                    },
                  ]
                : []),
              ...(grants.includes(GrantId.ViewPlatformParticipants)
                ? [
                    {
                      href: "/users/participants",
                      label: "Participantes",
                      active: pathname === "/users/participants",
                    },
                  ]
                : []),
            ],
          },
        ]
      : []),

    ...(grants.includes(GrantId.ManagePlatformRoles)
      ? [
          {
            href: "/roles",
            label: "Roles",
            active: pathname.includes("/roles"),
            icon: "WorkOutline",
            submenus: [],
          },
        ]
      : []),

    ...(grants.includes(GrantId.ManagePlatformEvents)
      ? [
          {
            href: "",
            label: "Eventos",
            active: pathname === "/events",
            icon: "Event",
            submenus: [],
          },
        ]
      : []),
  ];
  return [
    {
      groupLabel: "",
      menus: menuList,
    },
  ];
}

// export function getMenuList(pathname: string, grants: GrantId[]): Group[] {
//   const menuList: Menu[] = [];
//   let userSubmenus: Submenu[] = [];
//
//   // Recorremos todos los grants que tiene el usuario y agregamos los menús correspondientes
//   grants.forEach((grant) => {
//     if (grant === GrantId.ViewPlatformAdministrators) {
//       userSubmenus.push({
//         href: "/users/administrators",
//         label: "Administradores",
//         active: pathname === "/users/administrators",
//       });
//     }
//
//     if (grant === GrantId.ViewPlatformParticipants) {
//       userSubmenus.push({
//         href: "/users/participants",
//         label: "Participantes",
//         active: pathname === "/users/participants",
//       });
//     }
//
//     const menus = grantMenuMapping[grant];
//     if (menus) {
//       menus.forEach((menu) => {
//         const updatedMenu: Menu = {
//           ...menu,
//           active: pathname.includes(menu.href),
//           submenus: menu.submenus.map((submenu) => ({
//             ...submenu,
//             active: pathname === submenu.href,
//           })),
//         };
//         menuList.push(updatedMenu);
//       });
//     }
//   });
//
//   // Si hay submenús para usuarios, agregamos el menú de "Usuarios"
//   if (userSubmenus.length > 0) {
//     menuList.push({
//       href: "/users",
//       label: "Usuarios",
//       active: pathname.includes("/users"),
//       icon: "Groups",
//       submenus: userSubmenus,
//     });
//   }
//
//   console.log(menuList);
//
//   return [
//     {
//       groupLabel: "MAIN_GROUP",
//       menus: menuList,
//     },
//   ];
// }

const grantMenuMapping: { [key in GrantId]?: Menu[] } = {
  [GrantId.ManagePlatformDashboard]: [
    {
      href: "/dashboard",
      label: "Dashboard",
      active: false,
      icon: "Dashboard",
      submenus: [],
    },
  ],
  [GrantId.ManagePlatformOrganizations]: [
    {
      href: "/organizations",
      label: "Organizaciones",
      active: false,
      icon: "Organization",
      submenus: [],
    },
  ],
  [GrantId.ManagePlatformUsers]: [
    {
      href: "/users",
      label: "Usuarios",
      active: false,
      icon: "Groups",
      submenus: [],
    },
  ],
  [GrantId.ViewPlatformAdministrators]: [
    {
      href: "/users/administrators",
      label: "Administradores",
      active: false,
      icon: "AdminPanelSettings",
      submenus: [],
    },
  ],
  [GrantId.ViewPlatformParticipants]: [
    {
      href: "/users/participants",
      label: "Participantes",
      active: false,
      icon: "Person",
      submenus: [],
    },
  ],
  [GrantId.ManagePlatformRoles]: [
    {
      href: "/roles",
      label: "Roles",
      active: false,
      icon: "WorkOutline",
      submenus: [],
    },
  ],
  [GrantId.ManagePlatformEvents]: [
    {
      href: "/events",
      label: "Eventos",
      active: false,
      icon: "Event",
      submenus: [],
    },
  ],
  [GrantId.ManageOrganizationEvents]: [
    {
      href: "/organization/events",
      label: "Eventos de Organización",
      active: false,
      icon: "Event",
      submenus: [],
    },
  ],
};
