import { Button } from "./Button";

export function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white/80 p-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/75">
      <div className="text-sm text-slate-500 dark:text-slate-400">
        Page {page} of {totalPages}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          Prev
        </Button>
        {pages.map((currentPage) => (
          <Button
            key={currentPage}
            variant={currentPage === page ? "primary" : "outline"}
            onClick={() => onPageChange(currentPage)}
          >
            {currentPage}
          </Button>
        ))}
        <Button
          variant="outline"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
