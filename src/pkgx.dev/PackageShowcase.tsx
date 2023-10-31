import { useAsync } from "react-use";
import PackageGrid from "./PackageGrid";
import { Alert, Skeleton } from "@mui/material";


export default function showcase() {
  const {loading, error, value: pkgs} = useAsync(async () => {
    const rsp = await fetch('https://pkgxdev.github.io/pantry/pkgs.json')
    return await rsp.json()
  })

  if (loading) {
    return <Skeleton animation='wave' variant='rectangular' />
  } else if (error) {
    return <Alert severity='error'>{error.message}</Alert>
  } else {
    return <PackageGrid pkgs={pkgs!} />
  }
}
