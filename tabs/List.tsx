import classnames from "classnames"
import React from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { PhLinkSimpleBold } from "~/components/Icon"
import { StorageKey } from "~/utils"

import "~/style.less"

const List = () => {
  const [wordsMap] = useStorage(StorageKey.WORDS, {})

  const dates = Object.keys(wordsMap)

  return (
    <div className="list-container h-full overflow-hidden">
      <div className="card bg-base-100 w-96 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Card title!</h2>
          <p>If a dog chews shoes whose shoes does he choose?</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default List
