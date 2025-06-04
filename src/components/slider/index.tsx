import React from "react"
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import '@/styles/globals.css'

export default function Slider(){
  const [sliderRef] = useKeenSlider({
    loop: true,
  })

  return (
    <div ref={sliderRef} className="keen-slider rounded-xl h-48">
      <div className="keen-slider__slide number-slide1 rounded-xl bg-amber-200">1</div>
      <div className="keen-slider__slide number-slide2 rounded-xl bg-amber-300">2</div>
      <div className="keen-slider__slide number-slide3 rounded-xl bg-amber-400">3</div>
    </div>
  )
}
