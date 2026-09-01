import express from 'express';

const router = express.Router();

// Helper to extract clean username from URL or handle
function cleanHandle(input) {
  if (!input) return '';
  let str = input.trim();
  if (str.endsWith('/')) str = str.slice(0, -1);
  const parts = str.split('/');
  return parts[parts.length - 1];
}

// GET /api/integrations/github/:handle
router.get('/github/:handle', async (req, res) => {
  const username = cleanHandle(req.params.handle);
  if (!username) {
    return res.status(400).json({ error: 'INVALID_USERNAME', message: 'GitHub username or profile URL required.' });
  }

  try {
    const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
      headers: { 'User-Agent': 'Intelligent-Leave-Priority-System-App' }
    });

    if (!userRes.ok) {
      return res.json({
        available: false,
        username,
        error: `GitHub user '${username}' not found or rate limited.`,
        message: 'GitHub analysis unavailable'
      });
    }

    const userData = await userRes.json();

    // Fetch top public repos
    let reposData = [];
    try {
      const reposRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=6`, {
        headers: { 'User-Agent': 'Intelligent-Leave-Priority-System-App' }
      });
      if (reposRes.ok) {
        reposData = await reposRes.json();
      }
    } catch (e) {
      // Repos fetch non-critical
    }

    // Calculate technical score
    const repoCount = userData.public_repos || 0;
    const followers = userData.followers || 0;
    const stars = reposData.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
    const techScore = Math.min(100, Math.round(repoCount * 2 + followers * 1.5 + stars * 3 + 40));

    return res.json({
      available: true,
      username: userData.login,
      name: userData.name || userData.login,
      avatarUrl: userData.avatar_url,
      profileUrl: userData.html_url,
      publicRepos: userData.public_repos,
      followers: userData.followers,
      following: userData.following,
      createdAt: userData.created_at,
      bio: userData.bio,
      technicalScore: techScore,
      engagementLevel: techScore > 80 ? 'Strong' : techScore > 60 ? 'Moderate' : 'Developing',
      recentRepos: reposData.map(r => ({
        name: r.name,
        language: r.language || 'Code',
        stars: r.stargazers_count,
        forks: r.forks_count,
        url: r.html_url,
        updatedAt: r.updated_at
      }))
    });
  } catch (err) {
    return res.json({
      available: false,
      username,
      error: err.message,
      message: 'GitHub analysis unavailable'
    });
  }
});

// GET /api/integrations/leetcode/:handle
router.get('/leetcode/:handle', async (req, res) => {
  const username = cleanHandle(req.params.handle);
  if (!username) {
    return res.status(400).json({ error: 'INVALID_USERNAME', message: 'LeetCode username or profile URL required.' });
  }

  try {
    // Attempt fetching from public LeetCode wrapper API
    const lcRes = await fetch(`https://leetcode-api-faisalshohag.vercel.app/${encodeURIComponent(username)}`);

    if (!lcRes.ok) {
      // Try secondary endpoint
      const lcRes2 = await fetch(`https://alfa-leetcode-api.onrender.com/userProfile/${encodeURIComponent(username)}`);
      if (lcRes2.ok) {
        const data2 = await lcRes2.json();
        return res.json({
          available: true,
          username,
          totalSolved: data2.totalSolved || 0,
          easySolved: data2.easySolved || 0,
          mediumSolved: data2.mediumSolved || 0,
          hardSolved: data2.hardSolved || 0,
          ranking: data2.ranking || 'N/A',
          contestRating: data2.contestRating || null,
          consistencyScore: Math.min(100, Math.round(((data2.totalSolved || 0) / 400) * 100))
        });
      }

      return res.json({
        available: false,
        username,
        error: `LeetCode profile '${username}' not accessible.`,
        message: 'LeetCode analysis unavailable'
      });
    }

    const lcData = await lcRes.json();

    const easy = lcData.easySolved || 0;
    const medium = lcData.mediumSolved || 0;
    const hard = lcData.hardSolved || 0;
    const total = lcData.totalSolved || (easy + medium + hard);

    const leetScore = Math.min(100, Math.round((easy * 0.2) + (medium * 0.5) + (hard * 1.0)));

    return res.json({
      available: true,
      username,
      name: lcData.name || username,
      totalSolved: total,
      easySolved: easy,
      mediumSolved: medium,
      hardSolved: hard,
      ranking: lcData.ranking || 'N/A',
      contributionPoint: lcData.contributionPoint || 0,
      reputation: lcData.reputation || 0,
      technicalScore: leetScore,
      consistencyScore: total > 200 ? 90 : total > 100 ? 75 : total > 30 ? 60 : 40
    });
  } catch (err) {
    return res.json({
      available: false,
      username,
      error: err.message,
      message: 'LeetCode analysis unavailable'
    });
  }
});

export default router;
