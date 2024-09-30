<template>
    <footer class="bg-[#F3F8FC] px-[80px] py-12">
      <div class="container max-w-[1280px] p-[0px] grid grid-cols-1 md:grid-cols-3 gap-[198.3px]">
        <div class="w-[277px]">
          <div class="mb-[24px]">
            <img src="/assets/img/logo.png" alt="Logo" class="h-12" />
          </div>
          <p class="text-[16px] text-[#68686C] mb-[24px]">
            Redefinimos la experiencia de compra y venta a través de nuestra innovadora plataforma de subastas online.
          </p>
          <div class="flex">
            <div class="bg-[#20445E] h-[44px] w-[44px] rounded-full flex items-center justify-center mr-[8px]">
               <CustomIcons name="whatsapp" class="h-3/4 w-3/4" />
            </div>
            <div class="bg-bluePrimary h-[44px] w-[44px] rounded-full flex items-center justify-center">
               <CustomIcons name="whatsapp" class="h-3/4 w-3/4" />
            </div>
          </div>
        </div>
        <div class="w-[345.16px]">
          <h3 class="font-bold text-bluePrimary text-[24px] mb-[24px]">ENLACES RÁPIDOS</h3>
          <ul class="grid text-sm text-[#68686C] gap-y-[21px]">
            <li><a href="#" class="hover:underline">¿Quiénes somos?</a></li>
            <li><a href="#" class="hover:underline">Subastas</a></li>
            <li><a href="#" class="hover:underline">Preguntas frecuentes</a></li>
            <li><a href="#" class="hover:underline">¿Cómo participar?</a></li>
          </ul>
        </div>
        <div class="w-[260px]">
          <h3 class="font-bold text-[#141D38] text-[24px] mb-[24px]">CONTACTO</h3>
          <div class="grid gap-y-[24px]">
          <div class="flex">
            <div class="bg-bluePrimary h-[44px] w-[44px] rounded-full flex items-center justify-center mr-[16px]">
               <CustomIcons name="whatsapp" class="h-3/4 w-3/4" />
            </div>
            <p class="flex flex-col text-[14px] font-[400] text-[#68686C]">WHATSAPP <span class="text-[18px] text-bluePrimary">+51 987654321</span></p>
          </div>
          <div class="flex">
            <div class="bg-bluePrimary h-[44px] w-[44px] rounded-full flex items-center justify-center mr-[16px]">
               <CustomIcons  name="email" class="h-3/4 w-3/4" />
            </div>
            <p class="flex flex-col text-[14px] font-[400] text-[#68686C]"">CORREO<span class="text-[18px] text-bluePrimary">info@ejemplo.com</span></p>
          </div>
        </div>
        </div>
        
      </div>
    </footer>
    <div class="flex justify-between pl-[80px] pr-[51px] leading-[26px] py-[22px] bg-bluePrimary gap-x-[8px] space-x-2 ">
        <h4 class="text-4 text-[#FFFFFF] font-[400]">Copyright ©2024 Novaly. Todos los derechos reservados.</h4>
        <h4 class="text-4 text-[#FFFFFF] font-[400]">Términos y Condiciones | Privacidad y Política</h4>
    </div>
  </template>
