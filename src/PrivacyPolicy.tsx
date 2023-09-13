import MuiMarkdown from "mui-markdown";
import md from './privacy-policy.md?raw';
import Masthead from "./Masthead";
import { Stack } from "@mui/material";
import Footer from "./Footer";

export default function PrivacyPolicy() {
  return <Stack direction="column" maxWidth='md' p={2} minHeight='100vh' mx='auto' spacing={4}>
    <Masthead />
    <MuiMarkdown>
      {md}
    </MuiMarkdown>
    <Footer/>
  </Stack>
}
