'use client'

import {FormEvent, useEffect, useRef, useState} from "react";
import Form from "@/app/ui/form";
import Loading from "@/app/ui/loading";
import Chat from "@/app/ui/chat";
import {clsx} from "clsx";

export type PromptResponse = {
  key: string,
  prompt?: string;
  response?: string;
};

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState<PromptResponse[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatRef = useRef<PromptResponse[]>([])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse('');
    setPrompt('')

    const formData = new FormData(e.currentTarget);
    const prompt = formData.get('prompt') as string;

    setChat((prev) => {
      const next = [...prev, { key: new Date().toISOString(), prompt, response: "" }];
      chatRef.current = next;
      return next;
    });

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

      let fullResponse = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        fullResponse += value;
        setResponse(fullResponse);

        setChat((prev) => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          updated[lastIndex] = { ...updated[lastIndex], response: fullResponse };
          chatRef.current = updated;
          return updated;
        });
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
    <div>
      <div className="p-5 md:px-20 md:py-10 w-full h-screen flex flex-col justify-center items-center">
        <div className={clsx(
            'w-xs md:w-2xl h-screen flex flex-col',
            {
              'justify-center items-center': response.length === 0,
              'justify-start items-start': response.length > 0,
            }
        )}>
          {response.length === 0 && <h1 className={`text-xl md:text-2xl font-bold text-center m-2 p-5 md:p-10`}>
            Let&#39;s plan your next trip with us!
          </h1>}
          <Chat chat={chat}/>
        </div>
      </div>
      <div className="sticky bottom-8 flex flex-col items-center">
        <div className="w-1/2">
          <div className="h-5 pb-10">
            {isLoading && response.length === 0 && <Loading/>}
          </div>
          <Form submitAction={handleSubmit} prompt={prompt} setPromptAction={setPrompt} textareaRef={textareaRef}/>
        </div>
      </div>
    </div>
  );
}
