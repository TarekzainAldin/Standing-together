/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',           // يستخدم ts-jest
  testEnvironment: 'node',     // بيئة Node.js
  roots: ['<rootDir>/src'],    // يشمل ملفات src فقط
  testMatch: ['**/tests/**/*.test.ts'], // يشمل ملفات الاختبار
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};
