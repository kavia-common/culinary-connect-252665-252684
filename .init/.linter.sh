#!/bin/bash
cd /home/kavia/workspace/code-generation/culinary-connect-252665-252684/flavorshare_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

