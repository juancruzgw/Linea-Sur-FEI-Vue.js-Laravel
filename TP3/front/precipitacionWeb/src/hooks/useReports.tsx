import { useEffect , useState} from "react";
import { getReportes } from "../services/reportService";

const useReports = () => {
    const [reports, setReports] = useState<any[]>([]);

    useEffect(() => {
        
        const fetchData = async () => {
            const data = await getReportes();
            setReports(data);
        };
    
    fetchData();
    }, []);
      
    return(reports)
}

export default useReports
