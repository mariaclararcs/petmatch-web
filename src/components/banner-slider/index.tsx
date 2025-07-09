import React from "react"
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import '@/styles/globals.css'
import Image from "next/image"

export default function BannerSlider(){
  const [sliderRef] = useKeenSlider({
      loop: true,
      mode: "free-snap",
      slides: {
        perView: 1,
        spacing: 15,
      },
    },
    [
      (slider) => {
        let timeout
        let mouseOver = false
        function clearNextTimeout() {
          clearTimeout(timeout)
        }
        function nextTimeout() {
          clearTimeout(timeout)
          if (mouseOver) return
          timeout = setTimeout(() => {
            slider.next()
          }, 6000)
        }
        slider.on("created", () => {
          slider.container.addEventListener("mouseover", () => {
            mouseOver = true
            clearNextTimeout()
          })
          slider.container.addEventListener("mouseout", () => {
            mouseOver = false
            nextTimeout()
          })
          nextTimeout()
        })
        slider.on("dragStarted", clearNextTimeout)
        slider.on("animationEnded", nextTimeout)
        slider.on("updated", nextTimeout)
      },
    ]
  )

  return (
    <div ref={sliderRef} className="keen-slider rounded-xl h-72">
      <div className="keen-slider__slide number-slide1 rounded-xl bg-aquaternary">
        <Image
          className="w-full h-72 object-cover"
          alt="Banner image 1" 
          src="/images/home-banner-1.svg"
          width={176}
          height={176}
        />
      </div>
      <div className="keen-slider__slide number-slide2 rounded-xl bg-aquaternary">
        <Image
          className="w-full h-72 object-cover"
          alt="Banner image 2" 
          src="/images/home-banner-2.svg"
          width={176}
          height={176}
        />
      </div>
    </div>
  )
}
