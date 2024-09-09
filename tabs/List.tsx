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
      <div className="m-4 max-w-[1200px] mx-auto">
        {dates.map((date) => {
          const words = wordsMap[date]
          return (
            <details open key={date} className="collapse bg-base-200 mb-4">
              <summary className="collapse-title text-xl font-medium select-none">
                {date}
              </summary>
              <div className="collapse-content">
                {words.map((word) => {
                  const { text, url, time } = word
                  return (
                    <div
                      key={text}
                      className="flex justify-between border-b p-2">
                      <WordItem word={word} />
                      <div className="w-1/6 flex justify-end items-center">
                        <TranslationPlatforms text={text} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </details>
          )
        })}
      </div>
    </div>
  )
}

const TranslationPlatforms = (props) => {
  const { text } = props
  const googleTranslate = () => {
    window.open(
      `https://translate.google.com/?sl=auto&tl=zh-CN&text=${text}&op=translate`
    )
  }

  const baiduTranslate = () => {
    window.open(`https://fanyi.baidu.com/#en/zh/${text}`)
  }

  const youdaoTranslate = () => {
    window.open(`https://fanyi.youdao.com/#/?${text}`)
  }

  return (
    <>
      <img
        onClick={googleTranslate}
        className="w-6 h-6 cursor-pointer hover:scale-105 ml-4"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEsElEQVR4Ac2X1XrjRgBGi9f7AOX2KXq3zBQsMzN3mdkOLjMzhpk5ZmbmoOU4W27/akYZq47i0qK+7xiuzhkQPXBfHN8cjT+VVZQ055XeRF6JQC5PzgTZxSJZRQLLCuOlty0gqyRhInICEROomMHkPMuLBJbsGP5p48bWR25LgFQuDcgSA7BsgqzNvudvSwCRZpZnDliyY/DkbQlgUkbm0YsBlIKRX99/X/XobQ3I/jejJxQKLF5tn3XLAdlSsShnFEkDlvJ8fGgYOr0NwWAE0WiMJ0qJRCIIh8NphEIhitfrdej1zsfFACqTsu1GEipHAsMjcYramcCWa0kqZwGEujYDbDY3L40iFosRWARDEhQIBCxTBrARX+pKIB6PY5TH7ONg9nL0fzAWxxsHxlPyJQU3UXzZBZXKCI/H968DCKkAJmVsvZ6kMmeQw+cnx1PT/uXpcXxynP8vyikfHRhAX78eRqMFfn+AyDMHiMshBrDdzVDYhdF+cyYp2XQEcfSMcdS36qDTmWC12uDz+W4tYGiYgyfMpcn5qU+jSZeg8sUTlFxxQa02wmKxwW63o1uhQWNXX7o8UwATMQb5AG+ESxu1xslRDG5hdhQ2joopcrIMUXR2qaDWGGAwmnDg/FWsLD4Enz9A8fr8FH8gIA1gEka/TZB8e1Zcb8a6S8L+KO8fY3LKItkYXvm2CG+s3Im31uzA22t3Ud7dWID3NxfjvU3FeHdTEQ5eKifyvw/YdFWQuEIcvjiZTK33h8fG4QiIcSn5BBuOqHG1ogkV9S2oaelAbUs76lo78cnWUuw+ew1N3QqoDCZpABFM5lzHGBURrD4Ch9GJ/xc6ExI54ZODUVytbEF1UwfsdgccDgfq27rw9joZelVatv4ZA8go09hwOYleK4eBIZ5hDkp7AttvJKeUL5TxMyJLouRYOd5ctQudfUrYbHasKDqAzftOwOVykYsPEUsDBKGUxZORM9LFjAU8pZdt+HLrHqyQH8L+c9fw3no5epVqGkDw+/1UHgwGxQCJ6F+IpXKBTw5GUF3fgXfWyOlmvFBRB6fTmQpwu900QhoglUnFIhIxZRe/DLsS2HOqEq+v4M+GtTsgO3qOXBdoBAvwer3kYiUG/EspE2eUE+bzZK24ipLjl1HT3In3NsghO3KWbMq0AI/HIwZIRBmlmcVMTnhZZkdfvw4mkxV1bZ14f0MBdvIRDoeTBFB5esCuuCmzUCqWjlpk3s5xLNqZQHO7BlqtkZ4J9e3ddCau1TWxWUgPWLAx9Pi8bYOWhTsTmMyCqdghMn8Hl2LedoG5PPuuWqFWG0gAvR70qTRkBsheEANu9VizteP7mTlVmJH9F7KqsPDlSpRVKaAzWGC30wDG7Q14f8XlabPyapAitwaz82tx7lIPlCo9jCYLkZIIQloA4bY8Ub/7XX10dl4tKLm12He0EwqlDnq9CWazMAM2m40FsNPx9gWs29n5NZGT0W+Wt0Kh0PGbzwCj0QyLxULkaQGE2xrw/orGaUT+xZomdHeroVKR0Rv50UsDCCzAYLCYb9u75YotNY6ODiV6+1TQaMijmR4mkykVwbBarTRGpzNaZbKLz90Xb+Z/Apo8pHRw0e17AAAAAElFTkSuQmCC"
        alt="谷歌翻译"
        title="谷歌翻译"
      />
      <img
        onClick={baiduTranslate}
        className="w-6 h-6 cursor-pointer hover:scale-105 ml-4"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACzElEQVR4AcVXA5DlQBT8ZfNs21bpbBuFs23btm3btm3bRjBRXzpbWSurdFV/Ts3rx8kEXBx6atSqt0E9kWmG9Cf5JAmJQe5NG4efGbUCoTH+tDaOC5KStBkgqIY/+EFGPcCQ+CWAtgOZZ8h//BJA24HoFqSfJiH7LNlh2qneNs84XcLJlwZGn9SiXRetgFkXNbjof1g4vxVbJKPNLhVtbfY5JDDkmMDksxoWXdWx4Y6OfY8NnLINf/lnwcXMC1rCCchhR+PDHwt/hQXdBG59NHHutYG9tuF1t3XMu6w5IlxQxvk3JooulL0LmGR79lOxHPY4IML3tCNkvm0wRajf88yV8fGvBRfTz3tNgQe22KqC2HpfZ0E5vPbehIsVN3SKSzwBJHNPvPhh4ebHEOOsh1STucaDABZYVEw9JfINaOTECwOhwZyzg/i/JwHRofCCiEVEUUOPCUgaIuCfAI49NzDxjIZW21SUWsJWjkHA7odGGJ59bUQpgPl/9NUEwY6Ydl5Dxz0C735biArPvlveaqDmOiWCgAYbVVx5Z0IYcELffb9AtplBxTflnOZ42u+wwJ1PJkLjwBMDGaZL8RPAzWdc0NBki+q0YWTp+62GeFl8kYxeBwXniWs83hGIlGw1F99lC1XXKGhup6jLXoGu+4TbigkngFF49dPCD8XCL9VCDGAEElYAxzFFDD8u0G2/cKrcxfs/FgdSJPslYgpIF4+/mfyeeAKyzgwaTBVWKqi4SkHt9QoabQqJAM+HQUcFxp3SsOSajsPPDKddL7wxWYjxF8BTMTooetAJeemt6RzLx5+HzJV2u9WESUH1tQrKLVOcSOSaIzsPHy4efEnkFERCpiVxBFSyc8x2I/PPi52A17+s+AvwypyzfRaQd65Mw3wk4xT0JsDPx3Je1fy/mBx66vPVzPfLqYuDT406DIk9VP4lllHuTRuu58R/QK4oYk/INY8AAAAASUVORK5CYII="
        alt="百度翻译"
        title="百度翻译"
      />
      <img
        onClick={youdaoTranslate}
        className="w-6 h-6 cursor-pointer hover:scale-105 ml-4"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAS1BMVEVHcEz/DjD/EDT/EDT/DS3/FiL/KSf/ODD/Cyz/ETT/RDr/ETb/TET9gIb+xcj7Xmf////+Ez/9MEj9oaPmAxT/5OXtCCf2DzfuCymzJL2TAAAAGXRSTlMABoLU/////wRP///////////////////5M/gAeQAAAaBJREFUeAFdkwGOrCAUBFlVmfGpgiLs/U/6q+VLzLaJhqmafkiiIz9dP7SMk/d+mqZx7LsPkHxfdPAzvBrke3OzQZfwMJNqIFTjB1g5WeDkZXxcZ+K64FVgTJvSuR6BiPuF/DF693CEm7cp03gbzlpU8OpYtx0DoY2Y//Nq7CEsGuMsQokxQUh3T9YQ7iNzEePYtjOl41h5zovXYzlDGCXeDWMIAcGuEPZj506ucE2zhBijZfQ1HbRutgvKkYCBYCUXlimrwCC79/OF7GcMhFJKYn3sKlg1hX2yOF9CXllvsLiFyw6MiR9mMjg4Qqobi/EKW5SwsCve2SNUY4NTHnkOCF51HNlQGxB2FXAUpzYS7WRJjUmoFUmvkFJhBmZQvLiEgpEPFeSc8gGtzghuDVkzM0kp7ScHvm7nQIFJkBFVIC6DDIrZ0xBVsObfWqEY0Ehr4PhTwXgqxKqDQIy/llwQqmGxGhJ6uF6EVAOeYzN610mAk18JUqh8jM59qhCrIcyA2BR9eq0CQxWsgNX4upcBxyjxiYnXdL0M8qIx9p3YP2HjNMrd80bUAAAAAElFTkSuQmCC"
        alt="有道翻译"
        title="有道翻译"
      />
    </>
  )
}

const WordItem = (props) => {
  const { word } = props
  const { text, url, time } = word
  return (
    <div className="flex-1 flex items-center">
      <a href={url} target="_blank">
        <PhLinkSimpleBold className="w-4 h-4 cursor-pointer hover:scale-105 mr-4 text-secondary" />
      </a>
      <h2 className="text-xl font-bold">{text}</h2>
    </div>
  )
}

export default List
