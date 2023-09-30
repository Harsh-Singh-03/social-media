"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface props{
    path: string
}
const SearchBar = ({path}:props) => {
    const [search, setSearch] = useState("")
    const router = useRouter()
    const handleSubmit = (e: any) =>{
        e.preventDefault()
    }
    useEffect(() => {
     setTimeout(() => {
        router.push(`${path}?q=${search}`)
     }, 300);
    }, [search])
    
    return (
        <form className="w-full flex gap-2 lg:gap-4 flex-row items-center max-w-none" onSubmit={handleSubmit}>
            <div className="form-group relative my-0 flex-1">
                <Image src="/assets/search-gray.svg" alt="logo" width={20} height={20} className="absolute right-4 top-2 lg:top-3 object-contain cursor-pointer"/>
                <input type="text" className='input my-0 w-full lg:py-6 lg:px-4' value={search} onChange={(e) => setSearch(e.target.value)} placeholder="username/name..." required />
            </div>
            <button type="submit" className="hidden"></button>
        </form>
    )
}

export default SearchBar
