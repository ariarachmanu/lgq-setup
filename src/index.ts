#! /usr/bin/env node

import inquirer, { QuestionCollection } from 'inquirer';
import { exec, spawnSync, SpawnSyncOptionsWithStringEncoding } from 'child_process';
import { chdir } from 'process';

const opts: SpawnSyncOptionsWithStringEncoding = {
  encoding: 'utf8',
  stdio: 'inherit'
};


const questions: QuestionCollection = [{
  type: 'input',
  name: 'repository',
  message: 'input link repository',
  validate: (answer) => {
    if (answer === '') {
      return "  Plase, input valid link url repository"
    }
    return true
  },
}, {
  type: 'confirm',
  name: 'isUsingVsCode',
  message: 'Development with Visual Studio Code ? ',
}];



inquirer
  .prompt(questions)
  .then((answers) => {
    const { repository, isUsingVsCode } = answers;
    const folderChild = repository.split('/').pop().split('.')[0];

    spawnSync('git', ['clone', repository], opts)
    chdir(folderChild)

    if (isUsingVsCode) {
      spawnSync('code', ['--install-extension', 'esbenp.prettier-vscode'])
      spawnSync('code', ['--install-extension', 'dbaeumer.vscode-eslint'])
    }

    spawnSync('cp', ['.env.sample', '.env'])
    spawnSync('yarn', ['install'])
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });