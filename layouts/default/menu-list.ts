import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
} from 'lucide-vue-next'
import { GrantId } from '~/types/Grant'

type Submenu = {
  href: string
  label: string
  active: boolean
}

type Menu = {
  href: string
  label: string
  active: boolean
  icon: string
  submenus: Submenu[]
}

type Group = {
  groupLabel: string
  menus: Menu[]
}

export function getMenuList(
  pathname: string,
  grants: GrantId[],
  isParticipant: boolean,
  organizationId?: string,
): Group[] {
  if (isParticipant) {
    const participantMenuList: Menu[] = [
      {
        href: '/dashboard/participant/my-bids',
        label: 'Mis pujas',
        active: pathname === '/dashboard/participant/my-bids',
        icon: 'Bid',
        submenus: [],
      },
      {
        href: '/dashboard/participant/my-profile',
        label: 'Mi perfil',
        active: pathname === '/dashboard/participant/my-profile',
        icon: 'Profile',
        submenus: [],
      },
      {
        href: '/dashboard/participant/virtual-auditorium/offers',
        label: 'Auditorio Virtual',
        active: pathname === '/dashboard/participant/virtual-auditorium/offers',
        icon: 'PC',
        submenus: [],
      },
      {
        href: '/dashboard/participant/my-receipts',
        label: 'Mis recibos',
        active: pathname === '/dashboard/participant/my-receipts',
        icon: 'Receipt',
        submenus: [],
      },
      {
        href: '/dashboard/participant/my-wallet',
        label: 'Mi monedero',
        active: pathname === '/dashboard/participant/my-wallet',
        icon: 'Wallet',
        submenus: [],
      },
    ]
    return [
      {
        groupLabel: '',
        menus: participantMenuList,
      },
    ]
  } else {
    const menuList = [
      ...(grants.includes(GrantId.PlatformKpisManagement)
        ? [
            {
              href: '/dashboard/platform/graphics',
              label: 'Dashboard',
              active: pathname === '/dashboard/platform/graphics',
              icon: 'Dashboard',
              submenus: [],
            },
          ]
        : []),
      ...(grants.includes(GrantId.PlatformOrganizationsManagement)
        ? [
            {
              href: '/dashboard/platform/organizations',
              label: 'Organizaciones',
              active: pathname.includes('/organizations'),
              icon: 'Organization',
              submenus: [],
            },
          ]
        : []),
      // ...(grants.includes(GrantId.OrganizationUsersManagement)
      //   ? [
      //       {
      //         href: `/dashboard/organization/${organizationId}/users`,
      //         label: 'Usuarios',
      //         active: pathname === '/events',
      //         icon: 'Groups',
      //         submenus: [],
      //       },
      //     ]
      //   : []),

      ...(grants.includes(GrantId.PlatformUsersManagement)
        ? [
            {
              label: 'Usuarios',
              active: pathname.includes('/users'),
              icon: 'Groups',
              submenus: [
                ...(grants.includes(GrantId.PlatformUsersCanViewAdministrators)
                  ? [
                      {
                        href: '/dashboard/platform/users/administrators',
                        label: 'Administradores',
                        active: pathname.includes('/users/administrators'),
                        // active: pathname === "/users/administrators",
                      },
                    ]
                  : []),
                ...(grants.includes(GrantId.PlarformUsersCanViewParticipants)
                  ? [
                      {
                        href: '/dashboard/platform/users/participants',
                        label: 'Participantes',
                        active: pathname.includes('/users/participants'),
                        // active: pathname === "/users/participants",
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
              href: '/dashboard/platform/roles',
              label: 'Roles',
              active: pathname.includes('/roles'),
              icon: 'WorkOutline',
              submenus: [],
            },
          ]
        : []),

      ...(grants.includes(GrantId.PlatformEventsManagement)
        ? [
            {
              href: '/dashboard/platform/events',
              label: 'Eventos',
              active: pathname.includes('/events'),
              // active: pathname === "/events",
              icon: 'Event',
              submenus: [],
            },
          ]
        : []),

      ...(grants.includes(GrantId.PlatformPaymentManagement)
        ? [
            {
              href: `/dashboard/platform/payments`,
              label: 'Abonos',
              active: pathname.includes('/payments'),
              // active: pathname === "/payments",
              icon: 'Pay',
              submenus: [],
            },
          ]
        : []),

      ...(grants.includes(GrantId.PlatformTransferenceMangement)
        ? [
            {
              href: `/dashboard/platform/evidence`,
              label: 'Evidencias',
              active: pathname === '/evidence',
              icon: 'Evidence',
              submenus: [],
            },
          ]
        : []),

      ...(grants.includes(GrantId.OrganizationKpisManagement)
        ? [
            {
              href: `/dashboard/organization/${organizationId}/graphics`,
              label: 'Dashboard',
              active: pathname === '/graphics',
              icon: 'Dashboard',
              submenus: [],
            },
          ]
        : []),
      ...(grants.includes(GrantId.OrganizationUsersManagement)
        ? [
            {
              label: 'Usuarios',
              active: pathname.includes('/users'),
              icon: 'Groups',
              submenus: [
                ...(grants.includes(
                  GrantId.OrganizationUsersCanViewAdministrators,
                )
                  ? [
                      {
                        // href: '/dashboard/platform/users/administrators',
                        href: `/dashboard/organization/${organizationId}/users/administrators`,
                        label: 'Administradores',
                        active: pathname.includes('/users/administrators'),
                        // active: pathname === "/users/administrators",
                      },
                    ]
                  : []),
                // ...(grants.includes(GrantId.OrganizationUsersCanViewParticipants)
                //   ? [
                //       {
                //         // href: '/dashboard/platform/users/participants',
                //         href: `/dashboard/organization/${organizationId}/users/participants`,
                //         label: 'Participantes',
                //         active: pathname.includes('/users/participants'),
                //         // active: pathname === "/users/participants",
                //       },
                //     ]
                //   : []),
              ],
            },
          ]
        : []),
      ...(grants.includes(GrantId.OrganizationEventsManagement)
        ? [
            {
              href: `/dashboard/organization/${organizationId}/events`,
              label: 'Eventos',
              active: pathname === '/events',
              icon: 'Event',
              submenus: [],
            },
          ]
        : []),

      ...(grants.includes(GrantId.OrganizationRolesManagement)
        ? [
            {
              href: `/dashboard/organization/${organizationId}/roles`,
              label: 'Roles',
              active: pathname === '/roles',
              icon: 'WorkOutline',
              submenus: [],
            },
          ]
        : []),

      ...(grants.includes(GrantId.OrganizationPaymentManagement)
        ? [
            {
              href: `/dashboard/organization/${organizationId}/payments`,
              label: 'Abonos',
              active: pathname === '/payments',
              icon: 'Pay',
              submenus: [],
            },
          ]
        : []),

      ...(grants.includes(GrantId.OrganizationTransferenceManagement)
        ? [
            {
              href: `/dashboard/organization/${organizationId}/evidence`,
              label: 'Evidencias',
              active: pathname === '/evidence',
              icon: 'Evidence',
              submenus: [],
            },
          ]
        : []),
    ]
    return [
      {
        groupLabel: '',
        menus: menuList,
      },
    ]
  }
}
