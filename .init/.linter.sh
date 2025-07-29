#!/bin/bash
cd /home/kavia/workspace/code-generation/patient-history-management-system-10190-10199/patient_history_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

