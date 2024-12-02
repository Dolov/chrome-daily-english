import classnames from "classnames"
import React from "react"

import Button from "./button"
import { Fa6SolidMicrophoneLines, LsiconTriangleDownFilled } from "./Icon"

const BasicTranslation = (props) => {
  const { word, type, translation } = props

  const audioRef = React.useRef<HTMLAudioElement>(null)
  const [playType, setPlayType] = React.useState<"uk" | "us">(null)

  const {
    explains = [],
    examType = [],
    ukSpeech,
    usSpeech,
    ukPhonetic,
    usPhonetic,
    wordFormats = []
  } = translation || {}

  const wfVisible = wordFormats.length > 0

  const favorite = type === "favorite"

  React.useEffect(() => {
    if (!playType) return
    setTimeout(() => {
      setPlayType(null)
    }, 1000)
  }, [playType])

  const handlePlayUkPhonetic = (event) => {
    audioRef.current.src = ukSpeech
    audioRef.current.play()
    setPlayType("uk")
  }

  const handlePlayUsPhonetic = (event) => {
    audioRef.current.src = usSpeech
    audioRef.current.play()
    setPlayType("us")
  }

  return (
    <div className="h-full overflow-hidden flex flex-col">
      <div className="flex-1 overflow-auto">
        <h2 className="card-title">
          <span>{word}</span>
        </h2>
        <div className="mt-1 mb-2">
          <audio ref={audioRef} className="hidden" src=""></audio>
          {ukPhonetic && (
            <button
              onClick={handlePlayUkPhonetic}
              className={classnames("btn btn-xs font-normal mr-2", {
                "btn-secondary": playType === "uk"
              })}>
              <Fa6SolidMicrophoneLines
                className={classnames("text-md text-primary", {
                  "text-white": playType === "uk"
                })}
              />
              英 {ukPhonetic}
            </button>
          )}
          {usPhonetic && (
            <button
              onClick={handlePlayUsPhonetic}
              className={classnames("btn btn-xs font-normal", {
                "btn-secondary": playType === "us"
              })}>
              <Fa6SolidMicrophoneLines
                className={classnames("text-md text-primary", {
                  "text-white": playType === "us"
                })}
              />
              美 {usPhonetic}
            </button>
          )}
        </div>
        <div>
          {explains.map((explain) => {
            const { pos, trans } = explain
            return (
              <p key={pos} className="text-xs text-gray-600 mb-1 pl-1">
                {pos && (
                  <span className="text-gray-400 w-8 inline-block italic">
                    {pos}
                  </span>
                )}
                <span>{trans}</span>
              </p>
            )
          })}
        </div>
      </div>
      <div>
        <button className="btn btn-sm btn-accent">详情</button>
        <button className="btn btn-sm btn-accent">删除</button>
        <button className="btn btn-sm btn-accent">已掌握</button>
        <button className="btn btn-sm btn-accent">优先级</button>
        <button className="btn btn-sm btn-accent">来源</button>
      </div>
    </div>
  )
}

export default BasicTranslation
