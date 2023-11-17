import discord from "../assets/wordmarks/discord.svg";
import { IconButton, Box } from "@mui/material";

export default function Discord() {
  //FIXME hardcoding the size sucks

  return <IconButton href='https://discord.gg/rNwNUY83XS'>
    <Box component='img' src={discord} height={20} width={20} />
  </IconButton>
}