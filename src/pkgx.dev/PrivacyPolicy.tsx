import MuiMarkdown from "mui-markdown";
import md from './privacy-policy.md?raw';

export default function PrivacyPolicy() {
  return <MuiMarkdown>
    {md}
  </MuiMarkdown>
}
