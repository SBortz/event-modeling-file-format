#!/bin/bash
cd /home/openclaw/.openclaw/workspace/giraflow/giraflow
export IF_FILE=../../Robbi/simple-todo-app/simple-todo-app.giraflow.json
npx vite --port 4323 --host 0.0.0.0
