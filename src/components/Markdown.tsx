import React from 'react';
import Showdown from 'showdown';

export default function MarkdownToHtmlComponent({ txt }: {txt: string}) {
  const converter = new Showdown.Converter();
  const html = converter.makeHtml(txt);

  // The use of dangerouslySetInnerHTML is necessary to set raw HTML content.
  // Be sure that any Markdown content is sanitized to prevent XSS attacks.
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
