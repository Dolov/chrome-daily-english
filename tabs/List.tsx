import React from 'react'
import { useStorage } from "@plasmohq/storage/hook"
import { StorageKey } from "~/utils"

const List = () => {

  const [wordsMap] = useStorage(StorageKey.WORDS, {})

  const dates = Object.keys(wordsMap)

  return (
    <div>
      {dates.map(item => {
        const words = wordsMap[item]
        return (
          <div key={item}>
            <h2>{item}</h2>
            <div>
              {words.map(word => {
                const { text, time, url } = word
                return (
                  <div key={word}>
                    <a href={url}>{text}</a>
                    <span>{new Date(time).toLocaleString()}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default List