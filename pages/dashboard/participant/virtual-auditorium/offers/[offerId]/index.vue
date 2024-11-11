<script setup lang="ts">
import ContentLayout from '~/layouts/default/ContentLayout.vue'
import DetailOfferAuditoriumItem from '@/components/virtual-auditorium/DetailOfferAuditoriumItem.vue'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '~/components/ui/carousel'
import type { OfferDto } from '~/types/Offer'
import dayjs from 'dayjs'
const { termsAndConditionsUrl } = useRuntimeConfig().public;
const route = useRoute();
const activeTab = ref<string>('info');
interface Image {
    src: string;
    alt: string;
}
const { data: offerDetail } = await useAPI<OfferDto>(
    `/offer-management/get-offer-detail-for-participant?id=${route.params.offerId}`,
    {
        query: {},
        default: () => ({})
    } as any
);
offerDetail.value = offerDetail.value;
const eventEndDate = offerDetail.value.event ? `${dayjs(offerDetail.value.event.endDate).format('DD/MM/YY')} ${dayjs().hour(offerDetail.value.event.closingTime).minute(0).format('hh:mm a')}` : '' ;
const images = ref<Image[]>([
    { src: '/assets/img/offer-detail1.png', alt: 'Imagen de auto 1' },
    { src: '/assets/img/offer-detail2.png', alt: 'Imagen de auto 2' },
    { src: '/assets/img/offer-detail3.png', alt: 'Imagen de auto 3' },
    { src: '/assets/img/offer-detail4.png', alt: 'Imagen de auto 4' },
    { src: '/assets/img/offer-detail5.png', alt: 'Imagen de auto 5' },
]);
</script>
<template>

    <ContentLayout title="Detalle oferta" subtitle="Detalle oferta"  showArrow customClass="lg:px-[16px]">
        <!-- <div class="h 10 w 10">
            <Button variant="ghost" @click="router.back">
                <CustomIcons name="BackArrow" class="w-6 h-6 text-primary" />
            </Button>
        </div> -->
        <div class="flex text-[12px] font-[400] mb-[16px]">
            <h1 class="text-[#86868A] hover:text-[#225B82] cursor-pointer">Auditorio Virtual/</h1>
            <h1 class="text-[#86868A] hover:text-[#225B82] cursor-pointer">Mis ofertas/</h1>
            <h1 class="text-[#86868A] hover:text-[#225B82] cursor-pointer">Detalle de Oferta</h1>
        </div>
        <section class="w-full max-w-[1324px] mx-auto h-full">
            <div class="w-full mx-auto grid gap-[16px] mt-[16px] mb-[24px]">
                <div
                    class="bg-white border border-[#F3F8FC] rounded-lg px-[16px] pt-[24px] pb-[26px] w-full shadow-[0px_0px_4px_0px_#0000001A]">
                    <div class="flex flex-wrap justify-between items-center gap-y-[20px]">
                        <div>
                            <h3 class="font-[700] text-[#262F45] text-[20px] leading-[28px] mb-[16px]">{{
                                offerDetail.event?.name }}
                            </h3>
                            <div class="flex items-center">
                                <CustomIcons name="calendar-today" class="mb-[1px]" />
                                <h3
                                    class="gap-x-[6px] text-[#68686C] text-[14px] leading-[20px] ml-[6px] mr-[4px] font-[400]">
                                    <span class="font-[700] text-[#20445E] mr-[4px]">Fecha y hora de cierre </span>
                                    {{ eventEndDate }}
                                </h3>
                                <CustomIcons name="time" class="mb-[1px] stroke-[#20445E]" />
                            </div>
                        </div>
                        <div class="flex flex-col md:flex-row gap-x-4 w-auto ">
                            <NuxtLink type="button" :href="termsAndConditionsUrl"
                                class="font-[600] text-sm md:text-base text-[#F97316] bg-white px-4 py-2 rounded hover:bg-[#F97316] hover:text-white">Términos
                                y condiciones</NuxtLink>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section class="w-full max-w-[1324px] h-full max-h-[625px] mx-auto">
            <div
                class="h-full md:h-[625px] bg-white border border-[#F3F8FC] rounded-lg px-[16px] pt-[24px] pb-[26px] w-full shadow-[0px_0px_4px_0px_#0000001A] mb-[24px]">
                <section class="flex justify-center mx-auto max-w-[1116px]">
                    <div class="max-w-7xl w-full">
                        <div class="flex flex-col md:flex-row gap-[24px]">
                            <!-- Columna Izquierda: Imagen grande -->
                            <div class="flex flex-col justify-center w-full md:w-[63%]">
                                <div class="w-full " style="max-width: 692px;">
                                    <div class="w-full h-full max-w-[692px] max-h-[480px] rounded-2xl overflow-hidden">
                                        <img src="/assets/img/car.png" alt="Imagen grande" class="w-full h-full" />
                                    </div>
                                </div>
                                <div class="flex w-full items-center" style="max-width: 692px;">
                                    <div class="flex justify-center md:w-full w-[62vw] mt-[16px] mx-auto">
                                        <Carousel class="relative w-full max-w-xs h-auto md:h-[52%]" :opts="{
                                            align: 'start', loop: true
                                        }">
                                            <CarouselContent>
                                                <CarouselItem v-for="(image, index) in images" :key="index"
                                                    class="basis-1/4 lg:basis-1/4">
                                                    <div class="p-1">
                                                        <Card class="rounded-[0px]">
                                                            <CardContent class=" p-0">
                                                                <img :src="image.src" :alt="image.alt"
                                                                    class="max-w-[65px] max-h-[50px] rounded-0" />
                                                            </CardContent>
                                                        </Card>
                                                    </div>
                                                </CarouselItem>
                                            </CarouselContent>
                                            <CarouselPrevious />
                                            <CarouselNext />
                                        </Carousel>
                                    </div>
                                </div>
                            </div>

                            <!-- Columna Derecha: Información -->
                            <div
                                class="w-full h-full min-h-[478px] md:w-[37%] flex flex-col shadow-[0px_0px_4px_0px_#0000001A] p-[16px] rounded-[12px]">
                                <!-- Tabs -->
                                <div
                                    class="flex font-[500] text-[14px] md:text-[16px] gap-4 border-b-[2px] pt-[8px] pb-[16px] border-[#D0D0D1]">
                                    <button :class="activeTab === 'info' ? 'text-bluePrimary' : 'text-[#D0D0D1]'"
                                        @click="activeTab = 'info'"
                                        class="hover:underline hover:underline-offset-[22px] hover:text-bluePrimary leading-[24px]">
                                        Información
                                    </button>
                                    <button :class="activeTab === 'description' ? 'text-bluePrimary' : 'text-[#D0D0D1]'"
                                        @click="activeTab = 'description'"
                                        class="hover:underline hover:underline-offset-[22px] hover:text-bluePrimary leading-[24px]">
                                        Descripción
                                    </button>
                                    <button :class="activeTab === 'annex' ? 'text-bluePrimary' : 'text-[#D0D0D1]'"
                                        @click="activeTab = 'annex'"
                                        class="hover:underline hover:underline-offset-[22px] hover:text-bluePrimary leading-[24px]">
                                        Anexos
                                    </button>
                                </div>
                                <div>
                                    <div v-if="activeTab === 'info'">
                                        <DetailOfferAuditoriumItem :offerDetail="offerDetail" 
                                        />
                                    </div>
                                    <div v-if="activeTab === 'description'">
                                        <p class="my-[16px] text-[14px] text-[#000000] text-justify">{{ offerDetail.description }}
                                        </p>
                                    </div>
                                    <div v-if="activeTab === 'annex'">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </section>
    </ContentLayout>
</template>
