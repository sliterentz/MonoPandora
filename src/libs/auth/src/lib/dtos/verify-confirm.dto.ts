import { IsNotEmpty, IsNumber } from 'class-validator';
import { IVerrifyConfirmForm } from '../types';

export class VerifyConfirmDTO implements IVerrifyConfirmForm {
  @IsNotEmpty()
  @IsNumber()
  authConfirmToken!: number;
};
