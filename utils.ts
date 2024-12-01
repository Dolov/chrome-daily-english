export enum StorageKey {
  WORDS = "words"
}

export const parseJson = (
  jsonStr: string,
  defaultValue?: Record<string, any>
) => {
  if (typeof jsonStr === "string") {
    try {
      return JSON.parse(jsonStr)
    } catch (error) {
      return defaultValue
    }
  }

  return defaultValue
}

export function isEnglishWord(word) {
  const regex = /^[A-Za-z'-]+$/
  return regex.test(word)
}
