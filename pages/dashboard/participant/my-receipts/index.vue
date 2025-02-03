<template>
  <ContentLayout title="Listado de recibos">
    <div class="flex flex-col space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>
              <NuxtLink to="/dashboard/participant/my-receipts">
                Mis recibos
              </NuxtLink>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator> / </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Lista de recibos</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card>
        <CardHeader>
          <CardTitle>Mis recibos</CardTitle>
        </CardHeader>
      </Card>
      <InvoiceTable />
    </div>
  </ContentLayout>
</template>
<script setup lang="ts">
import { Slash } from 'lucide-vue-next'
import InvoiceTable from '~/components/invoice/InvoiceTable.vue'
import CardHeader from '~/components/ui/card/CardHeader.vue'
import CardTitle from '~/components/ui/card/CardTitle.vue'
import Breadcrumb from '~/design-system/ui/breadcrumb/Breadcrumb.vue'
import BreadcrumbItem from '~/design-system/ui/breadcrumb/BreadcrumbItem.vue'
import BreadcrumbLink from '~/design-system/ui/breadcrumb/BreadcrumbLink.vue'
import BreadcrumbList from '~/design-system/ui/breadcrumb/BreadcrumbList.vue'
import BreadcrumbPage from '~/design-system/ui/breadcrumb/BreadcrumbPage.vue'
import BreadcrumbSeparator from '~/design-system/ui/breadcrumb/BreadcrumbSeparator.vue'
import Card from '~/design-system/ui/card/Card.vue'
import ContentLayout from '~/layouts/default/ContentLayout.vue'
</script>
