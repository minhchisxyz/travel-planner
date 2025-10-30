
export default function Loading() {
  return (
      <div className="text-xs py-2 px-4 md:text-sm flex flex-row gap-2 items-center">
        <div className="
            w-6
            h-6
            rounded-full
            animate-spin
            border-2 border-solid border-blue-700 border-t-transparent
          "></div>
        <span className="">Wait a minute, I&#39;m thinking...</span>
      </div>
  )
}
