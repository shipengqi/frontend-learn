#!/bin/bash
# exit on errors
set -e

npm run build

cd docs/.vuepress/dist

git init
git config user.name 'shipengqi'
git config user.email 'pooky.shipengqi@gmail.com'
git add -A
git commit -m 'deploy'

git push -f git@github.com:HcySunYang/vue-design.git master:vuepress-pages