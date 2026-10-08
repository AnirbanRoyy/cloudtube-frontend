#!/usr/bin/env bash
# PostToolUse (Write|Edit): format the whole codebase, then lint.
# Runs sequentially in one script because hooks in the same group run in parallel.
cd "$CLAUDE_PROJECT_DIR" || exit 0

bunx prettier --write . >/dev/null 2>&1

if ! out=$(npm run lint --silent 2>&1); then
    {
        echo "ESLint reported problems after your last edit. Fix them, then tell the user what was wrong and what you changed:"
        echo "$out"
    } >&2
    exit 2 # exit 2 feeds stderr back to Claude
fi
