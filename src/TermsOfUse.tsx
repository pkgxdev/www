import MuiMarkdown from "mui-markdown";
import md from './terms-of-use.md?raw';
import Masthead from "./components/Masthead";
import { Stack } from "@mui/material";
import Footer from "./components/Footer";

export default function TermsOfUse() {
  return <Stack direction="column" maxWidth='md' p={2} minHeight='100vh' mx='auto' spacing={4}>
    <Masthead />
    <MuiMarkdown>
      {md}
    </MuiMarkdown>
    <Footer/>
  </Stack>
}
