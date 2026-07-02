#!/bin/sh

echo "Generating Prisma Client..."
npx prisma generate
if [ $? -ne 0 ]; then
  echo "Prisma Client generation failed!"
  exit 1
fi

MIGRATIONS_DIR="prisma/migrations"
if [ -d "$MIGRATIONS_DIR" ] && [ "$(ls -A $MIGRATIONS_DIR)" ]; then
  echo "Migrations found. Running Prisma migrate deploy..."
  npx prisma migrate deploy
else
  echo "No migrations found. Running Prisma db push..."
  npx prisma db push
fi

if [ $? -ne 0 ]; then
  echo "Database migration failed!"
  exit 1
fi

echo "Starting Backend..."
exec npm start
