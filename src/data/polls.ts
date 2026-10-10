import type { PollDataset, PollRecord, PollSeries } from "./types";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

function isPoll(value: unknown): value is PollRecord {
  if (!isRecord(value)) return false;

  const isNullableString = (entry: unknown) => entry === null || typeof entry === "string";
  const isNullableNumber = (entry: unknown) => entry === null || typeof entry === "number";
  const candidatesAreValid = Array.isArray(value.candidates) && value.candidates.every((candidate) =>
    isRecord(candidate) &&
    typeof candidate.candidateId === "string" &&
    typeof candidate.candidateName === "string" &&
    typeof candidate.supportPercent === "number" &&
    candidate.supportPercent >= 0 && candidate.supportPercent <= 100,
  );
  const sourceUrlIsValid = typeof value.sourceUrl === "string" &&
    /^https?:\/\//i.test(value.sourceUrl);

  return (
    typeof value.id === "string" &&
    typeof value.city === "string" &&
    typeof value.election === "string" &&
    typeof value.pollster === "string" &&
    isNullableString(value.sponsor) &&
    typeof value.fieldworkStart === "string" &&
    typeof value.fieldworkEnd === "string" &&
    typeof value.publishedAt === "string" &&
    isNullableNumber(value.sampleSize) &&
    typeof value.population === "string" &&
    isNullableString(value.method) &&
    isNullableNumber(value.marginOfError) &&
    typeof value.candidateLineupId === "string" &&
    typeof value.questionScenarioId === "string" &&
    typeof value.questionText === "string" &&
    candidatesAreValid &&
    isNullableNumber(value.undecidedPercent) &&
    typeof value.sourceLabel === "string" &&
    sourceUrlIsValid &&
    typeof value.isMock === "boolean"
  );
}

export async function loadPollDataset(): Promise<PollDataset> {
  const response = await fetch("/data/polls.json");
  if (!response.ok) throw new Error("無法讀取民調資料。");

  const data: unknown = await response.json();
  if (!isRecord(data) || !Array.isArray(data.polls) || !data.polls.every(isPoll)) {
    throw new Error("民調資料格式不符合預期。");
  }

  return {
    updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : null,
    polls: data.polls,
  };
}

export function getRecentPolls(polls: PollRecord[], now = new Date()): PollRecord[] {
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - 30);
  return polls.filter((poll) => {
    const fieldworkEnd = new Date(poll.fieldworkEnd);
    return fieldworkEnd >= cutoff && fieldworkEnd <= now;
  });
}

export function groupComparablePolls(polls: PollRecord[]): PollSeries[] {
  const groups = new Map<string, PollRecord[]>();

  for (const poll of polls) {
    const key = [
      poll.city,
      poll.election,
      poll.candidateLineupId,
      poll.population,
      poll.questionScenarioId,
    ].join("|");
    const group = groups.get(key) ?? [];
    group.push(poll);
    groups.set(key, group);
  }

  return [...groups.entries()].map(([id, records]) => ({
    id,
    label: `${records[0]?.city ?? ""}・${records[0]?.population ?? ""}`,
    polls: [...records].sort((left, right) =>
      left.fieldworkStart.localeCompare(right.fieldworkStart),
    ),
  }));
}
