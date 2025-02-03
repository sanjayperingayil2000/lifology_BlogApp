
HI, So if you are just starting please make sure node is installed on your system.

SO lets start.

-- Clone the Git repository on your vs code or any coding softwares.
-- run npm i
-- create .env file
-- -- add fileds like
      DATABASE_URL=<your-postgresql-url>  // create your own db prisma+postgres or postgresql+prisma in neon 
      JWT_SECRET=<your-secret-key>    
      NEXT_PUBLIC_GRAPHQL_URI=http://localhost:3000/api/graphql   //This will be your port were api is you can view

        To create jwt token you can run below code on any plane node terminal and paste above JWT_SECRET
        const crypto = require('crypto');
        const jwtSecret = crypto.randomBytes(64).toString('hex');
        console.log('JWT_SECRET:', jwtSecret);
-- npx prisma migrate dev //for initialising the db tables
-- npx prisma studio (optional) //To view tables and datas on db
-- npm run seed //To add datas to the db automatically
--npm run dev //To start the server


NOW THE PROJECT WILL RUNNING ON PORT "localhost:3000"
Consider checking the cors url provided while hosting on route.ts file


APIS used are :
--POST      --/api/auth/login--/api/auth/signup     (signup and login)
--GET       --/api/posts                            (To get all the posts)
--PUT       --/api/posts/:id                        (To create post)
--DELETE    --/api/posts/:id	                    (To delete a post)





--------------------------------------------------------------------------------------------------------------






This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.





