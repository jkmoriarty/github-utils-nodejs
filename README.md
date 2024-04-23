# NodeJS Github Utils

## Introduction

I recently joined an org with many repos that I wanted to clone to my local machine. I decided to write a simple Node.js script to automate the process. This script reads a list of repositories from a JSON object and clones them to a specified directory.

It asks for the following:
- Organization Name
- GitHub Personal Access Token
- Directory on localmachine to clone the repos to

Note: This script does not store your GitHub Personal Access Token. It is only used to authenticate the script with GitHub. All information is handled locally and not sent to any third parties.

## Getting Started

I use `pnpm`, so:

1. Clone the repository to your local machine.
2. Run `pnpm install` to install the dependencies.
3. Run `pnpm start` to start the script.
4. Follow the prompts to clone the repositories.

## Troubleshooting

If you encounter any errors during the cloning process, the error message will be logged to the console. Common issues might include:

- A repository's `clone_url` is undefined: This means the repository data might be incorrect or the repository does not exist.
- Failure to clone a repository: This could be due to network issues, or the repository might be private and requires a personal access token with appropriate access rights.