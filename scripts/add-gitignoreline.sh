# https://stackoverflow.com/a/16244970
git config --local filter.gitignoreline.clean "sed -E '/gitignoreline|gitIL/d'"
git config --global filter.gitignoreline.smudge cat
