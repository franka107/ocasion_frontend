<template>
  <div>
    <h1>Organizations</h1>

    <OrganizationForm
      :organization="selectedOrganization"
      :onsubmit="onFormSubmit"
    />

    <div>
      <div class="w-full flex justify-end mb-4">
        <SheetTrigger>
          <Button class="">
            <PlusIcon class="w-4 h-4 mr-2 text-white" />
            Agregar Empresa
          </Button>
        </SheetTrigger>
      </div>
      <Table>
        <TableCaption>Lista de organizaciones recientes</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead class="w-[200px]">RUC Number</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Representative Full Name</TableHead>
            <TableHead>Document Type</TableHead>
            <TableHead>Document Identifier</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Billing Email</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="organization in organizations"
            :key="organization.rucNumber"
          >
            <TableCell class="font-medium">{{
              organization.rucNumber
            }}</TableCell>
            <TableCell>{{ organization.name }}</TableCell>
            <TableCell>{{ organization.representativeFullName }}</TableCell>
            <TableCell>{{ organization.representativeDocumentType }}</TableCell>
            <TableCell>{{
              organization.representativeDocumentIdentifier
            }}</TableCell>
            <TableCell>{{ organization.representativePhoneNumber }}</TableCell>
            <TableCell>{{ organization.billingEmail }}</TableCell>
            <TableCell>
              <SheetTrigger>
                <Button
                  variant="ghost"
                  size="icon"
                  @click="editOrganization(organization)"
                >
                  <DotsHorizontalIcon />
                </Button>
              </SheetTrigger>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>

<script setup lang="ts">
import OrganizationForm from "@/components/users/organizations/form.vue";

import { ref } from "vue";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusIcon, DotsHorizontalIcon } from "@radix-icons/vue";

import { Button } from "@/components/ui/button";
import type { IOrganization } from "~/models/organizations";

const selectedOrganization = ref<IOrganization | null>(null);

const onFormSubmit = () => {
  console.log("Hello");
};

const editOrganization = (organization: IOrganization) => {
  selectedOrganization.value = organization;
};

const organizations = ref([
  {
    rucNumber: "31478108862",
    name: "Krajcik, Sipes and Rau",
    economicActivity: { id: "1" },
    representativeFullName: "John Doe",
    representativeDocumentType: "DNI",
    representativeDocumentIdentifier: "76876655",
    representativePhoneNumber: "987678977",
    billingEmail: "homero@gmail.com",
    startPercentage: 12.67,
    contractStartDate: "2024-08-11",
    contractEndDate: "2022-08-30",
    address: {
      addressLine1: "Calle San Juan 123",
      district: { id: "1+0+0" },
    },
    attachedFiles: [],
  },
  {
    rucNumber: "21548966201",
    name: "Smith, Johnson and Clark",
    economicActivity: { id: "2" },
    representativeFullName: "Jane Smith",
    representativeDocumentType: "Passport",
    representativeDocumentIdentifier: "A12345678",
    representativePhoneNumber: "987654321",
    billingEmail: "jane@gmail.com",
    startPercentage: 15.45,
    contractStartDate: "2023-07-21",
    contractEndDate: "2024-07-20",
    address: {
      addressLine1: "Avenida Siempre Viva 742",
      district: { id: "2+0+0" },
    },
    attachedFiles: [],
  },
]);

const fetchOrganizations = async () => {
  try {
    const result = await $fetch(
      "https://back.deocasion.mrmisti.com/v1/organization-management/find-organizations",
      {
        method: "GET",
        body: {
          limit: 10,
          page: 1
        },
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      }
    );
    console.log(result);
  } catch (error) {
    console.error("Failed to fetch organizations", error);
  }
};

onMounted(() => {
  fetchOrganizations();
});
</script>
