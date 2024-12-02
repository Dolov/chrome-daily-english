import React from "react"

const validateForm = (value, rules: any[]) => {
  const errors = []

  // 遍历每个字段及其对应的规则
  for (const rule of rules) {
    const { required, min, max, pattern, message, type } = rule

    // 校验必填
    if (required && !value) {
      errors.push(message)
      break // 如果必填未通过，跳过其他校验
    }

    // 校验最小长度
    if (min && value.length < min) {
      errors.push(message)
      break
    }

    // 校验最大长度
    if (max && value.length > max) {
      errors.push(message)
      break
    }

    // 校验格式（如邮箱）
    if (pattern && !pattern.test(value)) {
      errors.push(message)
      break
    }

    // 邮箱
    if (type === "email" && !/^\S+@\S+\.\S+$/.test(value)) {
      errors.push(message)
      break
    }
  }

  return errors
}

const FormItem = (props) => {
  const blured = React.useRef(false)
  const [errors, setErrors] = React.useState([])
  const { children, value, rules, name, onChange, label } = props

  const triggerValidate = () => {
    const newErrors = validateForm(value, rules)
    setErrors(newErrors)
  }

  React.useEffect(() => {
    if (!blured.current) return
    triggerValidate()
  }, [value])

  const hasError = errors.length > 0

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
          triggerValidate()
        },
        onChange(e) {
          children.props?.onChange?.(e)
          const value = typeof e === "object" ? e.target.value : e
          onChange(value)
        }
      })}
      {hasError && (
        <div className="label">
          <span className="label-text-alt text-error">{errors[0]}</span>
          <span className="label-text-alt"></span>
        </div>
      )}
    </label>
  )
}

export default FormItem
