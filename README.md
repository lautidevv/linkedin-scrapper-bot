
# linkedin scrapper bot

The goal of this project is to make a bot that greets new users and catalogs them into the Lautidev discord server by scraping data from the linkedin accounts of new users.




## Principles


Any server user can participate in the development of this bot. From taking out features to solving bugs. It is a community server for the community.

## How to participate?

First, to participate you must be part of the community of [discord](https://discord.gg/P7g9XJ4URc)


## Collaborate with code
If you wish to contribute code, please:

- Review the open issues or create a new one explaining the improvement or bug to fix.

- Make a fork of the repository.

- Create a new branch for your feature or bug fix.

- Write and test your code.

- Make sure to follow the existing code style guidelines.

- Send a Pull Request to the develop branch with a detailed description of the proposed changes and reference the related issue.

## Contribute ideas, bugs or feedback

If you have an idea, find a bug or want to give feedback on the project:

- Open a new issue in the repository describing your idea, the bug you found or the feedback you want to share.
- Be as detailed as possible in the description.
- If possible, include screenshots or any other resource that can help to better understand your point.


## Configuration

````
cp .default.env .env
````

In the .env file we must complete the following data:
- TOKEN: to obtain it we must create a bot by logging on to https://discord.com/developers/applications. After having created it we go to the "Bot" section > generate token.
- COOKIE: with LI cookie value. Get from here: https://www.youtube.com/watch?v=H8BVdAIyFJM
- GUILD_ID: we must enter the browser and create our server in the Discord account we will use, then copy the first set of numbers after /channels
- CLIENT_ID: we go to our Bot configuration > "OAuth2" section > General > Client ID > Copy

Then, go to https://discord.com/developers/applications > And check the following options:
- Requires OAuth2 Code Grant
- Presence Intent
- Server Members Intent
- Message Content Intent


## How to add the bot to the server

- Invite the bot to the channel with this link: `https://discord.com/api/oauth2/authorize?client_id=CLIENT_ID&permissions=8&scope=bot%20applications.commands`
- Copy and paste the CLIENT_ID you have in the .env file previously completed into the link.

## How to run

- Run `node register-commands.js` only once.
- Run `npm run dev`

## How to use
Type `/perfil url` url is the link to the desired LI profile, within the server where the bot is located:  ex.: https://www.linkedin.com/in/matias-gumma/
