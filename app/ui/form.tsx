'use client'

import {PaperAirplaneIcon} from "@heroicons/react/24/outline";
import {Dispatch, FormEvent, RefObject, SetStateAction} from "react";

export default function Form({ submitAction, textareaRef, prompt, setPromptAction }: {
  submitAction: (e: FormEvent<HTMLFormElement>) => Promise<void>,
  textareaRef: RefObject<HTMLTextAreaElement | null>,
  prompt: string,
  setPromptAction: Dispatch<SetStateAction<string>>
}) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = (e.currentTarget as HTMLTextAreaElement).form as HTMLFormElement | null;
      if (form) {
        if (typeof (form as any).requestSubmit === "function") {
          (form as any).requestSubmit();
        } else {
          form.submit();
        }
      }
    }
  };

  return (
      <form onSubmit={submitAction}>
        <div className="flex flex-row border border-[#dadce0] rounded-3xl shadow-[2px_2px_2px_2px_#F0EBEB] inset-shadow-[2px_2px_#FAFAFA]">
          <textarea
              id="prompt"
              name="prompt"
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPromptAction(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tell us more about your trip"
              rows={1}
              required
              className="w-full px-4 py-1 resize-none overflow-hidden
                 placeholder:text-gray-500 focus:outline-none text-sm md:text-lg"
          />
          <div className="basis-10 flex justify-center items-center">
            <button type="submit" className="h-[18px] w-[18px] hover:cursor-pointer">
              <PaperAirplaneIcon/>
            </button>
          </div>
        </div>
      </form>
  )
}