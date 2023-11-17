"use client"

import Image from "next/image"

const Empty = () => {
  return (
    <div className="hidden lg:flex justify-center items-center flex-1 gap-4 flex-col">
        <Image src="/assets/logo.svg" alt="log" width={48} height={48} className="object-contain" />
        <p className="text-gray-1 text-base-regular">Please select any chat !!</p>
    </div>
  )
}

export default Empty
