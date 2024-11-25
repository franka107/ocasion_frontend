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
        href: '/dashboard/participant/virtual-auditorium',
        label: 'Auditorio Virtual',
        active: pathname === '/dashboard/participant/virtual-auditorium',
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
      ...(grants.includes(GrantId.PlatformAttentionManagement)
        ? [
            {
              label: 'Bandeja de atención',
              active: pathname.includes('/attention-tray'),
              icon: 'Tray',
              submenus: [
                ...(grants.includes(GrantId.PlatformAttentionCanViewRechargeRequest)
                  ? [
                      {
                        href: '/dashboard/platform/attention-tray/top-up-requests',
                        label: 'Solicitudes de recargas',
                        active: pathname.includes('/attention-tray/top-up-requests'),
                      },
                    ]
                  : []),
                  ...(grants.includes(GrantId.PlatformAttentionCanViewAccountValidation)
                  ? [
                      {
                        href: '/dashboard/platform/attention-tray/account-validation',
                        label: 'Validación de cuentas',
                        active: pathname.includes('/attention-tray/account-validation'),
                      },
                    ]
                  : []),
                  ...(grants.includes(GrantId.PlatformAttentionCanViewWithDrawalRequest)
                  ? [
                      {
                        href: '/dashboard/platform/attention-tray/withdrawal-requests',
                        label: 'Solicitudes de retiros',
                        active: pathname.includes('/attention-tray/withdrawal-requests'),
                      },
                    ]
                  : []),
                  ...(grants.includes(GrantId.PlatformAttentionCanViewDisbursementLots)
                  ? [
                      {
                        href: '/dashboard/platform/attention-tray/disbursement-lots',
                        label: 'Lotes de desembolso',
                        active: pathname.includes('/attention-tray/disbursement-lots'),
                      },
                    ]
                  : []),
              ],
            },
          ]
        : []),
      ...(grants.includes(GrantId.PlatformReportsManagement)
      ? [
          {
            label: 'Reportes',
            active: pathname.includes('/reports'),
            icon: 'Passbook',
            submenus: [
              ...(grants.includes(GrantId.PlatformReportsCanViewGlobalTransactions)
                ? [
                    {
                      href: '/dashboard/platform/reports/transactions',
                      label: 'Transacciones (Global) ',
                      active: pathname.includes('/reports/transactions'),
                    },
                  ]
                : []),
                ...(grants.includes(GrantId.PlatformReportsCanViewDisbursementLots)
                ? [
                    {
                      href: '/dashboard/platform/reports/disbursement-batch',
                      label: 'Lote de desembolso',
                      active: pathname.includes('/reports/disbursement-batch'),
                    },
                  ]
                : []),
                ...(grants.includes(GrantId.PlatformReportsCanViewAccountValidations)
                ? [
                    {
                      href: '/dashboard/platform/reports/account-validation',
                      label: 'Validación de cuentas',
                      active: pathname.includes('/reports/account-validation'),
                    },
                  ]
                : []),
                ...(grants.includes(GrantId.PlatformReportsCanViewAccountBalance)
                ? [
                    {
                      href: '/dashboard/platform/reports/account-balance',
                      label: 'Balance de cuenta',
                      active: pathname.includes('/reports/account-balance'),
                    },
                  ]
                : []),
            ],
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
