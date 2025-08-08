/**
 * Functions for getting data from proxy server or LocalStorage
 *
 */


//change this when server is hosted elsewhere
const proxy_url = "http://localhost:3000"


/**
 * Function to fetch all data. Will either get data from server or cache depending on
 * existence and expiry date
 *
 * @export
 * @param {*} stored_quoteofday - Stored values from localStorage (object or null)
 * @param {*} stored_quotes     - 
 * @param {*} setQuotes         - Setter functions
 * @param {*} setQuoteofday     - 
 * @param {*} setQuotesIndex    - 
 */
export async function fetchall (setQuotes, setQuoteofday, setQuotesIndex)  {
  	//check localStorage. local storage only stores strings, so parse
	const stored_quoteofday = JSON.parse(localStorage.getItem("quoteofday_json", null));
    const stored_timestamp = localStorage.getItem("timestamp", null); 
	const stored_quotes = JSON.parse(localStorage.getItem("quotes_json", null));
    const stored_quotes_index = localStorage.getItem("index", null); 

    //get quote of day from proxy server if not in local storage, or if quote is expired
  if (
    !stored_quoteofday ||
    not_today(stored_timestamp)
  ) {

    const quoteofday_json = await fetchdata("quoteofday");

    if (quoteofday_json) {
      console.log("quoteofday retrieved from server");
      setQuoteofday(quoteofday_json[0]);

      //Cache quote of day
      localStorage.setItem("quoteofday_json", JSON.stringify(quoteofday_json[0]))
      localStorage.setItem("timestamp", Date())
    }
    //Problem fetching quote
    else setQuoteofday({"q": "Trouble fetching quote of day. Try again later", "a": "fly on the wall"});
  } 
  //If stored in cache && not expired
  else {
    console.log("quoteofday retrieved from cache")
    setQuoteofday(stored_quoteofday)
  }

  //If there are no stored random quotes, or they have all been used
  if(!stored_quotes || stored_quotes_index >= stored_quotes.length)
  {
    const quotes_json = await fetchdata("quotes"); 

    if(quotes_json)
    {
        console.log("quotes retrieved from server");
        setQuotes(quotes_json); 
        setQuotesIndex(0); 
        localStorage.setItem("quotes_json", JSON.stringify(quotes_json))
        localStorage.setItem("index", 0); 
    }
    else 
    {
        setQuotes([{"q": "Trouble fetching random quote :/. Try again later"}])
        setQuotesIndex(0); 
    }
  }
  //get quotes from cache
  else{
    console.log("quotes retrieved from cache")
    setQuotes(stored_quotes);
    setQuotesIndex(stored_quotes_index); 
  }
}

/**
 *  Fetch data from server.
 * 
 * @param {string} endpoint - api endpoint. quoteofday or quotes
 * @param {*} setLoading    - React state setter for loading
 */
async function fetchdata(endpoint) {
  //Throw error if endpoint is invalid
  if (endpoint != "quoteofday" && endpoint != "quotes") {
    throw new Error(
      `Invalid endpoint: ${endpoint}. Must be 'quoteofday' or 'quotes'`
    );
  }

  const url = `${proxy_url}/api/${endpoint}`;
  console.log(`Fetching from: ${url}`);
  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Error: Status ${res.status}`);
    }

    const json = await res.json();
    console.log(`${res.status}: `);
    console.log(json)

    return json;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

/**
 * Check if timestamp is not today (calendar date)
 *
 * @export
 * @param {Date} timestamp
 * @return {boolean}
 */
function not_today(timestamp) {
  if (timestamp == null) {
    console.error("notToday: Timestamp cannot be null");
    return false; 
  }
  const inputDate = new Date(timestamp);
  const today = new Date();

  return (
    inputDate.getFullYear() !== today.getFullYear() ||
    inputDate.getMonth() !== today.getMonth() ||
    inputDate.getDate() !== today.getDate()
  );
}


// export function random_q