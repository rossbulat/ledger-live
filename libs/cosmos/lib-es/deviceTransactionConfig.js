import { getMainAccount, getAccountUnit } from "@ledgerhq/ledger-common/lib/account";
import { formatCurrencyUnit } from "@ledgerhq/ledger-common/lib/currencies";
var getSendFields = function (_a) {
    var amount = _a.status.amount, account = _a.account, source = _a.source;
    var fields = [];
    fields.push({
        type: "text",
        label: "Type",
        value: "Send"
    });
    if (!amount.isZero()) {
        fields.push({
            type: "text",
            label: "Amount",
            value: formatCurrencyUnit(getAccountUnit(account), amount, {
                showCode: true,
                disableRounding: true
            })
        });
    }
    fields.push({
        type: "address",
        label: "From",
        address: source
    });
    return fields;
};
function getDeviceTransactionConfig(_a) {
    var account = _a.account, parentAccount = _a.parentAccount, transaction = _a.transaction, status = _a.status;
    var mode = transaction.mode, memo = transaction.memo, validators = transaction.validators;
    var estimatedFees = status.estimatedFees;
    var mainAccount = getMainAccount(account, parentAccount);
    var source = mainAccount.freshAddress;
    var fields = [];
    switch (mode) {
        case "send":
            fields = getSendFields({
                transaction: transaction,
                status: status,
                parentAccount: parentAccount,
                account: account,
                source: source
            });
            break;
        case "delegate":
            fields.push({
                type: "text",
                label: "Type",
                value: "Delegate"
            });
            fields.push({
                type: "cosmos.delegateValidators",
                label: "Validators"
            });
            break;
        case "undelegate":
            fields.push({
                type: "text",
                label: "Type",
                value: "Undelegate"
            });
            fields.push({
                type: "text",
                label: "Amount",
                value: formatCurrencyUnit(getAccountUnit(account), validators[0].amount, {
                    showCode: true,
                    disableRounding: true
                })
            });
            fields.push({
                type: "cosmos.validatorName",
                label: "Validator"
            });
            break;
        case "redelegate":
            fields.push({
                type: "text",
                label: "Type",
                value: "Redelegate"
            });
            fields.push({
                type: "text",
                label: "Amount",
                value: formatCurrencyUnit(getAccountUnit(account), validators[0].amount, {
                    showCode: true,
                    disableRounding: true
                })
            });
            fields.push({
                type: "cosmos.validatorName",
                label: "Validator Dest"
            });
            fields.push({
                type: "cosmos.sourceValidatorName",
                label: "Validator Source"
            });
            break;
        case "claimReward":
            fields.push({
                type: "text",
                label: "Type",
                value: "Withdraw Reward"
            });
            fields.push({
                type: "cosmos.validatorName",
                label: "Validator"
            });
            break;
        case "claimRewardCompound":
            fields.push({
                type: "text",
                label: "Type",
                value: "Withdraw Reward"
            });
            fields.push({
                type: "cosmos.validatorName",
                label: "Validator"
            });
            fields.push({
                type: "text",
                label: "Type",
                value: "Delegate"
            });
            fields.push({
                type: "cosmos.delegateValidators",
                label: "Validators"
            });
            break;
        default:
            break;
    }
    if (memo) {
        fields.push({
            type: "text",
            label: "Memo",
            value: memo
        });
    }
    if (estimatedFees && !estimatedFees.isZero()) {
        fields.push({
            type: "fees",
            label: "Fee"
        });
    }
    return fields;
}
export default getDeviceTransactionConfig;
//# sourceMappingURL=deviceTransactionConfig.js.map