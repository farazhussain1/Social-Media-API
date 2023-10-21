# Social Media App

### Environment Variables

`SECRET_KEY` = secret
`PORT` = 5000
`JWT_SECRET` = secret

#Email Configuration

`EMAIL_HOST` = smtp.mailtrap.io
`EMAIL_PORT` = 2525
`EMAIL_USER` = <Your_User>
`EMAIL_PASS` = <Your_Password>

`DATABASE_URL` = DATABASE_URL="postgresql://<user>:<password>@localhost:5432/socialMedia?schema=public"

---

### Run Database Migrations

```bash
$ npx prisma migrate deploy
```

### Install Dependencies

```cmd
npm install
```

### Make Build

```cmd
npm run build
```

### Start Server

```cmd
npm run start
```

#### Note - Do not use **tsc** to compile typescript, Custom transformers will throw error, [ttypescript](https://www.npmjs.com/package/ttypescript) dependency needed, ttsc can compile typescript
