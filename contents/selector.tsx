import classnames from "classnames"
import cssText from "data-text:~style.less"
import type {
  PlasmoCSConfig,
  PlasmoGetShadowHostId,
  PlasmoGetStyle
} from "plasmo"
import React from "react"

import { useStorage } from "@plasmohq/storage/hook"

import Button from "~components/button"
import {
  Fa6SolidMicrophoneLines,
  LsiconTriangleDownFilled
} from "~components/Icon"
import { isEnglishWord, parseJson } from "~utils"
import { Storage } from "~utils/constant"
import { addFavorite } from "~utils/service"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true
}

const containerId = "daisy-english-container-1733110548587"
export const getShadowHostId: PlasmoGetShadowHostId = () => containerId

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText.replaceAll(":root", ":host(plasmo-csui)")
  return style
}

const baseUrl = "http://localhost:3000/api/translate"

const tooltipId = "daisy-english-translation-tooltip"

const Selector = () => {
  const [word, setWord] = React.useState(null)
  const [position, setPosition] = React.useState(null)
  const [translation, setTranslation] = React.useState(null)
  const [translating, setTranslating] = React.useState(false)
  const [buttonVisible, setButtonVisible] = React.useState(false)

  const handleMouseUp = React.useCallback((event) => {
    if (event.target.id === containerId) return

    setTranslation(null)
    setButtonVisible(false)
    const selection = window.getSelection()
    if (!selection) return
    const selectedText = selection.toString().trim()
    if (!selectedText) return
    if (!isEnglishWord(selectedText)) return
    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    setWord(selectedText)
    setPosition(rect)
    setButtonVisible(true)
  }, [])

  React.useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp)
    return () => {
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [])

  const handleTranslate = async () => {
    if (!word) return
    if (translating) return
    setTranslating(true)
    const res = await fetch(`${baseUrl}?word=${word}`)
      .then((res) => res.json())
      .catch(() => {
        setTranslating(false)
        setButtonVisible(false)
      })
    if (!res) return
    const translation = parseJson(res.data.translation)
    setTranslation({
      data: translation,
      favorite: res.data.favorite
    })
    setTranslating(false)
    setButtonVisible(false)
  }

  const { x, y, height, width } = position || {}

  const buttonPosition = {
    top: y + height,
    left: x + width
  }
  return (
    <>
      {buttonVisible && (
        <button
          onClick={handleTranslate}
          style={buttonPosition}
          className="btn btn-sm fixed btn-circle btn-secondary">
          {!translating && <span>T</span>}
          {translating && (
            <span className="loading loading-ring loading-sm"></span>
          )}
        </button>
      )}
      <Translation word={word} position={position} translation={translation} />
    </>
  )
}

const Translation = (props) => {
  const { word, position, translation } = props
  const audioRef = React.useRef<HTMLAudioElement>(null)
  const [userInfo] = useStorage(Storage.USER)
  const [playType, setPlayType] = React.useState<"uk" | "us">(null)
  const [favoriteLoading, setFavoriteLoading] = React.useState(false)
  const { favorite } = translation || {}
  const basic = translation?.data?.result?.[0]?.ec?.basic
  const [isFavorite, setIsFavorite] = React.useState(favorite)

  const {
    explains = [],
    examType = [],
    ukSpeech,
    usSpeech,
    ukPhonetic,
    usPhonetic,
    wordFormats = []
  } = basic || {}
  const wfVisible = wordFormats.length > 0

  React.useEffect(() => {
    if (!playType) return
    setTimeout(() => {
      setPlayType(null)
    }, 1000)
  }, [playType])

  React.useEffect(() => {
    setIsFavorite(favorite)
  }, [translation])

  React.useEffect(() => {
    if (!position || !translation) return
    const hostElement = document.getElementById(containerId)
    const shadowRoot = hostElement.shadowRoot
    const tooltip: HTMLElement = shadowRoot.querySelector(`#${tooltipId}`)
    if (!tooltip) return
    tooltip.style.display = "block"
    const tooltipWidth = tooltip ? tooltip.offsetWidth : 0
    const tooltipHeight = tooltip ? tooltip.offsetHeight : 0

    // 获取窗口的宽度和高度
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight

    const tolerant = 2
    const mouseX = position.x
    const mouseY = position.y
    let newX = mouseX
    let newY = mouseY + position.height + tolerant

    // 如果 tooltip 超出了右边界，调整其位置
    if (newX + tooltipWidth > windowWidth) {
      newX = mouseX - tooltipWidth
    }

    // 如果 tooltip 超出了下边界，调整其位置
    if (newY + tooltipHeight > windowHeight) {
      newY = mouseY - tooltipHeight - tolerant
    }

    tooltip.style.top = `${newY}px`
    tooltip.style.left = `${newX}px`
  }, [position, translation])

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

  const handleCollect = async () => {
    if (!userInfo) {
      const loginPageUrl = chrome.runtime.getURL("tabs/login.html")
      window.open(loginPageUrl, "_blank")
      return
    }
    setFavoriteLoading(true)
    const res = await addFavorite({
      word,
      url: window.location.href
    })
      .finally(() => setFavoriteLoading(false))
      .catch(() => {})
    if (!res) return

    if (res.success) {
      setIsFavorite(!isFavorite)
    }
  }

  if (!translation) return null

  const buttonText = isFavorite ? "取消收藏" : "收藏"

  return (
    <div
      id={tooltipId}
      style={{
        width: 450,
        maxWidth: 500
      }}
      className="fixed card bg-base-100 shadow-xl hidden">
      <div className="card-body p-6">
        <h2 className="card-title">
          <span>{word}</span>
          <audio ref={audioRef} className="hidden" src=""></audio>
          {ukPhonetic && (
            <button
              onClick={handlePlayUkPhonetic}
              className={classnames("btn btn-xs font-normal", {
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
        </h2>
        <div>
          <div>
            {explains.map((explain) => {
              const { pos, trans } = explain
              return (
                <p key={pos} className="text-xs text-gray-600 mb-1 pl-1">
                  <span className="text-gray-400 w-8 inline-block italic">
                    {pos}
                  </span>
                  <span>{trans}</span>
                </p>
              )
            })}
          </div>
          <div className="mt-2">
            {examType.map((exam) => (
              <div key={exam} className="badge text-xs text-gray-600 mr-1">
                {exam}
              </div>
            ))}
          </div>
          {wfVisible && (
            <div>
              <div className="py-4 flex items-center">
                <LsiconTriangleDownFilled className="mr-1" />
                <h3 className="font-bold">变形词</h3>
              </div>
              <div className="text-xs grid grid-cols-3 gap-2">
                {wordFormats.map((wordFormat) => {
                  if (!wordFormat?.value) return null
                  const { name, value } = wordFormat
                  return (
                    <div key={value} className="flex">
                      <span className="text-gray-400 mr-2">{name}</span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
        <div className="card-actions justify-end">
          <Button
            loading={favoriteLoading}
            onClick={handleCollect}
            className="btn btn-primary">
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Selector
