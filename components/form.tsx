import React from "react"

const validateForm = (values, rules) => {
  const errors = {}

  // 遍历每个字段及其对应的规则
  for (const field in rules) {
    const value = values[field]
    const fieldRules = rules[field] || []
    const fieldErrors = []

    for (const rule of fieldRules) {
      const { required, min, max, pattern, message, type } = rule

      // 校验必填
      if (required && !value) {
        fieldErrors.push(message || `${field} is required`)
        break // 如果必填未通过，跳过其他校验
      }

      // 校验最小长度
      if (min && value.length < min) {
        fieldErrors.push(
          message || `${field} must be at least ${min} characters`
        )
        break
      }

      // 校验最大长度
      if (max && value.length > max) {
        fieldErrors.push(
          message || `${field} must be at most ${max} characters`
        )
        break
      }

      // 校验格式（如邮箱）
      if (pattern && value && !pattern.test(value)) {
        fieldErrors.push(message || `${field} format is invalid`)
        break
      }

      // 校验邮箱格式
      if (type === "email" && value && !/^\S+@\S+\.\S+$/.test(value)) {
        fieldErrors.push(message || `${field} must be a valid email`)
        break
      }
    }

    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors
    }
  }

  return Object.keys(errors).length > 0 ? errors : null
}

export const Context = React.createContext({
  values: {},
  errors: {},
  onChange: (changeValue: Record<string, any>) => {},
  sendRules: (name: string, rules: any) => {},
  triggerValidate: (name: string) => {}
})

interface FormProps {
  children: React.ReactNode
  initialValues?: Record<string, any>
  onChange?(values: Record<string, any>): void
}

export interface FormRefProps {
  validateValues: () => {
    values: Record<string, any>
    errors: Record<string, any>
  }
}

const Form: React.ForwardRefRenderFunction<FormRefProps, FormProps> = (
  props,
  ref
) => {
  const { children, initialValues, onChange } = props
  const ruleRef = React.useRef({})
  const [errors, setErrors] = React.useState({})

  const [values, setValues] = React.useState(initialValues)

  React.useImperativeHandle(
    ref,
    () => {
      return {
        validateValues() {
          const errors = validateForm(values, ruleRef.current)
          setErrors(errors)
          return {
            values,
            errors
          }
        }
      }
    },
    [values]
  )

  const sendRules = (name, rules) => {
    ruleRef.current = {
      ...ruleRef.current,
      [name]: rules
    }
  }

  const triggerValidate = (name: string) => {
    const itemErrors = validateForm(
      {
        [name]: values[name]
      },
      {
        [name]: ruleRef.current[name]
      }
    )
    const nextErrors = {
      ...errors,
      [name]: itemErrors?.[name]
    }
    setErrors(nextErrors)
  }

  const onItemChange = (changeValue) => {
    const nextValues = {
      ...values,
      ...changeValue
    }
    setValues(nextValues)
    onChange && onChange(nextValues)
  }

  return (
    <Context.Provider
      value={{
        values,
        errors,
        sendRules,
        triggerValidate,
        onChange: onItemChange
      }}>
      <form>{children}</form>
    </Context.Provider>
  )
}

export default React.forwardRef(Form)
