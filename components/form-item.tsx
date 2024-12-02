import React from "react"

import { Context } from "./form"

const FormItem = (props) => {
  const context = React.useContext(Context)

  const { onChange, sendRules, triggerValidate } = context

  const values = context.values || {}
  const errors = context.errors || {}
  const blured = React.useRef(false)
  const { children, name, label, rules } = props
  const value = values[name]
  const hasError = errors[name] && errors[name].length > 0

  React.useEffect(() => {
    sendRules(name, rules)
  }, [name, rules])

  return (
    <label className="form-control w-full">
      <div className="label">
        <span className="label-text">{label}</span>
      </div>
      {React.cloneElement(children, {
        ...children.props,
        value,
        onBlur() {
          blured.current = true
          triggerValidate(name)
        },
        onChange(e) {
          children.props?.onChange?.(e)
          const value = typeof e === "object" ? e.target.value : e
          onChange({
            [name]: value
          })
          if (blured.current) {
            triggerValidate(name)
          }
        }
      })}
      {hasError && (
        <div className="label">
          <span className="label-text-alt text-error">{errors[name][0]}</span>
          <span className="label-text-alt"></span>
        </div>
      )}
    </label>
  )
}

export default FormItem
