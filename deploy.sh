#!/bin/bash
set -e


info() {
  printf "\033[0;32m$1\033[0m\n"
}

err() {
  printf "\033[0;31m$1\033[0m\n"
}

cwd=$(pwd)
if [[ ! -d "content" ]]; then
    err "Run this under project root dir, currend dir: $cwd"
    exit 1
fi

info "Deploying updates to GitHub..."

if [[ -d ./public ]]; then
  info "Deleting old public directory..."
  rm -rf public/
fi

info "Generating static files..."
hugo --minify

info "Pushing to github..."
cd public
git init --initial-branch=main
git remote add origin git@github.com:aimerneige/aimerneige.github.io.git
git add -A
msg="update site $(date)"
if [ -n "$*" ]; then
  msg="$*"
fi
git commit -am "$msg"
git push -f origin main
