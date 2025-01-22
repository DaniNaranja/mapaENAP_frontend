<template>
    <div class="h-screen flex flex-col w-48 bg-gradient-to-b from-violet-500 to-indigo-800" >
        <RouterLink to="/mapa">
            <div class="flex items-center justify-between pr-4 pl-4 pt-2 pb-2 hover:bg-violet-900">
                        <div class="flex items-center">
                            <i class="fa-solid fa-map-location-dot m-3 text-2xl" style="color: white"></i>
                            
                            <span style="font-size: 16px; color: white; font-weight: 600;">Mapa</span>
                        </div>
                        <i class="fas fa-chevron-right text-xl ml-3 arrow"></i>
                    </div>
        </RouterLink>
        <RouterLink to="/permisos">
            <div class="flex items-center justify-between pr-4 pl-4 pt-2 pb-2 hover:bg-violet-900">
                        <div class="flex items-center">

                            <i class="fa-solid fa-clipboard-list m-3.5 text-2xl" style="color: white"></i>
                            <span style="font-size: 16px; color: white; font-weight: 600;">Permisos</span>
                        </div>
                        <i class="fas fa-chevron-right text-xl ml-3 arrow"></i>
                    </div>
        </RouterLink>
        <RouterLink to="/historial">
            <div class="flex items-center justify-between pr-4 pl-4 pt-2 pb-2 hover:bg-violet-900">
                        <div class="flex items-center">

                            <i class="fa-solid fa-clock-rotate-left m-3 text-2xl" style="color: white"></i>
                            <span style="font-size: 16px; color: white; font-weight: 600;">Historial</span>
                        </div>
                        <i class="fas fa-chevron-right text-xl ml-3 arrow"></i>
                    </div>
        </RouterLink>
        
    </div>

</template>

<script>
export default {
  name: 'SideBar',
  
}
</script>

<style scoped>
.side-nav {
    width: 300px;
    transition: width 0.3s ease;
}

@media (max-width: 768px) {
    .side-nav {
        width: 80px;
    }

    .side-nav span {
        display: none;
    }
}

</style>