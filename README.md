# Toolkit Exam Project 2026

## Getting Started Docker development mode and local run

### Docker development mode

Build images and start containers:

```bash
bash start-dev.sh
```

### Local run

**1. Environment** In <code style="color: #28d2d0;">server</code>, create a <code style="color: #d9ff00;">.env</code> file:

<pre><code><span style="color: #e5c07b;">PORT</span>=5000
<span style="color: #e5c07b;">NODE_ENV</span>='development'
<span style="color: #e5c07b;">POSTGRES_USER</span>='your postgres name'
<span style="color: #e5c07b;">POSTGRES_PASSWORD</span>='your password';
<span style="color: #e5c07b;">POSTGRES_DB</span>='squadhelp-dev'
<span style="color: #e5c07b;">POSTGRES_HOST</span>='localhost'
<span style="color: #e5c07b;">JWT_SECRET</span>='12345'
<span style="color: #e5c07b;">SMTP_USER</span>='your email'
<span style="color: #e5c07b;">SMTP_PASS</span>='your smtp password'</code></pre>

**2. <code style="color: #28d2d0;">Server</code>** In the first terminal:

```bash
cd server
npm i
npm start
```

**3. <code style="color: #ff5500;">Client</code>** In the second terminal:

```bash
cd client
npm i
nvm use 16
npm start
```

## Frontend Tasks

### Bug fix

- Unused imports and libraries were removed
- All images will display successfully
- Refactor the user update function to prevent callers from corrupting the balance
- Fixed styles in some components
- All libraries updated

### Layout

- Created the _How it Works_ page
- Linked from the user menu: `Our Work / How it Works`
- During development, Flexbox and media queries were used

### React events

- Added an `Event` link to the Event page in the user menu
- A page has been developed that matches the style of the entire application.
- Implemented an info badge the icon next to the "Live upcoming checks" section now clearly displays the number of upcoming events

### Button group

- Added a component `ButtonGroup` to the page start contest `/startContest/nameContest`

## Backend Tasks

### DB-NO-SQL

- Added the file `task-5.mongodb.js` directory to `server/src/dbMongo`.
- An aggregation pipeline was used to count the records containing the word `паровоз` in the `Messages` collection.

### DB-SQL

- Added `server/src/dbPostgre/` directory:
  - ERD.png
  - task-6.pgsql – task-9.pgsql

### Node logger

- Implemented error logging in `server/logger/`
- Set up a scheduled job to rotate `log.ndjson`, moving its data to `server/logger/logs/currendDate-backup.ndjson`

## Full Stack

### Moderator role

- Added the new role **Moderator**
- Linked the moderator page via the "REVIEW OFFER" header navigation item
- Implemented the moderation flow added `approved` and `cancel` statuses, created moderator verification middleware, added controllers to fetch pending offers and update their status, and built the moderator page
- Added distribution of the moderator's decision to the Creative's mail

### Chat migration to SQL

- Defined Sequelize models and migrations based on `Task 6` specifications
- Rewrote the controller logic to integrate with Sequelize syntax


## Notes

### Users

| Role      | Email                   | Password |
|-----------|-------------------------|----------|
| Moderator | moderator@gmail.com     | 123456   |
| Buyer     | buyer@gmail.com         | 123456   |
| Creator   | creative@gmail.com      | 123456   |

### Payment

Test bank card details for verifying payments:

**Paying for a contest with the buyer's card:**

| Field           | Value                 |
|-----------------|-----------------------|
| Card number     | 4111 1111 1111 1111   |
| Expiry date     | 09/26                 |
| CVC/CVV         | 505                   |

**Withdrawing funds to the creator's card:**

| Field           | Value                 |
|-----------------|-----------------------|
| Card number     | 5105 1051 0510 5100   |
| Expiry date     | 09/26                 |
| CVC/CVV         | 510                   |