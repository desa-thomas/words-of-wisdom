
export async function  fetchdata  (endpoint)  {
      /** fetch data from endpoint. The two endpoints are:
       * - quoteofday
       * - quotes
       */

      if (endpoint != "quoteofday" && endpoint != "quotes") {
        throw new Error(
          `Invalid endpoint: ${endpoint}. Must be 'quoteofday' or 'quotes'`
        );
      }

      const url = `${proxy_url}/api/${endpoint}`;

      try {
		setLoading(true); 
        const res = await fetch(url);

        if (!res.ok) {
          throw new Error(`Error: Status ${res.status}`);
        }

        const json = await res.json();
        console.log(`${res.status}: ${json}`);
      } catch (error) {
        console.error(error.message);
        return null;
      }
    };

    const quoteofday = localStorage.getItem("quoteofday", null);
    const quotes = localStorage.getItem("quotes", null);

    //If data is not stored in local cache get it from server
	//TODO check if data is expired
    if (quoteofday == null) {
      fetchdata("quoteofday");
    }

    if (quotes == null) {
      fetchdata("quotes");
    }