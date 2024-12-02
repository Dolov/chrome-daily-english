import React from "react"

import BasicTranslation from "~components/basic-translation"
import Pagination from "~components/pagination"
import { getFavoriteList } from "~utils/service"

import "~style.less"

const Favorite = () => {
  const [loading, setLoading] = React.useState(false)
  const [favoriteRes, setFavoriteRes] = React.useState(null)
  const [queryParams, setQueryParams] = React.useState(() => {
    const searchParams = new URLSearchParams(window.location.search)
    return {
      pageNo: Number(searchParams.get("pageNo")) || 1,
      pageSize: Number(searchParams.get("pageSize")) || 10
    }
  })

  React.useEffect(() => {
    queryData(queryParams)
  }, [])

  React.useEffect(() => {
    const newQueryParams = new URLSearchParams(location.search)
    newQueryParams.set("pageNo", String(queryParams.pageNo))
    newQueryParams.set("pageSize", String(queryParams.pageSize))
    window.history.pushState(null, "", "?" + newQueryParams.toString())
  }, [queryParams])

  const queryData = async (params) => {
    setLoading(true)
    const res = await getFavoriteList(params)
    setLoading(false)
    if (!res) return
    if (res.success) {
      setFavoriteRes(res.data)
    }
  }

  const onPageChange = (pageNo) => {
    const nextParams = {
      ...queryParams,
      pageNo
    }
    setQueryParams(nextParams)
    queryData(nextParams)
  }

  const { list = [] } = favoriteRes || {}

  return (
    <div className="h-full flex flex-col p-4">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {list.map((item) => {
          const { id, word, translation } = item
          return (
            <div
              key={id}
              className="card bg-base-100 hover:shadow-xl border h-48">
              <div className="card-body p-4 overflow-hidden">
                <BasicTranslation word={word} translation={translation} />
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex justify-end mt-6">
        <Pagination
          {...favoriteRes}
          onPageChange={onPageChange}
          {...queryParams}
        />
      </div>
    </div>
  )
}

export default Favorite
