export interface AccountSelect {
  account: string[];
}

export const accountSelect: AccountSelect = {
  account: [
    "account.id as accountId",
    "account.bank as accountBank",
    "account.accountNumber as accountNumber",
    "account.balance as accountBalance",
    "account.isMainAccount as isMainAccount",
    "account.createdAt as accountCreatedAt",
  ],
};
