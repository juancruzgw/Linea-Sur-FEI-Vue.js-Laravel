<template>
  <div id="app" class="app-container">
    <nav v-if="showSidebar" class="sidebar">
      <h2>Linea SUR</h2>
      <ul>
        <li>
          <router-link to="/login" class="nav-link">
            <UserCircleIcon class="icon" /> Login
          </router-link>
        </li>
         <li>
          <router-link to="/" class="nav-link">
            <HomeIcon class="icon" /> Mapa
          </router-link>
        </li>
         <li>
          <router-link to="/precipitation" class="nav-link">
            <CloudIcon class="icon" /> Registrar precipitaciones
          </router-link>
        </li>
      </ul>
      <div class="sidebar-footer">v0.1 • LineaSur </div>
    </nav>
    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<script>
import { HomeIcon, UserCircleIcon , CloudIcon } from "@heroicons/vue/24/outline";
import { computed } from "vue";
import { useRoute } from "vue-router";
import "./style.css";
export default {
  name: "App",
  components: {
    HomeIcon,
    UserCircleIcon,
    CloudIcon
  },
  setup() {
    const route = useRoute();
    const showSidebar = computed(() => !route.meta?.hideSidebar);
    return { showSidebar };
  },
};
</script>

