# Kdovi
> questions from users

## Setup

### Prerequisites

* node.js (v.6.3.0 or more recent)
* Redis (stable)
* MySQL (5.6.27 or more recent)

### Dev environment

1. install node packages `npm i`
1. create a copy of `env.example` and save it as `.env`
1. update variables in `.env`
	* `NODE_ENV=dev`
1. run db migration `npm run migrate` which creates a empty database with schema
1. start server with `npm start nodemon` or synchronization scripts

#### Notes

* [dotenv](https://www.npmjs.com/package/dotenv) uses `.env`
* linting follows [Airbnb's ESLint config](https://www.npmjs.com/package/eslint-config-airbnb)

### Deployment to production

* set env variables listed in `env.example`
