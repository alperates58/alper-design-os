/**
 * ALPER DESIGN OS - Live GitHub Actions CI Monitor
 * Fetches real runtime evidence directly from GitHub Actions API.
 */

export async function fetchCiRunStatus(commitSha) {
  const repo = 'alperates58/alper-design-os';
  const url = `https://api.github.com/repos/${repo}/actions/runs?per_page=10`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'alper-design-os-ci-monitor',
      'Accept': 'application/vnd.github.v3+json'
    }
  });

  if (!res.ok) {
    throw new Error(`GitHub API HTTP ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  const runs = data.workflow_runs || [];

  let targetRun = null;
  if (commitSha) {
    targetRun = runs.find(r => r.head_sha === commitSha);
  } else {
    targetRun = runs[0];
  }

  if (!targetRun) {
    return {
      found: false,
      message: `No workflow run found${commitSha ? ` for commit ${commitSha}` : ''}.`
    };
  }

  // Fetch jobs for this run
  const jobsRes = await fetch(targetRun.jobs_url, {
    headers: {
      'User-Agent': 'alper-design-os-ci-monitor',
      'Accept': 'application/vnd.github.v3+json'
    }
  });
  let jobs = [];
  if (jobsRes.ok) {
    const jobsData = await jobsRes.json();
    jobs = (jobsData.jobs || []).map(j => ({
      id: j.id,
      name: j.name,
      status: j.status,
      conclusion: j.conclusion,
      startedAt: j.started_at,
      completedAt: j.completed_at,
      failedStep: j.steps?.find(s => s.conclusion === 'failure')?.name || null
    }));
  }

  return {
    found: true,
    runId: targetRun.id,
    name: targetRun.name,
    headSha: targetRun.head_sha,
    status: targetRun.status,
    conclusion: targetRun.conclusion,
    htmlUrl: targetRun.html_url,
    createdAt: targetRun.created_at,
    updatedAt: targetRun.updated_at,
    jobs
  };
}

// CLI entrypoint
if (process.argv[1] && process.argv[1].endsWith('check-ci.js')) {
  const sha = process.argv[2] || null;
  fetchCiRunStatus(sha).then(info => {
    console.log(JSON.stringify(info, null, 2));
  }).catch(err => {
    console.error('Error fetching CI status:', err.message);
    process.exit(1);
  });
}
