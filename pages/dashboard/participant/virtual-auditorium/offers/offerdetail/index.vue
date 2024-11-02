<script setup lang="ts">
import ContentLayout from '~/layouts/default/ContentLayout.vue'
const router = useRouter();
const route = useRoute();
interface Image {
    src: string;
    alt: string;
}
const eventDetail = ref<any>({
    id: '1',
    name: 'Nombre del evento',
    closingTime: '18:00',
    time: '25/09/24 12:00 p.m',
});
const { data: offerDetail } = await useAPI<any>(
    `/offer-management/get-offer-detail-for-participant?id=${route.params.offerId}`,
    {
        query: {},
        default: () => ({})
    }
);
offerDetail.value = offerDetail.value;
const images = ref<Image[]>([
    { src: '/assets/img/offer-detail1.png', alt: 'Imagen de auto 1' },
    { src: '/assets/img/offer-detail2.png', alt: 'Imagen de auto 2' },
    { src: '/assets/img/offer-detail3.png', alt: 'Imagen de auto 3' },
    { src: '/assets/img/offer-detail4.png', alt: 'Imagen de auto 4' },
    { src: '/assets/img/offer-detail5.png', alt: 'Imagen de auto 5' },
]);
</script>
<template>
    <ContentLayout title="Mis Ofertas" subtitle="Detalle oferta" customClass="lg:px-[16px]">
        <div class="flex text-[12px] font-[400] mb-[16px]">
            <h1 class="text-[#86868A] hover:text-[#225B82] cursor-pointer">Auditorio Virtual/</h1>
            <h1 class="text-[#86868A] hover:text-[#225B82] cursor-pointer">Mis ofertas/</h1>
            <h1 class="text-[#86868A] hover:text-[#225B82] cursor-pointer">Detalle de Oferta</h1>
        </div>
        <section class="w-full max-w-[1324px] mx-auto">
            <div class="w-full mx-auto grid gap-[16px] mt-[16px] mb-[24px]">
                <div class="bg-white border border-[#F3F8FC] rounded-lg px-[16px] pt-[24px] pb-[26px] w-full shadow-[0px_0px_4px_0px_#0000001A]">
                    <div class="flex flex-wrap justify-between items-center gap-y-[20px]">
                        <div>
                            <h3 class="font-[700] text-[#262F45] text-[20px] leading-[28px] mb-[16px]">{{
                                eventDetail.name }}
                            </h3>
                            <div class="flex items-center">
                                <CustomIcons name="calendar-today" class="mb-[1px]" />
                                <h3 class="gap-x-[6px] text-[#68686C] text-[14px] leading-[20px] ml-[6px] mr-[4px] font-[400]">
                                    <span class="font-[700] text-[#20445E] mr-[4px]">Fecha y hora de cierre </span>
                                    {{ eventDetail.time }}
                                </h3>
                                <CustomIcons name="time" class="mb-[1px] stroke-[#20445E]" />
                            </div>
                        </div>
                        <div class="flex flex-col md:flex-row gap-x-[16px] w-full ">
                            <Button type="button" @click="router.push('/terms-and-conditions')"
                                class="font-[600] text-[14px] md:text-[16px] text-[#F97316] bg-white px-4 py-2 rounded hover:bg-[#F97316] hover:text-white">Términos
                                y condiciones</Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section class="w-full max-w-[1324px] mx-auto">
            <!-- <div class="w-full mx-auto grid gap-[16px] mt-[32px] mb-[48px]"> -->
                <div class="bg-white border border-[#F3F8FC] rounded-lg px-[16px] pt-[24px] pb-[26px] w-full shadow-[0px_0px_4px_0px_#0000001A]">
                    <section class="flex justify-center max-w-[1440px] mx-[20px] md:mx-[80px] xl:mx-auto">
            <div class="max-w-7xl">
                <div class="grid grid-cols-1 md:grid-cols-[auto_2fr_1fr] gap-[24px] h-auto xl:h-[480px]">
                    <!-- Columna Izquierda: Carrusel de imágenes -->
                    <div class=" grid order-2 md:order-1 xl:order-1 flex flex-row md:flex-col justify-center md:justify-normal  items-center w-[81px] space-y-[8px] gap-x-[4px] md:gap-x-[0px] w-full bg-white border border-[#F3F8FC] rounded-lg px-[2px] py-[0px] md:py-[24px] max-w-[1280px]">
                        <div class="hidden md:block flex relative h-full top-[36px]">
                            <Carousel orientation="vertical" class="h-auto md:h-[52%] flex justify-center w-full" :opts="{
                                align: 'start', loop: true
                            }">
                                <CarouselContent class="-mt-1 h-[200px] w-[81px]">
                                    <CarouselItem v-for="(image, index) in images" :key="index"
                                        class="w-full p-0 md:basis-1/4">
                                        <div class="p-1">
                                            <Card class="rounded-[0px]">
                                                <CardContent class="flex items-center justify-center p-0">
                                                    <img :src="image.src" :alt="image.alt"
                                                        class="w-[65px] h-[50px] rounded-0" />
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </CarouselItem>
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                            </Carousel>
                        </div>
                        <div class="block md:hidden flex justify-center md:w-full w-[62vw] mx-auto">
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
                    <!-- Columna Central: Imagen grande y detalles del auto -->
                    <div class="order-1 md:order-2">
                        <div class=" rounded-2xl overflow-hidden">
                            <img src="/assets/img/car.png" alt="Imagen grande" class="w-full h-full" />
                        </div>

                    </div>

                    <!-- Columna Derecha: Cuenta regresiva y detalles adicionales -->
                    <div class="order-3 md:order-3 flex flex-col shadow-[0px_0px_4px_0px_#0000001A]">
                        <div
                            class="text-[#FFFFFF] text-[14px] leading-[16.41px] font-[500] bg-[#20445E] rounded-t-[8px] text-center py-[23px]">
                            <p class="pb-[16px]">Cierra en:</p>
                            <!-- Contador en cajitas -->
                            <div class="flex items-center space-x-2 justify-center">
                                <div
                                    class="w-[42px] md:w-[51px] h-[30px] md:h-[34px] border border-white rounded-[8px] flex items-center justify-center text-[14px] md:text-[16px] relative">
                                    00<span class="text-[#F6313C] ml-[3px]">d</span>
                                </div><span>:</span>
                                <div
                                    class="w-[42px] md:w-[51px] h-[30px] md:h-[34px] border border-white rounded-[8px] flex items-center justify-center text-[14px] md:text-[16px] relative">
                                    00<span class="text-[#F6313C] ml-[3px]">h</span>
                                </div><span>:</span>
                                <div
                                    class="w-[42px] md:w-[51px] h-[30px] md:h-[34px] border border-white rounded-[8px] flex items-center justify-center text-[14px] md:text-[16px] relative">
                                    00<span class="text-[#F6313C] ml-[3px]">m</span>
                                </div><span>:</span>
                                <div
                                    class="w-[42px] md:w-[51px] h-[30px] md:h-[34px] border border-white rounded-[8px] flex items-center justify-center text-[14px] md:text-[16px] relative">
                                    00<span class="text-[#F6313C] ml-[3px]">s</span>
                                </div>
                            </div>
                        </div>
                        <div class="px-[16px] pb-[16px]">
                            <h2
                                class="text-[#152A3C] text-[17px] md:text-[20px] font-[700] pb-[16px] uppercase tracking-tight">
                                SEDAN - MARCA:KIA MODELO:SOLUTO 1.4 MT - LX FULL AÑO 2020 </h2>
                            <div class="grid text-center gap-y-[8px] font-[400] text-[#152A3C] text-[14px] mt-4">
                                <p class="leading-[24px] ">Última oferta:</p>
                                <p class="font-[700] text-[22px] md:text-[24px] leading-[32px]">USD $0.000,00</p>
                                <p class="leading-[20px]">Próxima oferta sugerida: <span class="font-bold">USD
                                        $0.000,00</span></p>
                                <button class="text-[#2872A1] font-[500] my-2">Estimar importes y comisiones</button>
                            </div>
                            <div class="flex justify-end rounded-[8px] pt-[32px]">
                                <Button class="text-[14px] md:text-[16px] py-[15px] px-[24px]">
                                    Haz tu pre oferta
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
                </div>
            <!-- </div> -->
        </section>
    </ContentLayout>
</template>