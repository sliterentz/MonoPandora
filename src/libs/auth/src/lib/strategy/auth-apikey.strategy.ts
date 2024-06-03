export interface AuthModuleOption {
  jwtPrivateKeyPath: string;
  jwtPublicKeyPath: string;
  jwtKey: string;
  jwtAlgorithm: string;
  cryptoAlgorithm: string;
  cryptoIvLength: string;
  cryptoKeyLength: string;
  secret: string;
  apiKey: string;
}

export class GlobalOptions {
  static cryptoAlgorithm: string;
  static cryptoIvLength: string;
  static cryptoKeyLength: string;
  static secret: string;
}
