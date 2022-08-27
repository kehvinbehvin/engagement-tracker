# Engagment Tracker

# Steps to run this project without docker

1. Run `npm install` command
2. Set up a database
3. Setup database settings inside `data-source.ts` file
4. Create .env file
5. Run `npm run dev` at project root

# Building docker image
- docker login
- docker build . -t kehvinbehvin/engagement-tracker:<commit>

# Test docker image
- docker run -p 8080:8080 -d --env-file ./.env kehvinbehvin/engagement-tracker:<commit>

# Push image to registry
- docker push kehvinbehvin/engagement-tracker:<commit>

# Modules descriptions

