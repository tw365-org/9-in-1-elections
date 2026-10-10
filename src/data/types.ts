export interface CandidateSupport {
  candidateId: string;
  candidateName: string;
  supportPercent: number;
}

export interface PollRecord {
  id: string;
  city: string;
  election: string;
  pollster: string;
  sponsor: string | null;
  fieldworkStart: string;
  fieldworkEnd: string;
  publishedAt: string;
  sampleSize: number | null;
  population: string;
  method: string | null;
  marginOfError: number | null;
  candidateLineupId: string;
  questionScenarioId: string;
  questionText: string;
  candidates: CandidateSupport[];
  undecidedPercent: number | null;
  sourceLabel: string;
  sourceUrl: string;
  is_mock: boolean;
}

export interface PollDataset {
  updatedAt: string | null;
  polls: PollRecord[];
}

export interface ElectionSummary {
  id: string;
  city: string;
  office: string;
  electionDate: string;
  eligibleVoters: number;
  votesCast: number;
  turnoutRate: number;
  winner: {
    name: string;
    party: string;
    votes: number;
  };
  sources: Array<{
    label: string;
    url: string;
    supports: string;
  }>;
}

export interface ElectionDataset {
  elections: ElectionSummary[];
}

export interface PollSeries {
  id: string;
  label: string;
  polls: PollRecord[];
}
