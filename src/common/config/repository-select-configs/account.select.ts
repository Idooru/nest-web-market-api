export interface AccountSelect {
  account: string[];
}

export const accountSelect: AccountSelect = {
  account: [
    "account.id",
    "account.bank",
    "account.accountNumber",
    "account.balance",
    "account.isMainAccount",
    "account.createdAt",
  ],
};
