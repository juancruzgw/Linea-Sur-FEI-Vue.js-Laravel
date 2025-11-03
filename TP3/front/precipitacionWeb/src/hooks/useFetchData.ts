import { useEffect, useState } from "react";

export const useFetchData = (fetchFunction) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetchFunction();
        setData(response);
      } catch (err) {
        setError(err.message || "Error al obtener los datos");
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [fetchFunction]);

  return { data, loading, error };
};
