import classnames from "classnames"
import React from "react"

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  loadingClassName?: string
}

const Button = (props: ButtonProps) => {
  const { loading, loadingClassName, children, ...otherProps } = props
  return (
    <button {...otherProps}>
      {loading && (
        <span
          className={classnames(
            "loading loading-spinner loading-md",
            loadingClassName
          )}
        />
      )}
      {children}
    </button>
  )
}

export default Button
