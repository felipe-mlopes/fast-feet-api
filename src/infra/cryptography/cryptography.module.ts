import { Module } from '@nestjs/common';

import { BcryptHasher } from './bcrypt-hasher';
import { JwtEncrypter } from './jwt-encrypter';

import { HashGenerator } from '@/domain/delivery/cryptography/hash-generator';
import { HashComparer } from '@/domain/delivery/cryptography/hash-comparer';
import { Encrypter } from '@/domain/delivery/cryptography/encrypter';

@Module({
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
