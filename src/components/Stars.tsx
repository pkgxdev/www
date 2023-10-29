import { Stack, IconButton, Box, Tooltip, Typography } from "@mui/material";
import { useAsync } from "react-use";
import github from "../assets/wordmarks/github.svg";

export default function Stars() {
  const {value: stars} = useAsync(async () => {
    const response = await fetch('https://pkgx.sh/stars.json');
    const data = await response.json();
    return data
  }, [])

  return <Stack spacing={0} direction='row' alignItems='center'>
    <IconButton href='https://github.com/pkgxdev/pkgx'>
      <Box component='img' src={github}/>
    </IconButton>
    <Tooltip title='Total Org. Stars' arrow placement='right' enterTouchDelay={0}>
      <Typography color='text.secondary' width={44} fontSize={13} overflow='clip' component='span'>
        {stars}
      </Typography>
    </Tooltip>
  </Stack>
}