interface featureProps{
    heading : string
    details : string
  }
  
export default  function FeatureCard({heading, details } : featureProps){
    return (
      <div>
        <h1 className="text-xl md:text-2xl font-semibold">{ heading }</h1>
        <p className="text-sm md:text-base font-mono"> {details} </p>
      </div>
    )
  }