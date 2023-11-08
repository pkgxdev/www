import get_name_base from '../../../src/utils/pkg-name.ts'
import { isArray, isString } from "https://deno.land/x/is_what@v4.1.15/src/index.ts";

export default function get_name(opts: {display_name?: string, provides?: (string[] | string), project: string}): string {
  const { display_name, provides, project } = opts
  if (display_name) {
    return display_name
  } else if (isArray(provides) && provides?.length == 1) {
    return provides[0].slice(4)
  } else if (isString(provides)) {
    return (provides as string)!.slice(4)
  } else {
    return get_name_base(project)
  }
}
