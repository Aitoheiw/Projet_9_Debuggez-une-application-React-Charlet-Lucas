import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch("/events.json");
    return json.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const getData = useCallback(async () => {
    try {
      setData(await api.loadData());
    } catch (err) {
      setError(err);
    }
  }, []);
  useEffect(() => {
    if (data) return;
    getData();
  });

  console.log("✅ EVENTS", data?.events);
  console.log(
    "✅ LAST CALCULATED",
    [...(data?.events || [])].sort((a, b) => {
      const monthsMap = {
        janvier: 0,
        février: 1,
        mars: 2,
        avril: 3,
        mai: 4,
        juin: 5,
        juillet: 6,
        août: 7,
        septembre: 8,
        octobre: 9,
        novembre: 10,
        décembre: 11,
      };

      const getIndex = (month) => monthsMap[month?.trim().toLowerCase()] ?? -1;

      return getIndex(b.month) - getIndex(a.month);
    })[0]
  );

  return (
    <DataContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        data,
        error,
        last:
          [...(data?.events || [])].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          )[0] || null,
        // Fix :  Ajout de `last` pour permettre d'accéder à la dernière prestation dans la page home
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useData = () => useContext(DataContext);

export default DataContext;
