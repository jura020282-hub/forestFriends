#!/usr/bin/bash
read -p "Commit description: " desc
cd generator
node ./generator.js
git add -A
git commit -m "$desc"
git pull --rebase
git push
cd ..