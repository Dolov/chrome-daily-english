import cssText from "data-text:~style.less"
import type {
  PlasmoCSConfig,
  PlasmoGetShadowHostId,
  PlasmoGetStyle
} from "plasmo"
import React from "react"

import { isEnglishWord, parseJson } from "~utils"

const baseUrl = "http://localhost:3000/api/translate"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true
}

const containerId = "daisy-english-container"
export const getShadowHostId: PlasmoGetShadowHostId = () => containerId

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText.replaceAll(":root", ":host(plasmo-csui)")
  return style
}

const Selector = () => {
  const [position, setPosition] = React.useState(null)
  const [word, setWord] = React.useState(null)
  const [translation, setTranslation] = React.useState(null)
  const [translating, setTranslating] = React.useState(false)
  const [buttonVisible, setButtonVisible] = React.useState(false)

  const handleMouseUp = React.useCallback((event) => {
    if (event.target.id === containerId) return

    setTranslation(null)
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
    const basic = translation?.result?.[0]?.ec?.basic
    console.log("translation?.result?.[0]?.ec: ", translation?.result?.[0]?.ec)
    setTranslation(basic)
    setTranslating(false)
    setButtonVisible(false)
  }
  console.log("basic: ", translation)

  const { x, y } = position || {}

  const { explains = [], examType = [], wordFormats = [] } = translation || {}
  const wfVisible = wordFormats.length > 0

  return (
    <>
      {buttonVisible && (
        <button
          onClick={handleTranslate}
          className="btn btn-sm fixed btn-circle btn-secondary"
          style={{ top: y, left: x }}>
          {!translating && <span>T</span>}
          {translating && (
            <span className="loading loading-ring loading-sm"></span>
          )}
        </button>
      )}
      {translation && (
        <div
          style={{ top: y + 60, left: x, width: "450px" }}
          className="absolute card bg-base-100 shadow-xl">
          <div className="card-body p-6">
            <h2 className="card-title">{word}</h2>
            <div>
              <div>
                {explains.map((explain) => {
                  const { pos, trans } = explain
                  return (
                    <p key={pos} className="text-xs text-gray-600 mb-1 pl-1">
                      <span className="text-gray-400 mr-4 italic">{pos}</span>
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
                  <div className="py-4 font-medium">变形词</div>
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
              <button className="btn btn-primary">收藏</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Selector
