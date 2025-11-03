import "leaflet/dist/leaflet.css";
import Home from "./components/Home";
import { Routes, Route} from "react-router-dom";
import Login from "./components/Login/Login";
import { UserProvider } from "./context/UserContext";
import Dashboard from "./components/Dashboard/Dashboard";
import ShowReport from "./components/Dashboard/Report/ShowReport";
import ViewManagementUsers from "./components/Dashboard/User/ViewManagementUsers";
import FormEditReport from "./components/Dashboard/Report/FormEditReport";
import FormAddUser from "./components/Dashboard/User/FormAddUser";
import FormAddZona from "./components/Dashboard/Zona/FormAddZona";
import ShowHistograma from "./components/histograma/ShowHistograma";
import HistogramaLluvia from "./components/histograma/HistogramaLluvia";
import HistogramaNieve from "./components/histograma/HistogramaNieve";
import HistogramaCaudalimetro from "./components/histograma/HistogramaCaudalimetro";
import HeatMapView from "./components/MapHeatView";
import FormAddSite from "./components/Dashboard/site/FormAddSite";
import ShowCharts from "./components/Dashboard/Charts/showCharts";
import TemperatureConverter from "./components/Temperature/TemperatureConverter";
import ClimateDataViewer from "./components/Climate/ClimateDataViewer";
import ReverseGeocoder from "./components/Geocoding/ReverseGeocoder";
import CurrentWeather from "./components/Weather/CurrentWeather";

export default function App() {
  return (
    <div>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/dashboard/administration/report" element={<ShowReport/>} />
          <Route path="/dashboard/administration/report/edit" element={<FormEditReport/>} />
          <Route path="/dashboard/administration/user" element={<ViewManagementUsers/>} />
          <Route path="/dashboard/administration/user/add" element={<FormAddUser/>} />
          <Route path="/dashboard/Zona/FormAddZona.tsx" element={<FormAddZona />} />
          <Route path="/dashboard/site/add" element={<FormAddSite />} />
          <Route path="/estadisticas" element={<ShowCharts />} />
          <Route path="/histograma" element={<ShowHistograma />} />
          <Route path="/histograma/lluvia" element={<HistogramaLluvia />} />
          <Route path="/histograma/nieve" element={<HistogramaNieve />} />
          <Route path="/histograma/caudalimetro" element={<HistogramaCaudalimetro />} />
          <Route path="/components/MapHeatView.tsx" element={<HeatMapView />} />
          <Route path="/tools/temperature" element={<TemperatureConverter />} />
          <Route path="/tools/climate" element={<ClimateDataViewer />} />
          <Route path="/tools/geocoding" element={<ReverseGeocoder />} />
          <Route path="/tools/weather" element={<CurrentWeather />} />
        </Routes>
      </UserProvider>
    </div>
  );
}