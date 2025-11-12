export default function PriceCard({plan , activated}: { plan : boolean , activated : boolean}){
    return (
      <div className="w-full h-full flex flex-col min-h-[480px]">
        {/* Header - Fixed height */}
        <div className="mb-4 min-h-[80px]">
          <div className="h-6 mb-2">
            {plan && (
              <div className="inline-block px-2 py-0.5 rounded-full bg-gradient-to-r from-[#2B74AB]/30 to-[#265973]/30 border border-[#CCFFFF]/20">
                <span className="text-[10px] font-bold text-[#CCFFFF]">MOST POPULAR</span>
              </div>
            )}
          </div>
          <h3 className="text-xl font-bold text-white mb-1">
            {plan ? "Professional" : "Starter"}
          </h3>
          <p className="text-gray-400 text-sm">
            {plan ? "For serious learners" : "Perfect for trying out"}
          </p>
        </div>

        {/* Price - Fixed height */}
        <div className="mb-4 min-h-[72px]">
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-bold text-white">{plan ? "$5" : "$0"}</span>
            <span className="text-gray-400 text-sm">/month</span>
          </div>
          <div className="h-5 mt-1.5">
            {plan && (
              <p className="text-xs text-[#CCFFFF]">Save 20% with annual billing</p>
            )}
          </div>
        </div>

        {/* Features - Flexible height */}
        <ul className="space-y-2 mb-6 flex-grow">
          <li className="flex items-start gap-2">
            <CheckIcon className="w-4 h-4 text-[#CCFFFF] flex-shrink-0 mt-0.5"/>
            <span className="text-gray-300 text-xs">
              {plan ? "Unlimited flashcards" : "50 flashcards/week"}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckIcon className="w-4 h-4 text-[#CCFFFF] flex-shrink-0 mt-0.5"/>
            <span className="text-gray-300 text-xs">
              {plan ? "Advanced AI generation" : "Basic AI generation"}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckIcon className="w-4 h-4 text-[#CCFFFF] flex-shrink-0 mt-0.5"/>
            <span className="text-gray-300 text-xs">
              {plan ? "Unlimited sets" : "Save up to 10 sets"}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckIcon className="w-4 h-4 text-[#CCFFFF] flex-shrink-0 mt-0.5"/>
            <span className="text-gray-300 text-xs">Study mode</span>
          </li>
          <li className="flex items-start gap-2">
            {plan ? (
              <CheckIcon className="w-4 h-4 text-[#CCFFFF] flex-shrink-0 mt-0.5"/>
            ) : (
              <XIcon className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5"/>
            )}
            <span className={`text-xs ${plan ? 'text-gray-300' : 'text-gray-500'}`}>
              Advanced analytics
            </span>
          </li>
          <li className="flex items-start gap-2">
            {plan ? (
              <CheckIcon className="w-4 h-4 text-[#CCFFFF] flex-shrink-0 mt-0.5"/>
            ) : (
              <XIcon className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5"/>
            )}
            <span className={`text-xs ${plan ? 'text-gray-300' : 'text-gray-500'}`}>
              Priority support
            </span>
          </li>
          <li className="flex items-start gap-2 min-h-[22px]">
            {plan ? (
              <>
                <CheckIcon className="w-4 h-4 text-[#CCFFFF] flex-shrink-0 mt-0.5"/>
                <span className="text-gray-300 text-xs">Export & share features</span>
              </>
            ) : (
              <>
                <XIcon className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5"/>
                <span className="text-gray-500 text-xs">Export & share features</span>
              </>
            )}
          </li>
        </ul>

        {/* CTA Button - Fixed at bottom */}
        <div className="w-full mt-auto">
          {activated ? (
            <button className="w-full glass-button px-4 py-2 rounded-lg text-white text-sm font-bold opacity-50 cursor-not-allowed">
              Current Plan
            </button>
          ) : plan ? (
            <button className="w-full group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#2B74AB] to-[#265973] rounded-lg"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#2B74AB] to-[#265973] rounded-lg opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>
              <div className="relative px-4 py-2 text-sm font-bold text-white transition-transform group-hover:scale-105">
                Upgrade to Pro
              </div>
            </button>
          ) : (
            <button className="w-full glass-button px-4 py-2 rounded-lg text-white text-sm font-bold">
              Get Started
            </button>
          )}
        </div>
      </div>
    )
  }

function XIcon(props: React.SVGProps<SVGSVGElement>) {
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
  
  
  function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
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