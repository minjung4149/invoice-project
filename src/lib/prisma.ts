import {PrismaClient} from '@prisma/client';

declare global {
  // 개발 환경에서 Prisma 인스턴스 중복 생성을 방지하기 위한 글로벌 선언
  const prisma: PrismaClient | undefined;
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// 싱글톤 방식으로 Prisma 인스턴스 생성 및 캐싱
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
