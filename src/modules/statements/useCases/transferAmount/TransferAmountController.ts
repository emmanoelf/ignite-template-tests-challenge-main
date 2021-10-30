import { Request, Response } from "express";
import { container } from "tsyringe";
import { TransferAmountUseCase } from "./TransferAmountUseCase";

enum OperationType{
  TRANSFER = 'transfer',
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

class TransferAmountController{
  async execute(request: Request, response: Response): Promise<Response>{
    const { id: sender_id } = request.user;
    const { amount, description } = request.body;
    const { receiver_id } = request.params;

    const transferAmountUseCase = container.resolve(TransferAmountUseCase);

    console.log("user")
    console.log(request.user)

    console.log("chegou aqui");



    const transferAction = await transferAmountUseCase.execute({
      user_id: receiver_id,
      amount,
      type: "transfer" as OperationType,
      description,
      sender_id,
    });

    console.log("depois da execucao transferencia");

    return response.status(201).json(transferAction)
  }
}

export { TransferAmountController }
