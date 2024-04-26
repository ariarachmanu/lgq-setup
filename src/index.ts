#! /usr/bin/env node

import inquirer, { QuestionCollection } from 'inquirer';
import { spawnSync, SpawnSyncOptionsWithStringEncoding } from 'child_process';
import { chdir, exit } from 'process';
import { existsSync } from 'fs';

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
  type: 'list',
  name: 'project_lang',
  message: 'Choose project language ?',
  choices: ['NodeJS-Javascript', 'NodeJS-Typescript', 'PHP-Laravel', 'PHP-CakePHP']
}, {
  type: 'confirm',
  name: 'is_using_vscode',
  message: 'Development with Visual Studio Code ? ',
}, {
  type: 'confirm',
  name: 'is_yarn_installed',
  message: 'Using yarn package manager ? ',
}, {
  type: 'confirm',
  name: 'is_user_want_install_yarn',
  message: 'Install yarn package manager ? ',
  when: (answer) => !answer.is_yarn_installed
},];



inquirer
  .prompt(questions)
  .then((answers) => {
    const { repository, project_lang, is_using_vscode, is_yarn_installed, is_user_want_install_yarn } = answers;
    const folderChild = repository.split('/').pop().split('.')[0];

    spawnSync('git', ['clone', repository], opts)
    chdir(folderChild)

    if (['NodeJS-Javascript', 'NodeJS-Typescript'].includes(project_lang)) {
      const isEnvExists = existsSync('.env.sample');
      const isMakeFileExists = existsSync('Makefile.sample');

      if (isEnvExists) {
        spawnSync('cp', ['.env.sample', '.env'], opts)
      }

      if (isMakeFileExists) {
        spawnSync('cp', ['Makefile.sample', 'Makefile'], opts)
      }

      if (is_user_want_install_yarn) {
        spawnSync('npm', ['install', '--global', 'yarn'], opts)
        spawnSync('yarn', ['install'], opts)
      }

      if (is_yarn_installed) {
        spawnSync('yarn', ['install'], opts)
      }

      const { error } = spawnSync('code', ['--version'], opts);
      if (error) {
        spawnSync('echo', ['\n\nVSCode is not installed or not in PATH'], opts);
        spawnSync('echo', ['Please refer to this links'], opts);
        spawnSync('echo', ['\nhttps://safjan.com/add-vscode-to-path/\n'], opts);
        spawnSync('echo', ['To add VSCode to the PATH. And then, running the command again, Thanks.\n\n'], opts);
        exit(1);
      }

      if (is_using_vscode) {
        spawnSync('code', ['--install-extension', 'esbenp.prettier-vscode'], opts)
        spawnSync('code', ['--install-extension', 'dbaeumer.vscode-eslint'], opts)
        spawnSync('code', ['--install-extension', 'firsttris.vscode-jest-runner'], opts)
      }
    }
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });
