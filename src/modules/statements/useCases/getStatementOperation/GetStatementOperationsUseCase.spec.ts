import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let createStatement: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType{
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw"
}

describe("Get Statement Operations", () =>{
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    createStatement = new  CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);
  });

  it("Should be able to get a specific statement operation", async () => {
    const user = await createUserUseCase.execute({
      name: "User test",
      email: "user@test.com",
      password: "123"
    });

    const statement = await createStatement.execute({
      user_id: user.id as string,
      type: "deposit" as OperationType,
      amount: 200,
      description: "deposit test 200 dollars"
    });

    const statementOperation = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: statement.id as string
    });

    expect(statementOperation).toHaveProperty("id");
    expect(statementOperation).toHaveProperty("user_id");
  });

  it("Should not be able to get statement operation from nonexistent user", async () =>{
    expect(async() => {
      await getStatementOperationUseCase.execute({
        user_id: "users not exists",
        statement_id: "statement not exists"
      });

    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("Should not be able to get statement operation from nonexistent statement", async () =>{
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "User test",
        email: "user@test.com",
        password: "123"
      });

      await getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: "statement not exists"
      });

    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
})
