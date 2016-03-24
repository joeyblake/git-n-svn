A collection of tools for git INSIDE svn
========================================

Installation

```npm install -g git-n-svn```

Currently there is one command.

```git-n-svn setup <directoryName>```

Then follow the prompts.

Setup will do the following things:
* Check and set the proper ignoring in svn and git global config files
* Checkout the remote svn directory to the directory name you specified
* Initialize a git repo
* Point the git repo to the specified remote git repository
* Show you the svn and git status of the files so you can decide what to do with any stragglers

https://github.com/joeyblake/git-n-svn
