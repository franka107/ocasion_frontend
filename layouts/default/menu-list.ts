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

export function getMenuList(
  pathname: string,
  grants: GrantId[],
  organizationId?: string,
): Group[] {
  console.log(grants);
  const menuList = [
    ...(grants.includes(GrantId.PlatformKpisManagement)
      ? [
          {
            href: "/dashboard/platform/graphics",
            label: "Dashboard",
            active: pathname === "/dashboard",
            icon: "Dashboard",
            submenus: [],
          },
        ]
      : []),
    ...(grants.includes(GrantId.PlatformOrganizationsManagement)
      ? [
          {
            href: "/dashboard/platform/organizations",
            label: "Organizaciones",
            active: pathname.includes("/organizations"),
            icon: "Organization",
            submenus: [],
          },
        ]
      : []),
    ...(grants.includes(GrantId.PlatformUsersManagement)
      ? [
          {
            href: "/dashboard/platform/users",
            label: "Usuarios",
            active: pathname.includes("/users"),
            icon: "Groups",
            submenus: [
              ...(grants.includes(GrantId.PlatformUsersCanViewAdministrators)
                ? [
                    {
                      href: "/dashboard/platform/users/administrators",
                      label: "Administradores",
                      active: pathname === "/users/administrators",
                    },
                  ]
                : []),
              ...(grants.includes(GrantId.PlarformUsersCanViewParticipants)
                ? [
                    {
                      href: "/dashboard/platform/users/participants",
                      label: "Participantes",
                      active: pathname === "/users/participants",
                    },
                  ]
                : []),
            ],
          },
        ]
      : []),

    ...(grants.includes(GrantId.PlatformRolesManagement)
      ? [
          {
            href: "/dashboard/platform/roles",
            label: "Roles",
            active: pathname.includes("/roles"),
            icon: "WorkOutline",
            submenus: [],
          },
        ]
      : []),

    ...(grants.includes(GrantId.PlatformEventsManagement)
      ? [
          {
            href: "/dashboard/platform/events",
            label: "Eventos",
            active: pathname === "/events",
            icon: "Event",
            submenus: [],
          },
        ]
      : []),

    ...(grants.includes(GrantId.PlatformPaymentManagement)
      ? [
          {
            href: `/dashboard/platform/payments`,
            label: "Abonos",
            active: pathname === "/payments",
            icon: "Pay",
            submenus: [],
          },
        ]
      : []),

    ...(grants.includes(GrantId.OrganizationKpisManagement)
      ? [
          {
            href: `/dashboard/organization/${organizationId}/graphics`,
            label: "Dashboard",
            active: pathname === "/graphics",
            icon: "Dashboard",
            submenus: [],
          },
        ]
      : []),
    ...(grants.includes(GrantId.OrganizationEventsManagement)
      ? [
          {
            href: `/dashboard/organization/${organizationId}/events`,
            label: "Eventos",
            active: pathname === "/events",
            icon: "Event",
            submenus: [],
          },
        ]
      : []),
    ...(grants.includes(GrantId.OrganizationUsersManagement)
      ? [
          {
            href: `/dashboard/organization/${organizationId}/users`,
            label: "Usuarios",
            active: pathname === "/events",
            icon: "Groups",
            submenus: [],
          },
        ]
      : []),
    ...(grants.includes(GrantId.OrganizationRolesManagement)
      ? [
          {
            href: `/dashboard/organization/${organizationId}/roles`,
            label: "Roles",
            active: pathname === "/roles",
            icon: "WorkOutline",
            submenus: [],
          },
        ]
      : []),
    
      ...(grants.includes(GrantId.OrganizationPaymentManagement)
      ? [
          {
            href: `/dashboard/organization/${organizationId}/payments`,
            label: "Abonos",
            active: pathname === "/payments",
            icon: "Pay",
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
