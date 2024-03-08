cd "${0%/*}"
npm install
npx prisma migrate dev
npm run start:dev