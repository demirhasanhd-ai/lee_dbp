"use client";

import { evaluateOutcomeQuality, measurableOutcomeVerbs } from "../../lib/quality/outcomeRules.mjs";

export { evaluateOutcomeQuality };
export type OutcomeKind = "program" | "course";
export type OutcomeQualityResult = ReturnType<typeof evaluateOutcomeQuality>;

export function OutcomeQualityHint({ text, kind }: { text: string; kind: OutcomeKind }) {
  const result = evaluateOutcomeQuality(text, kind);
  return (
    <div className={`outcome-quality ${result.status}`} aria-live="polite">
      <strong>{result.title}</strong>
      <div className="outcome-quality-messages">
        {result.messages.map((message) => <p key={message}>{message}</p>)}
        {result.status !== "good" && (
          <details className="outcome-accepted-verbs">
            <summary>Kabul edilen fiiller ({measurableOutcomeVerbs.length})</summary>
            <p>{measurableOutcomeVerbs.join(", ")}</p>
          </details>
        )}
      </div>
    </div>
  );
}
