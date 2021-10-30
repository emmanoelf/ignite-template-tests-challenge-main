import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { Statement } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetStatementOperationError } from "../getStatementOperation/GetStatementOperationError";
import { TransferError } from "./TransferError";

@injectable()
class TransferAmountUseCase{
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository
  ){}

  async execute({user_id, description, amount, sender_id, type}: ICreateStatementDTO): Promise<Statement>{
    const user = await this.usersRepository.findById(user_id);

    if(!user){
      throw new GetStatementOperationError.UserNotFound();
    }

    const sender = await this.statementsRepository.getUserBalance({
      user_id: sender_id as string,
      with_statement: true
    })

    if(sender.balance < amount){
      throw new TransferError()
    }

    const statement = await this.statementsRepository.create({
      user_id,
      sender_id,
      amount,
      description,
      type
    });

    return statement
  }
}
export {TransferAmountUseCase}
