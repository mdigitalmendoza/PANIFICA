#!/bin/bash
cd /home/team/shared/panifica
# Already in a git repo? Check
git status 2>/dev/null && echo "GIT_EXISTS" || echo "NO_GIT"
git remote -v 2>/dev/null | head -5