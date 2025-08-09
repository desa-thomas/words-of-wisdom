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
    setLoadingQuote(true);
    console.log("loading..");

    fetchQuoteofday(setQuoteofday);
    fetchQuotes(setQuotes, setQuotesIndex);
	  }, []);

  //Hook used when data is loaded
  useEffect(() => {
    if (quotes && quoteofday) {
      setLoadingQuote(false);
    }
  }, [quotes, quoteofday]);

  //When quotes are done loading. (targets if 'quotes' was refetched)
  useEffect(() => {
    if (loadingQuote && quotes && quotes.length > 0) {
      console.log("'quotes' loaded");
      setLoadingQuote(false);
    }
  }, [quotes, quotesIndex, isQuoteofday]);

  //Only update localStorage index AFTERRRRRR quotesIndex state is updated
  useEffect(() => {
    localStorage.setItem("index", quotesIndex);

    //check this after setting local storage becuase function checks local storage
    if (quotes && quotesIndex >= quotes.length) {
      setLoadingQuote(true);
      fetchQuotes(setQuotes, setQuotesIndex);
    }
  }, [quotesIndex]);

  //button handler for random
  const randomButton = async () => {
    console.log("loading 'quotes'");

    //Switch to show random quote
    if (isQuoteofday) setIsQuoteofday(false);
    //only increment index if already showing random quote
    else setQuotesIndex(Number(quotesIndex) + 1);
  };

  const todayButton = async () => {
    setIsQuoteofday(true);
  };

  return (
    <div className="flex flex-col items-center w-screen h-screen bg-bgprimary justify-between">
      <div className="flex flex-col gap-10 items-center justify-center px-10 gap-5 h-full w-full max-w-6xl">
        {/* Title and date */}
        <div className="flex w-full">
          <h1 className="text-4xl sm:text-5xl font-semibold self-start gradient-text">
            Words of Wisdom
          </h1>
        </div>

        <QuoteCard
          quote={isQuoteofday ? quoteofday?.q : quotes[quotesIndex]?.q}
          author={isQuoteofday ? quoteofday?.a : quotes[quotesIndex]?.a}
          isQuoteofday={isQuoteofday}
          loadingQuote={loadingQuote}
        />

        {/* Buttons  */}
        <div className="flex gap-5 w-full max-w-lg justify-center">
          <Button
            text="Today's Wisdom"
            onclick={() => todayButton()}
            toggle={isQuoteofday}
            loadingQuote={loadingQuote}
          />
          <Button
            text="Random Wisdom"
            onclick={() => randomButton()}
            toggle={!isQuoteofday}
            loadingQuote={loadingQuote}
          />
        </div>
      </div>

      <footer className="w-full bg-bgsecondary flex flex-col p-5 border-t-1 border-borderprimary">
        <p>
          Developed with <span className="text-red-600">{"<3"}</span>
        </p>
        <p className="text-sm">
          Wisdom generously provided by{" "}
          <a
            className="hover:underline hover:text-primary decoration-accent"
            href="https://zenquotes.io/"
            target="_blank"
          >
            ZenQuotes API
          </a>
        </p>
      </footer>
    </div>
  );
}

export default Page;

function QuoteCard({ quote, author, isQuoteofday, loadingQuote }) {
  /**
   * Create Quote card component
   * quote 		- quote text
   * author 		- author of quote
   * isquoteofday 	- bool, whether it is the quote of day
   */
  return (
    <div className="flex flex-col w-full items-center gap-2">
      {/* Today's Wisdom or Random Wisdom */}
      <div className="self-start  items-end gap-2">
        <h1 className="text-2xl font-semibold">
          {" "}
          {isQuoteofday ? "Today's Wisdom" : "Random Wisdom"}{" "}
        </h1>

        <div className={`flex gap-2 text-primary`}>
          {isQuoteofday ? (
            <>
              <Calendar />
              {formatted_day}
            </>
          ) : (
            <>A wise person once said...</>
          )}
        </div>
      </div>

      {/* bordered card */}
      <div className="flex p-4 sm:p-6 gap-3 sm:gap-5 border-2 border-borderprimary border-sm w-full min-h-30 shadow-md shadow-accent rounded-lg bg-bgsecondary">
        <div className="self-start w-max h-max">
          <Quote size={24} />
        </div>

        {!loadingQuote ? (
          <div className="flex flex-col w-full gap-1">
            <div className="w-full self-start">
              <p className="text-xl w-full">{quote}</p>
            </div>
            {/* author, align it at the end  */}
            <p className="italic self-end"> - {author} </p>
          </div>
        ) : (
          <div className="w-full self-start text-xl blinking-text">
            Loading quotes...
          </div>
        )}
      </div>
    </div>
  );
}

function Button({ text, onclick, toggle, loadingQuote }) {
  return (
    <button
      disabled={loadingQuote}
      className={`border border-accent px-4 py-1 rounded-xl w-full disabled:opacity-30 ${
        !loadingQuote ? "hover:bg-accent hover:brightness-80" : ""
      } ${toggle ? " bg-accent" : ""}`}
      onClick={onclick}
    >
      {text}
    </button>
  );
}
