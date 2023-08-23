# HMIS version 2

Hospital Monitoring Inventory System, inventory for all Hospitals in Palawan.

## Installation

Install hmis_v2 client and backend

Clone Repository

```bash
  git clone https://github.com/PICTP/hmis_v2.git hmis_v2
```

Client Side:

```bash
  cd hmis_v2/pwa && npm install
  npm start
```

Backend Side:

```bash
  cd hmis_v2/api
  npx prisma db push
  npx prisma migrate dev
  pnpm install
  pnpm start
```

Generate Routes in Backend

```bash
  npx nest generate route_name
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DATABASE_URL`

`PORT`

`PRODUCT_KEY_SECRET`

`SECRET_KEY`

`ACCESS_TOKEN_SECRET`

`ACCESS_TOKEN_EXPIRATION`

`REFRESH_TOKEN_SECRET`

`REFRESH_TOKEN_EXPIRATION`

## Authors

- [@kelxety](https://www.github.com/kelxety)

- [@krat13](https://github.com/KRAT13)

- [@rjcc88](https://github.com/rjcc88)

- [@ekingkong](https://github.com/ekingkong)
