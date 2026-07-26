import { Printer } from "lucide-react";

type PrintCourseButtonProps = {
  href: string;
  label: string;
};

export function PrintCourseButton({ href, label }: PrintCourseButtonProps) {
  return (
    <a className="package-print-button" href={href} target="_blank" rel="noreferrer" aria-label={label}>
      <Printer size={16} aria-hidden="true" />
      <span>Yazdır</span>
    </a>
  );
}
