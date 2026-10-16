"use client";

import { useId } from "react";

export type LocalDateProps = {
  date: Date | string;
  options?: Intl.DateTimeFormatOptions;
};

function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function LocalDate({ date, options }: LocalDateProps) {
  const id = useId();
  const dateParsed = new Date(date);

  return (
    <>
      <time
        id={id}
        dateTime={dateParsed.toISOString()}
        suppressHydrationWarning
      >
        {dateParsed.toLocaleDateString(undefined, options)}
      </time>
      <InlineScript
        html={`{var n=document.getElementById("${id}");if(n)n.textContent=new Date("${date}").toLocaleDateString(undefined,${JSON.stringify(options)})}`}
      />
    </>
  );
}
