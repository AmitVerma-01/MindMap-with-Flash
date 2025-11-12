interface featureProps{
    heading : string
    details : string
  }
  
export default  function FeatureCard({heading, details } : featureProps){
    return (
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-white ">{ heading }</h1>
        <p className="text-sm md:text-base font-mono text-white" title={details}> {details.slice(0, 100)}... </p>
      </div>
    )
  }