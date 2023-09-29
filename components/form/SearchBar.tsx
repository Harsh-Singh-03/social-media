"use client"

const SearchBar = () => {
    const handleSubmit = (e: any) =>{
        e.preventDefault()
    }
    return (
        <form className="w-full flex gap-2 lg:gap-4 flex-row items-center max-w-none" onSubmit={handleSubmit}>
            <div className="form-group my-0 flex-1">
                <input type="text" className='input my-0 w-full lg:py-6 lg:px-4' placeholder="&#128269; username/name..." required />
            </div>
            <button type="submit" className="hidden"></button>
        </form>
    )
}

export default SearchBar
