type DownloadsResponse = {
  downloads: number;
};

type RegistryResponse = {
  "dist-tags": {
    latest: string;
  };
};

export type NpmStats = {
  latestVersion: string;
  weeklyDownloads: number;
};

const FALLBACK_STATS: NpmStats = {
  latestVersion: "0.1.0",
  weeklyDownloads: 93,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseDownloadsResponse(value: unknown): DownloadsResponse | null {
  if (!isRecord(value)) {
    return null;
  }

  const downloads = value.downloads;

  if (typeof downloads !== "number") {
    return null;
  }

  return { downloads };
}

function parseRegistryResponse(value: unknown): RegistryResponse | null {
  if (!isRecord(value)) {
    return null;
  }

  const distTags = value["dist-tags"];

  if (!isRecord(distTags)) {
    return null;
  }

  const latest = distTags.latest;

  if (typeof latest !== "string") {
    return null;
  }

  return {
    "dist-tags": {
      latest,
    },
  };
}

async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(4000),
  });

  if (!response.ok) {
    throw new Error(`Request failed for ${url}: ${response.status}`);
  }

  return response.json();
}

export async function getNpmStats(): Promise<NpmStats> {
  try {
    const [downloadsRaw, registryRaw] = await Promise.all([
      fetchJson("https://api.npmjs.org/downloads/point/last-week/slidemotion"),
      fetchJson("https://registry.npmjs.org/slidemotion"),
    ]);

    const downloads = parseDownloadsResponse(downloadsRaw);
    const registry = parseRegistryResponse(registryRaw);

    if (downloads === null || registry === null) {
      return FALLBACK_STATS;
    }

    return {
      latestVersion: registry["dist-tags"].latest,
      weeklyDownloads: downloads.downloads,
    };
  } catch {
    return FALLBACK_STATS;
  }
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en", {
    maximumFractionDigits: 1,
    notation: value >= 1000 ? "compact" : "standard",
  }).format(value);
}
