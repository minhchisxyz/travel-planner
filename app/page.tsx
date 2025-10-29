'use client'

import {FormEvent, useEffect, useRef, useState} from "react";
import Markdown from "react-markdown";
import Form from "@/app/ui/form";
import Loading from "@/app/ui/loading";


export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse('');
    setPrompt('')

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

        setResponse((prev) => prev + value);
      }

    } catch (error) {
      console.error('Error fetching stream:', error);
      setResponse('Error: Could not get a response.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto"; // reset
    textarea.style.height = textarea.scrollHeight + "px"; // grow with content
  }, [prompt]);

  return (
    <div className="p-5 md:p-20 w-full flex flex-col justify-center items-center">
      <div className="w-xs md:w-2xl">
        <h1 className={`text-xl md:text-2xl font-bold text-center m-2 p-5 md:p-10`}>
          Let&#39;s plan your next trip with us!
        </h1>
        <Form submitAction={handleSubmit} prompt={prompt} setPromptAction={setPrompt} textareaRef={textareaRef}/>
        {isLoading && response.length === 0 && <Loading/>}
        {response && (
            <div className="w-full mt-5 p-2 flex flex-col">
              <Markdown>
                {response}
              </Markdown>
            </div>
        )}
      </div>
    </div>
  );
}
