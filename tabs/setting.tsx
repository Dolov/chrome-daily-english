import classnames from "classnames"
import React from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { themes } from "~/utils/constant"
import { useThemeChange } from "~/utils/hooks"
import Background, { backgroundMap } from "~components/background"
import { Storage } from "~utils/constant"

import "~/style.less"

const ThemeList = (props) => {
  const { value, onChange } = props

  return (
    <div className="rounded-box grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {themes.map((item) => {
        const checked = value === item
        return (
          <div
            onClick={() => onChange(item)}
            key={item}
            className={classnames("overflow-hidden rounded-lg item-border", {
              "item-border-active": checked
            })}>
            <div
              data-theme={item}
              className="bg-base-100 text-base-content w-full cursor-pointer font-sans">
              <div className="grid grid-cols-5 grid-rows-3">
                <div className="bg-base-200 col-start-1 row-span-2 row-start-1"></div>{" "}
                <div className="bg-base-300 col-start-1 row-start-3"></div>
                <div className="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2">
                  <div className="font-bold">{item}</div>
                  <div
                    className="flex flex-wrap gap-1"
                    data-svelte-h="svelte-1kw79c2">
                    <div className="bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                      <div className="text-primary-content text-sm font-bold">
                        A
                      </div>
                    </div>
                    <div className="bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                      <div className="text-secondary-content text-sm font-bold">
                        A
                      </div>
                    </div>
                    <div className="bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                      <div className="text-accent-content text-sm font-bold">
                        A
                      </div>
                    </div>
                    <div className="bg-neutral flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                      <div className="text-neutral-content text-sm font-bold">
                        A
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

const BackgroundList = (props) => {
  const { value, onChange } = props

  const keys = Object.keys(backgroundMap)

  return (
    <div className="rounded-box grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {keys.map((key) => {
        const checked = value === key
        const Background = backgroundMap[key]
        const size = "w-[100px] h-[150px]"
        return (
          <div
            onClick={() => onChange(key)}
            key={key}
            className={classnames(
              "relative min-h-[150px] w-full overflow-hidden rounded-lg z-10",
              {
                "item-border-active item-border": checked
              }
            )}>
            <Background />
          </div>
        )
      })}
    </div>
  )
}

export interface SettingProps {}

const Setting: React.FC<SettingProps> = (props) => {
  const {} = props

  const [settings, setSettings] = useStorage<{
    background?: string
  }>(Storage.SETTINGS, {
    background: "write_1"
  })

  const { background } = settings

  const [theme, setTheme] = useThemeChange()

  const setBackground = (background) => {
    setSettings({
      ...settings,
      background
    })
  }

  return (
    <div className="overflow-auto h-full">
      <div className="collapse bg-base-200">
        <input type="radio" name="my-accordion-1" />
        <div className="collapse-title text-xl font-medium">主题</div>
        <div className="collapse-content">
          <ThemeList value={theme} onChange={setTheme} />
        </div>
      </div>
      <div className="collapse bg-base-200">
        <input type="radio" name="my-accordion-2" defaultChecked />
        <div className="collapse-title text-xl font-medium">背景色</div>
        <div className="collapse-content">
          <BackgroundList value={background} onChange={setBackground} />
        </div>
      </div>
    </div>
  )
}

export default Setting
