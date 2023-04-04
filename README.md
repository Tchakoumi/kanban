# Getting Started with Kanban

## Execute Project

To run the project, follow the steps below:

1. Clone the project
### `git clone https://github.com/tchakoumi/kanban.git`

2. Update env file to match .env.skeleton in base directory
```Note that the backend is based on a mysql database. So only a mysql database url can be sent else it'll fail```
```The `NX_API_BASE_URL` should be the running backend url (ex: `http://localhost:[port]`)```

3. Install project dependencies
### `npm install`

4. Launch frontend app
### `npx nx serve app`

5. Launch Backend app
### `npx nx serve api`

6. HAPPY HACKING
