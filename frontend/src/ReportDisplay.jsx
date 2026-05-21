import ReactMarkdown from "react-markdown";

const markdownComponents = {
  h2: ({ children }) => <h2 className="report-title">{children}</h2>,
  h3: ({ children }) => <h3 className="report-section-title">{children}</h3>,
  h4: ({ children }) => <h4 className="report-theme-title">{children}</h4>,
  p: ({ children }) => <p className="report-paragraph">{children}</p>,
  strong: ({ children }) => <strong className="report-strong">{children}</strong>,
  ol: ({ children }) => <ol className="report-list report-list--ordered">{children}</ol>,
  ul: ({ children }) => <ul className="report-list">{children}</ul>,
  li: ({ children }) => <li className="report-list-item">{children}</li>,
};

/** Indent lines that belong to a numbered list item so markdown parsers keep them grouped. */
function normalizeReportMarkdown(text) {
  const lines = text.split("\n");
  const result = [];
  let inNumberedItem = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (/^#{1,6}\s/.test(trimmed)) {
      inNumberedItem = false;
      result.push(line);
      continue;
    }

    if (/^\d+\.\s/.test(trimmed)) {
      inNumberedItem = true;
      result.push(line);
      continue;
    }

    if (inNumberedItem && trimmed) {
      result.push(`    ${trimmed}`);
      continue;
    }

    inNumberedItem = false;
    result.push(line);
  }

  return result.join("\n");
}

function ReportDisplay({ content }) {
  const normalized = normalizeReportMarkdown(content);

  return (
    <article className="report">
      <ReactMarkdown components={markdownComponents}>{normalized}</ReactMarkdown>
    </article>
  );
}

export default ReportDisplay;
