interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <>
      {/* Versão Mobile - Compacta */}
      <div className="flex md:hidden justify-center items-center mt-8 gap-3">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          style={{
            backgroundColor: currentPage === 1 ? '#E5E7EB' : '#B24C60',
            color: currentPage === 1 ? '#9CA3AF' : '#FFFFFF',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          }}
          className="px-4 py-2 rounded-lg font-semibold text-sm shadow-md"
        >
          ←
        </button>

        <div className="flex flex-col items-center px-4">
          <span className="text-sm font-bold text-wedding-600">
            Página {currentPage} de {totalPages}
          </span>
          <div className="flex gap-1.5 mt-2">
            {[...Array(totalPages)].map((_, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: currentPage === i + 1 ? '#B24C60' : '#E8A5AC',
                  width: currentPage === i + 1 ? '24px' : '8px',
                }}
                className="h-2 rounded-full transition-all duration-300"
              />
            ))}
          </div>
        </div>

        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          style={{
            backgroundColor: currentPage === totalPages ? '#E5E7EB' : '#B24C60',
            color: currentPage === totalPages ? '#9CA3AF' : '#FFFFFF',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          }}
          className="px-4 py-2 rounded-lg font-semibold text-sm shadow-md"
        >
          →
        </button>
      </div>

      {/* Versão Desktop - Completa */}
      <div className="hidden md:flex justify-center items-center mt-12 gap-2">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          style={{
            backgroundColor: currentPage === 1 ? '#E5E7EB' : '#B24C60',
            color: currentPage === 1 ? '#6B7280' : '#FFFFFF',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          }}
          className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Anterior
        </button>

        <div className="flex gap-2 items-center">
          {[...Array(totalPages)].map((_, i) => {
            const pageNum = i + 1;

            // Show first, last, current, and neighbors
            if (
              pageNum === 1 ||
              pageNum === totalPages ||
              (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
            ) {
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  style={{
                    backgroundColor: currentPage === pageNum ? '#B24C60' : '#FFFFFF',
                    color: currentPage === pageNum ? '#FFFFFF' : '#B24C60',
                    borderColor: currentPage === pageNum ? '#AF5C78' : '#E8A5AC',
                  }}
                  className="min-w-[44px] h-11 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer border-2 shadow-md hover:shadow-lg"
                >
                  {pageNum}
                </button>
              );
            }

            // Show ellipsis if gap
            if (
              (pageNum === currentPage - 2 && pageNum > 1) ||
              (pageNum === currentPage + 2 && pageNum < totalPages)
            ) {
              return (
                <span key={pageNum} className="px-2 text-gray-400 font-bold">
                  •••
                </span>
              );
            }

            return null;
          })}
        </div>

        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          style={{
            backgroundColor: currentPage === totalPages ? '#E5E7EB' : '#B24C60',
            color: currentPage === totalPages ? '#6B7280' : '#FFFFFF',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          }}
          className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Próxima
        </button>
      </div>
    </>
  );
}
