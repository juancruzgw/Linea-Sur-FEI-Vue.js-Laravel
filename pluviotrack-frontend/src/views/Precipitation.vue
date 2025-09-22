<template>
  <div id="precipitation">
    <h1>Registrar precipitaciones</h1>

    <div class="forms-container">
      <!-- Formulario lluvia -->
      <section class="form-card">
        <h2>Lluvia</h2>
        <form @submit.prevent="submitRain">
          <div>
            <label for="rainDate">Fecha</label>
            <input id="rainDate" type="date" v-model="rain.date" required />
          </div>
          <div>
            <label for="rainAmount">Cantidad (mm)</label>
            <input id="rainAmount" type="number" v-model="rain.amount" min="0" required />
          </div>
          <div>
            <label for="rainNotes">Observaciones</label>
            <textarea id="rainNotes" v-model="rain.notes"></textarea>
          </div>
          <button type="submit"> Guardar</button>
        </form>
      </section>

      <!-- Formulario nieve -->
      <section class="form-card">
        <h2>Nieve</h2>
        <form @submit.prevent="submitSnow">
          <div>
            <label for="snowDate">Fecha</label>
            <input id="snowDate" type="date" v-model="snow.date" required />
          </div>
          <div>
            <label for="snowDepth">Espesor (cm)</label>
            <input id="snowDepth" type="number" v-model="snow.depth" min="0" required />
          </div>
          <div>
            <label for="snowType">Tipo</label>
            <select id="snowType" v-model="snow.type">
              <option value="seca">Seca</option>
              <option value="húmeda">Húmeda</option>
              <option value="granizo">Granizo</option>
            </select>
          </div>
          <button type="submit"> Guardar </button>
        </form>
      </section>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive } from "vue";
import '../style.css';
export default defineComponent({
  name: "Precipitation",
  setup() {
    const rain = reactive({ date: "", amount: "", notes: "" });
    const snow = reactive({ date: "", depth: "", type: "seca" });

    const submitRain = () => {
      alert(`Lluvia registrada: ${rain.amount} mm en ${rain.date}`);
    };
    const submitSnow = () => {
      alert(`Nieve registrada: ${snow.depth} cm (${snow.type}) en ${snow.date}`);
    };

    return { rain, snow, submitRain, submitSnow };
  },
});
</script>

<style scoped>

</style>