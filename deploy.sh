#!/bin/bash

# 1. Ask for a commit message (Optional)
echo "💎 Enter what you changed (or just press Enter):"
read message
if [ -z "$message" ]; then
  message="Royal Update for Glow By Vee"
fi

# 2. Stage all new code and images
git add .

# 3. Commit the changes
git commit -m "$message"

# 4. Push to GitHub (This triggers Vercel automatically)
git push origin main

echo "👑 Your changes are now live on Vercel!"
