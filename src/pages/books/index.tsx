import React, { useState } from "react";
import { api } from "../../utils/api";

function Book() {
  const [page, setPage] = useState(1);
  const [pageInfinite, setPageInfinite] = useState(0);
  const {
    data: guestbookInfinityEntries,
    isLoading: isLoadingInfinity,
    hasNextPage,
    fetchNextPage,
  } = api.guestbook.getAll.useInfiniteQuery(
    {
      limit: 2,
    },
    {
      getNextPageParam: (lastPage) => lastPage.meta.nextCursor,
    }
  );
  const { data: guestbookEntries, isLoading } = api.guestbook.getAll.useQuery({
    limit: 2,
    page,
  });
  if (isLoading) return <div>Fetching messages...</div>;
  return (
    <>
      <div className="flex flex-col gap-4">
        {guestbookEntries?.data?.map((entry, index) => {
          return (
            <div key={index}>
              <p>{entry.message}</p>
              <span>- {entry.name}</span>
            </div>
          );
        })}
      </div>
      {[...Array(guestbookEntries?.meta.totalPage ?? 0)]?.map((v, i) => (
        <button onClick={() => setPage(i + 1)}>{i + 1}</button>
      ))}
      <div className="flex flex-col gap-4">
        {guestbookInfinityEntries?.pages?.map((page) => (
          <>
            {page.data.map((entry, index) => (
              <div key={index}>
                <p>{entry.message}</p>
                <span>- {entry.name}</span>
              </div>
            ))}
          </>
        ))}
      </div>
      <button
        disabled={!hasNextPage}
        onClick={() => {
          fetchNextPage();
          setPageInfinite((v) => v + 1);
        }}
      >
        next
      </button>
    </>
  );
}

export default Book;
