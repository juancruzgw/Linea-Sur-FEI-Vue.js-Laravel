import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

const useNavegation = () => {  
  const {handleSelectReport} = useUserContext();
  
  const navigate = useNavigate();

  const goHome = () => navigate("/")

  const goAdminUi = () => navigate("/dashboard")

  const goLogin = () => navigate("/login") 

  const goReports = () => navigate("/dashboard/administration/report") 

  const goConfigUsers = () => navigate("/dashboard/administration/user")

  const goAddZona = () => navigate("/dashboard/Zona/FormAddZona.tsx")

  const goHeatMap = () => navigate("/components/MapHeatView.tsx")

  const goAHistograma = () => navigate("/histograma")

   const goAddSite = () => navigate("/dashboard/site/add");

  const goEstadisticas = () => navigate("/estadisticas")

  const goTemperatureConverter = () => navigate("/tools/temperature")

  const goClimateData = () => navigate("/tools/climate")

  const goGeocoding = () => navigate("/tools/geocoding")

  const goWeather = () => navigate("/tools/weather")

  const goEditReport = (report: any) => {
    handleSelectReport(report)
    navigate("/dashboard/administration/report/edit")
  } 

  const goAddUser = () => {
    navigate("/dashboard/administration/user/add")
  }
   const goBack = () => navigate(-1);


    return (
        {
            goHome , goAdminUi , goLogin , goReports , goConfigUsers , goEditReport , goAddUser , goBack, goAddZona , goAHistograma, goHeatMap, goAddSite, goEstadisticas, goTemperatureConverter, goClimateData, goGeocoding, goWeather
        }
    )
}

export default useNavegation