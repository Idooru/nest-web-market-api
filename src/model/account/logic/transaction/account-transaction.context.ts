import { Injectable } from "@nestjs/common";
import { AccountUpdateRepository } from "../../repositories/account-update.repository";
import { CreateAccountDto } from "../../dtos/request/create-account.dto";
import { DeleteAccountDto } from "../../dtos/request/delete-account.dto";

@Injectable()
export class AccountTransactionContext {
  constructor(private readonly accountUpdateRepository: AccountUpdateRepository) {}

  public async createAccountContext(dto: CreateAccountDto): Promise<void> {
    const account = await this.accountUpdateRepository.createAccount(dto);
    if (dto.body.isMainAccount) {
      await this.setMainAccountContext(account.id, dto.user.id);
    }
  }

  public async deleteAccountContext(dto: DeleteAccountDto): Promise<void> {
    const { account, excludeAccounts, userId } = dto;
    await this.accountUpdateRepository.deleteAccount(account.id);

    if (account.isMainAccount) {
      const latestAccount = excludeAccounts.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()).at(-1);
      await this.setMainAccountContext(latestAccount.id, userId);
    }
  }

  public async setMainAccountContext(accountId: string, userId: string) {
    await this.accountUpdateRepository.disableAllAccount(userId);
    await this.accountUpdateRepository.setMainAccount({ accountId });
  }
}
