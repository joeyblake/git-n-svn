#!/usr/bin/env node

require('shelljs/global');

var co = require('co'),
    prompt = require('co-prompt'),
    program = require('commander');

function gitIgnore() {
  var global_gitignore = exec( 'git config --get core.excludesfile', { silent:true } ).stdout.replace("\n",'');
  if ( exec('grep .svn ' + global_gitignore, { silent:true } ).code !== 0 ) {
    return ( exec('echo ".svn" >> ' + global_gitignore, { silent:true } ).code === 0 );
  }
  return false;
}

function svnIgnore() {
  var global_svnignore = '~/.subversion/config';
  if ( exec('grep .git ' + global_svnignore, { silent:true } ).code !== 0 ) {
    return ( exec("sed -i -e '/global-ignores=/s/$/ \.git \.git\*/' " + global_svnignore, { silent:true } ).code === 0 );
  }
  return false;
}

program
  .arguments('<dirname>')
  .option('-s, --svn-repo <svn-repo>', 'The svn repository')
  .option('-g, --git-repo <git-repo>', 'The git repository')
  .action( function ( dirname ) {
    co( function *() {
      var svnRepo, gitRepo;

      if ( gitIgnore() ) {
          echo( "git ignoring svn." );
      }

      if ( svnIgnore() ) {
          echo( "svn ignoring git." );
      }

      svnRepo = yield prompt('svn repo: ');
      if ( exec( 'svn ls ' + svnRepo, { silent:true } ).code !== 0 ) {
        echo( 'Error: ' + svnRepo + ' is not a svn repo' );
        exit( 1 );
      }

      gitRepo = yield prompt('git repo: ');

      if ( exec( 'svn checkout ' + svnRepo + ' ' + dirname ).code !== 0 ) {
        echo( 'Error: svn checkout failed' );
        exit( 1 );
      }

      cd( dirname );

      if ( exec('git init').code !== 0 ) {
        echo( 'Error: git init failed' );
        exit( 1 );
      }

      if ( exec( 'git ls-remote ' + gitRepo, { silent:true } ).code !== 0 ) {
        echo( 'Error: ' + gitRepo + ' is not a git repo' );
        exit( 1 );
      }

      if ( exec( 'git remote add -f origin ' + gitRepo ).code !== 0 ) {
        echo( 'Error: git origin failed' );
        exit( 1 );
      }

      if ( exec( 'git checkout -f master ' ).code !== 0 ) {
        echo( 'Error: git checkout failed' );
        exit( 1 );
      }

      echo('==== git ======');
      exec( 'git status' );
      echo('===== svn =====');
      exec( 'svn status' );

      echo( 'RAGE GET TO GIT IN SVNING!' );
      exit();
      //svn checkout svnRepo dirname
      //cd dirname
      //git init
      //git remote add -f origin gitRepo
      //git checkout -f master
      //global gitignore
      //global svn ignore
      //svn status
      //git status

    });
  })
  .parse(process.argv);
