/* Demo for saving a base64 file to GitHub using GitHub's SDK and Node.js */

import { Octokit, App } from "octokit";
import dotenv from 'dotenv';
import { base64Image } from './base64image.js';

dotenv.config();

// Octokit.js
// https://github.com/octokit/core.js#readme
const octokit = new Octokit({
  auth: process.env.Token
});

await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
  owner: 'smohadjer',
  repo: 's3',
  path: 'test.jpg',
  message: 'a new commit message',
  committer: {
    name: 'Monalisa Octocat',
    email: 'octocat@github.com'
  },
  content: base64Image,
  headers: {
    'X-GitHub-Api-Version': '2022-11-28'
  }
});
