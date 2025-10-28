'use client'

import {FormEvent, useState} from "react";
import Markdown from "react-markdown";
import {PaperAirplaneIcon} from "@heroicons/react/24/outline";


export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  // State to manage loading
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setAiResponse('');

    const formData = new FormData(e.currentTarget);
    const prompt = formData.get('prompt') as string;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body
          .pipeThrough(new TextDecoderStream())
          .getReader();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        setAiResponse((prev) => prev + value);
      }
    } catch (error) {
      console.error('Error fetching stream:', error);
      setAiResponse('Error: Could not get a response.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-20 flex flex-col">
      <h1 className={`text-2xl font-bold flex justify-center m-2 p-10`}>
        Let's plan your next trip with us!
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
              id="input"
              name="prompt"
              type="text"
              value={prompt}
              placeholder="Tell us more about your trip"
              className="block border rounded-full border-gray-200 w-full h-10 py-2 pl-10 outline-2 placeholder:text-gray-500"
              required
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isLoading}
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2  h-[18px] w-[18px] hover:cursor-pointer">
            <PaperAirplaneIcon/>
          </button>
        </div>
      </form>
      {isLoading && aiResponse.length === 0 && <div>Loading...</div>}
      {aiResponse && (
          <div className="w-full mt-5 p-5 border border-gray-300 rounded-lg">
            <Markdown>
              {aiResponse}
            </Markdown>
          </div>
      )}
    </div>
  );
}
