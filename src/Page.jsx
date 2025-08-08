import { useEffect, useState } from "react";
import { Calendar, Quote, Truck } from "lucide-react";

import { fetchQuoteofday, fetchQuotes } from "./api";

/** Todays date formatted */
const today = new Date();
const formatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long", // "Thursday"
  month: "short", // "Aug"
  day: "numeric", // 7
  year: "numeric", // 2025
});
const formatted_day = formatter.format(today);

/**
 * Main page component
 *
 * @return {*}
 */
function Page() {
  //State variables
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingQuote, setLoadingQuote] = useState(false);

  const [quoteofday, setQuoteofday] = useState(null);
  const [quotes, setQuotes] = useState(null);
  const [quotesIndex, setQuotesIndex] = useState(0); // index for random quotes arr

  const [isQuoteofday, setIsQuoteofday] = useState(true); //True if displaying quote of day, false if displaying random quote

  //Hook to get API data
  useEffect(() => {
    setLoadingPage(true);
    console.log("loading..");
    fetchQuoteofday(setQuoteofday);
    fetchQuotes(setQuotes, setQuotesIndex);
  }, []);

  //Hook used when data is loaded
  useEffect(() => {
    if (quotes && quoteofday) {
      setLoadingPage(false);
    }
  }, [quotes, quoteofday]);

  //When quotes are done loading. (targets if 'quotes' was refetched)
  useEffect(() => {
    if (loadingQuote && quotes && quotes.length > 0) {
      console.log("'quotes' loaded");
      setLoadingQuote(false);
    }
  }, [quotes]);

  //Only update localStorage index AFTERRRRRR quotesIndex state is updated
  useEffect(()=> {
	localStorage.setItem("index", quotesIndex);

	//check this after setting local storage becuase function checks local storage 
	if(quotes && quotesIndex >= quotes.length)
	{
		fetchQuotes(setQuotes, setQuotesIndex); 
	}
	
  }, [quotesIndex])

  
  //button handler for random
  const randomButton = async () => {
    console.log("loading 'quotes'");
    setLoadingQuote(true);

    //Switch to show random quote
    if (isQuoteofday) 
		setIsQuoteofday(false);
	
    //only increment index if already showing random quote
    else 
		setQuotesIndex(Number(quotesIndex) + 1);
  };

  const todayButton = async () => {
	setIsQuoteofday(true); 
  }

  if (loadingPage)
    return (
      <div className="flex w-screen h-screen bg-bgprimary items-center justify-center">
        <p>loading...</p>
      </div>
    );
  else
    return (
      <div className="flex flex-col items-center w-screen h-screen bg-bgprimary justify-between">
        <div className="flex flex-col gap-10 items-center justify-center px-10 gap-5 h-full w-full">
          {/* Title and date */}
          <div className="flex flex-col items-center">
            <h1 className="text-5xl font-semibold">Words of Wisdom</h1>
          </div>

          <QuoteCard
            quote={isQuoteofday ? quoteofday?.q : quotes[quotesIndex]?.q}
            author={isQuoteofday ? quoteofday?.a : quotes[quotesIndex]?.a}
			isQuoteofday={isQuoteofday}
			loadingQuote={loadingQuote}
          />

          {/* Buttons  */}
          <div className="flex gap-5 w-full max-w-lg justify-center">
            <Button text="Today's Wisdom" onclick={() => todayButton()} />
            <Button text="Random Wisdom" onclick={() => randomButton()} />
          </div>
        </div>

        <footer className="w-full bg-bgprimary flex flex-col p-5 border-t-1 border-borderprimary">
          <p>{"Developed with <3"}</p>
          <p className="text-sm">
            Wisdom generously provided by{" "}
            <a href="https://zenquotes.io/" target="_blank">
              ZenQuotes API
            </a>
          </p>
        </footer>
      </div>
    );
}

export default Page;

function QuoteCard({ quote, author, isQuoteofday}) {
  /**
   * Create Quote card component
   * quote 		- quote text
   * author 		- author of quote
   * isquoteofday 	- bool, whether it is the quote of day
   */
  return (
    <div className="flex flex-col w-full items-center max-w-5xl gap-2">
      {/* Today's Wisdom or Random Wisdom */}
      <div className="self-start  items-end gap-2">
        <h1 className="text-2xl"> {isQuoteofday ? "Today's Wisdom" : "Random Wisdom"} </h1>
        {isQuoteofday && <div className="flex gap-2">
          <Calendar />
          {formatted_day}
        </div>}
      </div>

      <div className="flex flex-col p-6 gap-5 border border-borderprimary border-sm w-full rounded-lg">
        <div className="flex flex-col ">
          {/* Quote icon with the actual quote text */}
          <div className="flex gap-3 items-center">
            <div className="self-start w-max h-max">
              <Quote size={32} />
            </div>
            <div className="w-full">
              <p className="text-xl w-full">{quote}</p>
            </div>
          </div>
          {/* author, align it at the end  */}
          <p className="italic self-end"> - {author} </p>
        </div>
      </div>
    </div>
  );
}

function Button({ text, onclick }) {
  return (
    <button
      className="border border-borderprimary px-4 py-1 rounded-xl w-full hover:bg-primary"
      onClick={onclick}
    >
      {text}
    </button>
  );
}
