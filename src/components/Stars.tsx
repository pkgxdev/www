import { Stack, IconButton, Box, Tooltip, Typography } from "@mui/material";
import github from "../assets/wordmarks/github.svg";
import {useLocation } from "react-router-dom";
import { useAsync } from "react-use";

export default function Stars() {
  const path = useLocation();
  const dst = path.pathname.split('/')[0] == 'pkgs' ? 'pantry' : 'pkgx';

  const {value: stars} = useAsync(async () => {
    const response = await fetch('https://pkgx.sh/stars.json');
    const data = await response.json();
    return data
  }, [])

  return <Stack spacing={0} direction='row' alignItems='center'>
    <IconButton href={`https://github.com/pkgxdev/${dst}`}>
      <Box component='img' src={github}/>
    </IconButton>
    <Tooltip title='Total Org. Stars' arrow placement='right' enterTouchDelay={0}>
      <Typography color='text.secondary' width={44} fontSize={13} overflow='clip' component='span'>
        {stars}
      </Typography>
    </Tooltip>
  </Stack>
}