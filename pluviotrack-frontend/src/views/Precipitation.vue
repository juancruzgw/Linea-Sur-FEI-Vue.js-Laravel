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
          <button type="submit">Guardar</button>
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
            <input id="snowType" type="text" v-model="snow.type" placeholder="Ej: seca, húmeda..." />
          </div>
          <button type="submit">Guardar</button>
        </form>
      </section>
    </div>

    <!-- 📊 Registros recientes -->
    <div class="records-container">
      <h2>Registros recientes</h2>
      <div v-if="loading" class="records-loading">Cargando registros...</div>
      <div v-else class="records-list-wrapper">
      <div v-if="records.length === 0" class="records-empty">No hay registros.</div>
      <ul v-else class="records-list">
        <li v-for="(record, idx) in records" :key="idx" class="record-item">
        <div v-if="record.type === 'lluvia'" class="record-content lluvia-record">
          <strong>Lluvia</strong> - Fecha: {{ record.fecha }} |
          Cantidad: {{ record.cantidad }} mm |
          Observaciones: {{ record.observacion }}
        </div>
        <div v-else-if="record.type === 'nieve'" class="record-content nieve-record">
          <strong>Nieve</strong> - Fecha: {{ record.fecha }} |
          Espesor: {{ record.cantidad }} cm |
          Tipo: {{ record.observacion }}
        </div>
        </li>
      </ul>
      </div>
    </div>
    </div>

</template>

<script>
import { defineComponent, reactive, ref, onMounted } from "vue";

export default defineComponent({
  name: "Precipitation",
  setup() {
    const rain = reactive({ date: "", amount: "", notes: "" });
    const snow = reactive({ date: "", depth: "", type: "" });

    const records = ref([]);
    const loading = ref(false);

    // 🔹 Función para obtener los registros
    const fetchRecords = async () => {
      loading.value = true;
      try {
        const rainRes = await fetch("http://127.0.0.1:8000/api/lluvia");
        const snowRes = await fetch("http://127.0.0.1:8000/api/nieve");

        const rainData = await rainRes.json();
        const snowData = await snowRes.json();

        // Agregamos un campo 'type' para diferenciarlos en el template
        const formattedRain = rainData.map(r => ({ ...r, type: "lluvia" }));
        const formattedSnow = snowData.map(r => ({ ...r, type: "nieve" }));

        records.value = [...formattedRain, ...formattedSnow];
      } catch (error) {
        console.error("Error al obtener registros:", error);
      } finally {
        loading.value = false;
      }
    };

    // 🔹 Guardar lluvia
    const submitRain = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/lluvia", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fecha: rain.date,
            cantidad: rain.amount,
            observacion: rain.notes,
          }),
        });
        if (!response.ok) throw new Error("Error al guardar la lluvia");
        alert("Lluvia registrada correctamente");
        fetchRecords(); // Actualizar lista automáticamente
      } catch (e) {
        alert(e.message);
      }
    };

    // 🔹 Guardar nieve
    const submitSnow = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/nieve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fecha: snow.date,
            cantidad: snow.depth,
            observacion: snow.type,
          }),
        });
        if (!response.ok) throw new Error("Error al guardar la nieve");
        alert("Nieve registrada correctamente");
        fetchRecords(); // Actualizar lista automáticamente
      } catch (e) {
        alert(e.message);
      }
    };

    // 🔹 Cargar registros al montar el componente
    onMounted(() => {
      fetchRecords();
    });

    return { rain, snow, submitRain, submitSnow, records, loading };
  },
});
</script>
