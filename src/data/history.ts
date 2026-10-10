import type { ElectionDataset, ElectionSummary } from "./types";

export async function loadElectionDataset(): Promise<ElectionDataset> {
  const response = await fetch("/data/history.json");
  if (!response.ok) throw new Error("無法讀取歷史選舉資料。");

  const data: unknown = await response.json();
  if (typeof data !== "object" || data === null || !("elections" in data) || !Array.isArray(data.elections)) {
    throw new Error("歷史選舉資料格式不符合預期。");
  }

  const elections = data.elections.filter(isElectionSummary);
  if (elections.length !== data.elections.length) {
    throw new Error("部分歷史選舉資料欄位不完整。");
  }

  return { elections };
}

function isElectionSummary(value: unknown): value is ElectionSummary {
  if (typeof value !== "object" || value === null) return false;
  const election = value as Record<string, unknown>;
  const winner = election.winner;
  return (
    typeof election.id === "string" &&
    typeof election.city === "string" &&
    typeof election.office === "string" &&
    typeof election.electionDate === "string" &&
    typeof election.eligibleVoters === "number" &&
    typeof election.votesCast === "number" &&
    typeof election.turnoutRate === "number" &&
    typeof winner === "object" && winner !== null &&
    "name" in winner && typeof winner.name === "string" &&
    "party" in winner && typeof winner.party === "string" &&
    "votes" in winner && typeof winner.votes === "number" &&
    Array.isArray(election.sources) &&
    election.sources.every((source) => {
      if (typeof source !== "object" || source === null) return false;
      return "label" in source && typeof source.label === "string" &&
        "url" in source && typeof source.url === "string" &&
        "supports" in source && typeof source.supports === "string";
    })
  );
}
