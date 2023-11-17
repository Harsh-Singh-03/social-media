export default function Loading() {
    return (
        <div className={`grid place-items-center fixed top-0 left-0 w-screen h-screen bg-dark-4/80 z-50`}>
            <div className="custom-loader"></div>
        </div>
    )
}