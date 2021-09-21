#!/bin/sh

set -e
printf "\033[0;32mDeploying updates to GitHub...\033[0m\n"
hugo
cd public
git checkout master
git add -A
msg="update site $(date)"
if [ -n "$*" ]; then
  msg="$*"
fi
git commit -m "$msg"
git push origin master
