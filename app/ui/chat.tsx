import Markdown from "react-markdown";
import {PromptResponse} from "@/app/page";

function Conversation({ conversation } : {
  conversation: PromptResponse
}) {
  return (
      <div className="flex flex-col gap-4">
        <div className="self-end max-w-2/3 py-2 px-4 border border-[#dadce0] rounded-3xl rounded-tr-md bg-white/50 backdrop-blur-xs">
          { conversation.prompt }
        </div>
        {conversation.response && <div className="py-2 px-4 border border-[#dadce0] rounded-3xl rounded-tl-md bg-white/50 backdrop-blur-xs">
          <Markdown>
            {conversation.response}
          </Markdown>
        </div>}
      </div>
  )
}

export default function Chat({ chat } : {
  chat: PromptResponse[]
}) {
  return (
      (chat.length > 0 && <div className="w-full mt-5 p-2 flex flex-col gap-10">
        {chat.map(conv => <Conversation key={conv.key} conversation={conv}/>)}
      </div>)
  )
}