declare module 'bcryptjs' {
  // Minimal type surface to satisfy TS without installing @types/bcryptjs
  interface BcryptStatic {
    compare(data: string, encrypted: string): Promise<boolean>;
    compareSync(data: string, encrypted: string): boolean;
    hash(data: string, saltOrRounds: string | number): Promise<string>;
    hashSync(data: string, saltOrRounds: string | number): string;
    genSalt(rounds?: number): Promise<string>;
    genSaltSync(rounds?: number): string;
  }
  const bcrypt: BcryptStatic;
  export default bcrypt;
}
