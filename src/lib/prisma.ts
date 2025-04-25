import { PrismaClient } from '@prisma/client';

declare global {
  // 글로벌 스코프에 prisma 붙이기 (개발 환경에서 중복 방지)
  // @ts-ignore
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
