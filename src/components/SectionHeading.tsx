import type { ReactNode } from "react";

interface SectionHeadingProps {
  titleId?: string;
  eyebrow: string;
  title: string;
  description?: string;
  trailing?: ReactNode;
}

export function SectionHeading({
  titleId,
  eyebrow,
  title,
  description,
  trailing,
}: SectionHeadingProps) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={titleId}>{title}</h2>
        {description ? <p className="section-description">{description}</p> : null}
      </div>
      {trailing ? <div className="section-trailing">{trailing}</div> : null}
    </div>
  );
}
