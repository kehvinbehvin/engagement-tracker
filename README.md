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
- docker tag kehvinbehvin/engagement-tracker:<commit> kehvinbehvin/engagement-tracker:latest

# Test docker image
- docker run -p 8080:8080 -d --env-file ./.env kehvinbehvin/engagement-tracker:<commit>

# Push image to registry
- docker push kehvinbehvin/engagement-tracker:<commit>
- docker push kehvinbehvin/engagement-tracker:latest

# Modules descriptions
Users are admins that must register/login to access the platform. These users can add/edit/remove
newcomers from the system. Activities are units of engagement that newcomers experience in real life 
that can recorded in the system by adding/editing/removing an activity to/from a newcomer by an admin.
