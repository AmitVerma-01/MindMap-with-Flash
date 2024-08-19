import Image from "next/image";
import img from '@/public/img.png'
import { featureItems } from '@/utils/features'
import FeatureCard from "@/components/FeatureCard";
import Footer from "@/components/Footer";
import Link from "next/link";
import PriceCard from "@/components/PriceCard";

export default function Home() {

  return (
   <main className="bg-[#265973]"> 
      <div className="flex justify-center h-screen">
        <div className="flex flex-col md:flex-row justify-center items-center md:w-11/12 h-screen p-2">
          <div className="md:w-1/2 felx flex-col space-y-5">
            <h2 className="text-2xl md:text-3xl lg:text-6xl text-[#CCFFFF] font-bold">Unlock Your Mind&apos;s Potential with MindMapWithFlash</h2>
            <p className="text-[#CCFFFF] text-base md:text-xl lg:text-2xl font-mono">Effortlessly create and share interactive flashcards and mind maps powered by AI. Boost your learning and productivity today.</p>
            <div className="flex gap-x-3">
              <Link href={'/pages/flashcards'} className="bg-[#0F1438] hover:bg-[#0F1438]/80 p-2 rounded-md md:font-medium text-[#CCFFFF]">Start Creating</Link>
              <button className="border border-[#0F1438] hover:bg-[#0F1438] p-2 rounded-md md:font-medium text-[#CCFFFF]">Learn More</button>
            </div>
          </div>
          <div className="w-full flex justify-center items-center">
            <Image src={img} alt="MapMind with Flash" className="w-[50vh] md:w-1/2 lg:w-1/2"/>
          </div>
        </div>
      </div>
      <section className="bg-[#212D7D] w-full min-h-screen py-5 flex justify-center items-center">
         <div className="w-11/12 md:w-4/5 flex flex-col gap-y-5">
            <div className="w-full flex justify-center items-center my-2">
                <button className="bg-[#CCFFFF] px-2 p-1">Powerful Feateres</button>
            </div>
            <div className="text-[#CCFFFF] text-center flex justify-center">
              <div className="w-4/5 text-center">
                <h2 className="text-2xl md:text-5xl font-bold">
                  Unlock your Mind&apos;s Potential
                </h2>
                <p className="font-mono text-sm md:font-medium md:text-xl">MindMapWithFlash combines the power of AI-generated summaries, spaced repetition, and visual mind mapping to help you learn and retain information more effectively.</p>
              </div>
            </div>
            <div className="flex justify-center items-center w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 text-[#CCFFFF] gap-8 mt-5">
                  {
                  featureItems.map((item,i) => <FeatureCard key={i} heading={item.heading} details={item.details}/>)
                  }
              </div>
            </div>
         </div>
      </section>
      <div className="w-full py-5 flex justify-center items-center ">
        <div className=" flex justify-center items-center flex-col space-y-3">
          <div className="flex items-center flex-col gap-y-4">
            <span className="p-1 px-2 bg-[#CCFFFF]">Pricing</span>
            <h2 className="text-[#CCFFFF] text-2xl md:text-5xl font-bold">Unlock Your Learning Potential</h2>
            <p className="text-[#CCFFFF] w-8/12 text-center my-2 font-mono text-sm md:font-medium md:text-xl">Choose the plan that best fits your learning needs and budget. Get started with MindMapWithFlash today.</p>
          </div>
          <div className="md:flex justify-around">
            <PriceCard plan={false} activated={true}/>
            <PriceCard plan={true} activated={false}/>
          </div>
        </div>
      </div>
      <div className="w-screen h-[50vh] flex justify-center items-center bg-[#212D7D]">
        <div className="w-11/12 flex justify-between items-center text-[#CCFFFF]">
              <div>
                  <h2 className="text-2xl md:text-5xl font-bold">
                    Ready to Unlock Your Mind&apos;s Potential?
                  </h2>
                  <p className="font-mono w-3/4  text-sm md:font-medium md:text-xl">Sign up for MindMapWithFlash and start creating powerful flashcards and mind maps today.</p>
              </div>
              <div className="font-medium">
                <button className="bg-[#265973] p-2 text-sm md:text-base my-2 rounded-md mx-2"> SignUp</button>
                <button className="bg-[#0F1438] p-1 text-sm my-2 md:text-base rounded-md md:p-2 hover:bg-[#265973]"> Learn More</button>
              </div>
        </div>
      </div>
   </main>
  );
}


