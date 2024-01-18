import { isString, isPlainObject } from "https://deno.land/x/is_what@v4.1.15/src/index.ts";

export default function get_provides(yml: any): string[] {
  let provides = yml['provides']
  if (isString(provides)) {
    return [provides]
  }
  if (isPlainObject(provides)) {
    const { darwin, linux, windows, '*': star } = provides
    provides = []
    const set = new Set()
    for (const x of [darwin, linux, windows, star].flatMap(x => x)) {
      if (!set.has(x) && x) {
        provides.push(x)
        set.add(x)
      }
    }
  }
  return provides ?? []
}
