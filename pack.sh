#!/bin/sh
zip -r extension.zip ./ -x '.git*' -x '.vscode*' -x 'jest*' -x 'node_modules*' -x '.gitignore' -x '.prettierrc.json' -x 'content.spec.js' -x 'pack.sh' -x 'package.json' -x 'package-lock.json' -x 'temp'

