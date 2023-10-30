export async function get<T>(urlPath: string): Promise<T> {
  const headers = { Authorization: 'public' }
  const rsp = await fetch(`https://app.pkgx.dev/v1/${urlPath}`, {headers})
  return rsp.json() as T
}
