import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase

enum OperationType{
   DEPOSIT = "deposit",
   WITHDRAW = "withdraw"
}

describe("Create Statements - Deposits and withdraws", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);
  });

  it("Should be able to deposit", async () => {
    const user = await createUserUseCase.execute({
      name: "User Test",
      email: "user@test.com",
      password: "123"
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: "deposit" as OperationType,
      amount: 200,
      description: "200 dollars deposit test"
    });

    expect(statement).toHaveProperty("id");
    expect(statement).toHaveProperty("user_id");
  });

  it("Should be able to withdraw", async () =>{
    const user = await createUserUseCase.execute({
      name: "User Test",
      email: "user@test.com",
      password: "123"
    });

    await createStatementUseCase.execute({
      user_id: user.id as string,
      type: "deposit" as OperationType,
      amount: 200,
      description: "200 dollars deposit test"
    });

    const statementWithdraw = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: "withdraw" as OperationType,
      amount: 100,
      description: "100 dollars withdraw test"
    });

    expect(statementWithdraw).toHaveProperty("id");
    expect(statementWithdraw).toHaveProperty("user_id");
  });

})
