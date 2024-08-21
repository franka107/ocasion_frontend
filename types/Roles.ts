export interface IRoleItem {
    id: string;
    isSystem: boolean,
    name: string;
    description: string;
    status: string;
    functionalities: RoleFunctionality[];
    createdAt: string;
    updatedAt: string;
}

export interface RoleFunctionality {
    id: string;
    label: string;
}

export interface IOrganizationSummary {
    totalRoles: number;
    activeRoles: number;
    inactiveRoles: number;
  }
  