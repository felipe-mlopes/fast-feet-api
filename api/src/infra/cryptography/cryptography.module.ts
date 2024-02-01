import { Module } from '@nestjs/common';

import { Encrypter } from '@/domain/delivery/cryptography/encrypter';
import { HashGenerator } from '@/domain/delivery/cryptography/hash-generator';
import { HashComparer } from '@/domain/delivery/cryptography/hash-comparer';

import { JwtEncrypter } from './jwt-encrypter';
import { BcryptHasher } from './bcrypt-hasher';

@Module({
  /*   imports: [
    JwtModule.register({
      global: true,
    }),
  ], */
  providers: [
    {
      provide: Encrypter,
      useClass: JwtEncrypter,
    },
    {
      provide: HashGenerator,
      useClass: BcryptHasher,
    },
    {
      provide: HashComparer,
      useClass: BcryptHasher,
    },
  ],
  exports: [Encrypter, HashGenerator, HashComparer],
})
export class CryptographyModule {}
