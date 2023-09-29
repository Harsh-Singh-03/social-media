"use client";

import { useRouter } from "next/navigation";

interface Props {
  pageNumber: number;
  isNext: boolean;
  path: string;
}

function Pagination({ pageNumber, isNext, path }: Props) {
  const router = useRouter();

  const handleNavigation = (type: string) => {
    let nextPageNumber = pageNumber;

    if (type === "prev") {
      nextPageNumber = Math.max(1, pageNumber - 1);
    } else if (type === "next") {
      nextPageNumber = pageNumber + 1;
    }

    if (nextPageNumber > 1) {
      router.push(`/${path}?page=${nextPageNumber}`);
    } else {
      router.push(`/${path}`);
    }
  };

  if (!isNext && pageNumber === 1) return null;

  return (
    <div className='mt-10 flex w-full items-center justify-center gap-5'>
      <button
        onClick={() => handleNavigation("prev")}
        disabled={pageNumber === 1}
        className='!text-small-regular text-light-2 btn px-4'
      >
        Prev
      </button>
      <p className='text-small-semibold text-light-1'>{pageNumber}</p>
      <button
        onClick={() => handleNavigation("next")}
        disabled={!isNext}
        className='!text-small-regular text-light-2 btn px-4'
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;