
export default function PriceCard({plan , activated}: { plan : boolean , activated : boolean}){
    return (
      <div className="w-72 border mt-3 md:mt-0 flex justify-between flex-col rounded-md bg-[#CCFFFF] font-mono p-5 mx-2">
        <div>
          <h1 className="text-3xl font-bold ">{plan ? "Paid" : "Free"}</h1>
          <p className="text-xl">{plan ? "Basic+Pro Plan" : "Get started for free"}</p>
        </div>
        <div>
          <span className="text-4xl font-bold">{plan ? "$5 " : "$0 "} </span> /months
        </div>
        <div>
            <ul>
              <li className="flex gap-x-2 items-center">
               <span> <CheckIcon className="w-4 h-4 fill-primary"/></span> 
                {plan ? "Unlimited flashcards creation" : "50 flashcards/week"}
              </li>
              <li  className="flex gap-x-2 items-center">
                <span>
                  <CheckIcon className="w-4 h-4 fill-primary"/> 
                </span>
                Basic study tools
              </li>
              <li  className="flex gap-x-2 items-center">
                <span>
                  <CheckIcon className="w-4 h-4 fill-primary"/> 
                </span>
                Limited device synchronization
              </li>
              <li  className="flex gap-x-2 items-center">
                <span>
                  {!plan ? <XIcon className="w-4 h-4 fill-primary"/> : <CheckIcon className="w-4 h-4 fill-primary"/>}
                </span>
                advanced analytics
              </li>
              
              <li  className="flex gap-x-2 items-center">
                <span>
                {!plan ? <XIcon className="w-4 h-4 fill-primary"/> : <CheckIcon className="w-4 h-4 fill-primary"/>}
                </span>
                collaborative features
              </li>
            </ul>
          </div>
          <div className="w-full flex justify-center mt-4 items-center">
            <button className={`bg-[#0F1438] ${activated ? "bg-[#0F1438]/50" : null} text-[#CCFFFF] p-2 rounded-md`}>{activated ? "Activated" : "Activate"}</button>
          </div>
      </div>
    )
  }

  

  
function XIcon(props : any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    )
  }
  
  
  function CheckIcon(props : any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    )
  }