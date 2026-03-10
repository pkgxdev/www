import Markdown from "../components/Markdown";
import md from "./terms-of-use.md?raw";

export default function TermsOfUse() {
  return <Markdown txt={md} />;
}
