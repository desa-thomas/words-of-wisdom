/**
 * Functions for getting data from proxy server / zenquotes API
 * 
 */

//Get proxy url based on environment variable (developmend is localhost, production is ... whatever it will be)
const proxy_url = import.meta.env.VITE_PROXY_URL;

/**
 *
 *
 * @export
 * @param {string} endpoint - api endpoint. quoteofday or quotes
 * @param {*} setLoading    - React state setter for loading
 */
export async function fetchdata(endpoint) {
  
  //Throw error if endpoint is invalid
  if (endpoint != "quoteofday" && endpoint != "quotes") {
    throw new Error(
      `Invalid endpoint: ${endpoint}. Must be 'quoteofday' or 'quotes'`
    );
  }

  const url = `${proxy_url}/api/${endpoint}`;
  console.log(`Fetching from: ${url}`)
  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Error: Status ${res.status}`);
    }

    const json = await res.json();
    console.log(`${res.status}: ${json}`);

    return json

  } catch (error) {
    console.error(error.message);
    return null
  }
}