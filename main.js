const { Octokit } = require("@octokit/rest");
const simpleGit = require('simple-git');
const prompt = require('prompt');
const path = require('path');

const git = simpleGit();

prompt.start();

const get = (name) => {
  return new Promise((resolve, reject) => {
    prompt.get([name], function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result[name]);
      }
    });
  });
};

const main = async () => {
  console.log("=======================================");
  console.log("GitHub Repository Cloner");
  console.log("This script will clone all repositories from a specified GitHub organization.");
  console.log("You will be asked to provide the organization name and your GitHub personal access token.");
  console.log("Your GitHub personal access token will only be used locally and never stored in any third-party servers.");
  console.log("=======================================");

  const orgName = await get('Please enter the organization name: ');
  const githubToken = await get('Please enter your GitHub personal access token: ');
  const clonePath = await get('Please enter the file path to clone the repos into or drag the destination folder into the terminal: ');

  const octokit = new Octokit({ auth: githubToken });

  try {
    const { data } = await octokit.repos.listForOrg({ org: orgName, type: 'all' });
    // console log the total length of repos available in org
    console.log(`Found ${data.length} repositories in ${orgName}.`);
    // list all repos
    console.log('List of repos:');
    data.forEach(repo => console.log(repo.name));

    // ask to proceed with cloning
    const proceed = await get('Do you want to proceed cloning all the repos? (yes/no)');
    if (proceed !== 'yes') {
      console.log('Cloning aborted.');
      return;
    }

    let remainingRepos = data.length; // Initialize remainingRepos with the total number of repos

    for (let repo of data) {
      try {
        if (repo.clone_url) {
          const repoPath = path.join(clonePath, repo.name);
          await git.clone(repo.clone_url, repoPath);
          remainingRepos--; // Decrease the remainingRepos count after cloning a repo
          console.log(`Cloned ${repo.name} into ${repoPath}, ${remainingRepos} repos remaining.`);

          // if all repos are cloned, log success message
          if (remainingRepos === 0) {
            console.log("=======================================");
            console.log('All repositories cloned successfully!');
            console.log("=======================================");
          }
        } else {
          console.error(`Failed to clone ${repo.name}: clone_url is undefined`);
        }
      } catch (err) {
        console.error('Failed to clone:', err);
      }
    }
  } catch (err) {
    console.error('Failed to get repos in org', err);
  }
}

module.exports = main();