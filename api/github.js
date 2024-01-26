import { Octokit } from "@octokit/rest";
import dotenv from 'dotenv';

dotenv.config();

const octokit = new Octokit({
  auth: process.env.Token
});

const getSHA = async (pathToFile) => {
  try {
    const { data } = await octokit.request(`GET /repos/{owner}/{repo}/contents/{path}`, {
      owner: 'smohadjer',
      repo: 's3',
      path: pathToFile
    });
    return data.sha;
  } catch(error) {
    return undefined;
  }
};

export default async (req, res) => {
    if (req.method === 'POST') {
      const sha = await getSHA(req.body.filename);

      octokit.repos.createOrUpdateFileContents({
        owner: 'smohadjer',
        repo: 's3',
        path: req.body.filename,
        message: 'added via GitHub API',
        committer: {
          name: 'Saeid Mohadjer',
          email: 'saeid@fastmail.fm'
        },
        sha: sha,
        content: Buffer.from(req.body.text).toString('base64')
      }).then((response) => {
        res.status(200).send(`<a href="${response.data.content.html_url}">${response.data.content.html_url}</a>`);
      })
    }
}
