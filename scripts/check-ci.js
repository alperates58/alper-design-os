import { execSync } from 'node:child_process';

function getGithubToken() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  try {
    const creds = execSync('printf "protocol=https\\nhost=github.com\\n\\n" | git credential fill', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
      shell: true
    });
    const passMatch = creds.match(/^password=(.+)$/m);
    if (passMatch) return passMatch[1].trim();
  } catch {}
  return null;
}

export async function fetchCiRunStatus(commitSha) {
  const repo = 'alperates58/alper-design-os';
  const url = `https://api.github.com/repos/${repo}/actions/runs?per_page=10`;
  const token = getGithubToken();
  const headers = {
    'User-Agent': 'alper-design-os-ci-monitor',
    'Accept': 'application/vnd.github.v3+json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, { headers });

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
  const jobsRes = await fetch(targetRun.jobs_url, { headers });
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
