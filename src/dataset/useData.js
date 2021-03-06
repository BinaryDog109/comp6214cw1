import { useState, useEffect } from "react";
import { csv } from "d3";

const industryTradingStatusDataCsvUrl = "./sparql/query-result.csv";

const ontURI =
  "http://www.semanticweb.org/tianyiyuan/ontologies/comp6214/coursework1#";

export const useData = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    async function fetchData() {
      const industryTradingStatusData = await csv(
        industryTradingStatusDataCsvUrl
      );
      industryTradingStatusData.ontURI = ontURI;
      setData(industryTradingStatusData);
    }
    fetchData();
  }, []);

  return data;
};
