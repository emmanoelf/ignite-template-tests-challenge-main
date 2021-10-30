import { AppError } from "../../../../shared/errors/AppError";

export class TransferError extends AppError{
  constructor(){
    super("You don't have enough funds for this transaction.", 400);
  }
}
