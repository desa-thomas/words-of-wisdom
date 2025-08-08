import { useEffect, useState } from "react";
import { Quote } from "lucide-react";

const test_quote =
  " A Powerful Quote of the Day to Keep You Inspired. Navigate life's twists and challenges with the inspiration of a powerful Quote of the Day. Each morning, a carefully chosen quote can shift your mindset, providing motivation, wisdom, and a positive outlook. More than mere words, these quotes inspire dreams, challenge perspectives, and drive success. Cultivating a daily habit of reading an impactful Quotes of the Day can be a simple yet profound step towards personal growth and achievement. Embrace a new perspective today!";

const today = new Date();

const formatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long", // "Thursday"
  month: "short", // "Aug"
  day: "numeric", // 7
  year: "numeric", // 2025
});

const formatted_day = formatter.format(today);

function Page() {
  /**
   * Main page component. Will contain entire application
   */

  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(null);

 /** Hook to get API data */
  useEffect(() => {
    const fetchdata = async (url) => {
      /** Fetch data from API url */
      try {
        const res = await fetch(url);

        if (!res.ok) {
          throw new Error(`Error: Status ${res.status}`);
        }

        const json = await res.json();
        console.lod(`${res.status}: ${json}`);
      } catch (error) {
        console.error(error.message);
        return null;
      }
      return json;
    };

    const quoteofday = localStorage.getItem("quoteofday", null);
    const quotes = localStorage.getItem("quotes", null);

    if (quoteofday == null) {
      const json = fetchdata(quoteofdayURL);
      localStorage;
    }
  }, []);

  return (
    <div className="flex flex-col items-center w-screen h-screen bg-bgprimary justify-between">
      <div className="flex flex-col gap-10 items-center justify-center px-10 gap-5 h-full">
        {/* Title and date */}
        <div className="flex flex-col items-center">
          <h1 className="text-5xl font-semibold">Words of Wisdom</h1>
          <p>{formatted_day}</p>
        </div>

        <QuoteCard
          quote={test_quote}
          author={"A wise man"}
          isquoteofday={true}
        />

        {/* Buttons  */}
        <div className="flex gap-5 w-full max-w-lg justify-center">
          <Button text="Today's Wisdom" onclick={() => console.log("bruh")} />
          <Button text="Random" onclick={() => console.log("bruh")} />
        </div>
      </div>

      <footer className="w-full bg-bgprimary flex flex-col p-5 border-t-1 border-borderprimary">
        <p>{"Developed with <3"}</p>
		<p className="text-sm">Wisdom generously provided by <a href="https://zenquotes.io/" target="_blank">ZenQuotes API</a></p>
      </footer>
    </div>
  );
}

export default Page;

function QuoteCard({ quote, author, isquoteofday }) {
  /**
   * Create Quote card component
   * quote 		- quote text
   * author 		- author of quote
   * isquoteofday 	- bool, whether it is the quote of day
   */
  return (
    <div className="flex flex-col p-6 gap-5 border border-borderprimary border-sm w-full max-w-5xl rounded-lg">
      {/* Quote of the day title if it is the quote of the day */}
      {isquoteofday && <h1 className="text-3xl font-medium"> Quote of day</h1>}

      <div className="flex flex-col gap-1">
        {/* Quote icon with the actual quote text */}
        <div className="flex gap-3 items-center">
          <div className="self-start w-max h-max">
            <Quote size={32} />
          </div>
          <div>
            <p className="text-xl w-full">{quote}</p>
          </div>
        </div>
        {/* author, align it at the end  */}
        <p className="italic self-end"> - {author} </p>
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
