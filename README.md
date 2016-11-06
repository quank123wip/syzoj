# SYZOJ 2
An OnlineJudge System for OI.

# Deploying
There's currently *no* stable version of SYZOJ 2, but you can use the unstable version from git.

```
git clone https://github.com/syzoj/syzoj
cd syzoj
```

Install dependencies with `npm install` or `yarn`.

Copy the `config-example.json` file to `config.json`, and change the configures.

## Database
SYZOJ 2 uses [Sequelize](http://sequelizejs.com), which supports many database systems, including MySQL and Sqlite.

By default it use the Sqlite database `syzoj.db`, you can change it in `config.json`

## Security
You should change the `session_secret` and `judge_token` in `config.json`.

# Administration
In the database, the `is_admin` field in `user` table describes whether a user is admin or not.

To make a user be an admin, the only way is via database.

# Judge
There's no judger for SYZOJ 2 currently. But SYZOJ 2 has API compatibility with the old SYZOJ, so we can use its judger.

Please go to [syzoj-judge](https://github.com/syzoj/syzoj-judge).