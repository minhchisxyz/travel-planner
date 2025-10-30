'use client'

import {FormEvent, useEffect, useRef, useState} from "react";
import Form from "@/app/ui/form";
import Loading from "@/app/ui/loading";
import Chat from "@/app/ui/chat";

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
  const responseRef = useRef<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse('');
    setPrompt('')
    responseRef.current = true;
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
    <div className="static">
      {!responseRef.current && <div className={`absolute text-xl md:text-2xl font-bold text-center flex flex-col items-center justify-center w-full h-screen`}>
        <span className={`pt-25`}>Let&#39;s plan your next trip with us!</span>
      </div>}
      <div className="p-5 md:px-20 w-full h-[90vh] overflow-y-scroll flex flex-col items-center">
        <div className="w-xs md:w-2xl">
          <Chat chat={chat}/>
        </div>
      </div>
      <div className="sticky bottom-8 flex flex-col items-center">
        <div className="w-2/3 md:w-1/2">
          <div className="h-5 pb-10">
            {isLoading && response.length === 0 && <Loading/>}
          </div>
          <Form submitAction={handleSubmit} prompt={prompt} setPromptAction={setPrompt} textareaRef={textareaRef}/>
        </div>
      </div>
    </div>
  );
}
