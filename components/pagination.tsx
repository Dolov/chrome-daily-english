import React, { useState } from "react"

interface PaginationProps {
  pageNo: number // 当前页码
  pageSize: number // 每页显示条数
  total: number // 总数据条数
  totalPages: number // 总页数
  onPageChange: (newPage: number) => void // 页码变化时的回调
  onPageSizeChange: (newSize: number) => void // 每页条数变化时的回调
}

const MAX_VISIBLE_PAGES = 7

const Pagination: React.FC<PaginationProps> = (props) => {
  const {
    pageNo,
    pageSize,
    total,
    totalPages,
    onPageChange,
    onPageSizeChange
  } = props

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return // 防止越界
    onPageChange(newPage) // 调用回调
  }

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onPageSizeChange(Number(e.target.value)) // 更改每页显示条数
  }

  const pageList = React.useMemo(() => {
    const count = Math.min(MAX_VISIBLE_PAGES, totalPages)
    const start = Math.max(
      1,
      Math.min(pageNo - Math.floor(count / 2), totalPages - count + 1)
    )
    return Array.from({ length: count }, (_, index) => start + index)
  }, [pageNo, totalPages])

  return (
    <div className="join">
      {pageList.map((page) => (
        <button
          key={page}
          className={`join-item btn ${page === pageNo ? "btn-active" : ""}`}
          onClick={() => handlePageChange(page)}>
          {page}
        </button>
      ))}
    </div>
  )
}

export default Pagination
