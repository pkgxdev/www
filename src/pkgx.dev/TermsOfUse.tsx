import MuiMarkdown from "mui-markdown";
import md from './terms-of-use.md?raw';
import Masthead from "../components/Masthead";
import { Stack } from "@mui/material";
import Footer from "../components/Footer";

export default function TermsOfUse() {
  return <MuiMarkdown>
    {md}
  </MuiMarkdown>
}
