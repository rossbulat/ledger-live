import type { CurrenciesData } from "@ledgerhq/types-live";
import type { Transaction } from "../types";
const dataset: CurrenciesData<Transaction> = {
  FIXME_ignoreAccountFields: [
    "bitcoinResources.walletAccount", // it is not "stable"
    "bitcoinResources.utxos", // TODO: fix ordering
  ],
  scanAccounts: [
    {
      name: "peercoin seed 1",
      apdus: `
      => e04000000d038000002c8000000680000000
      <= 4104c34d54872813c5bed16b9bca96677051eb5100a6af37cc62003722df824ecf8b69b861bdd463513e749c5864f4c359e240f0f838360cbf5dd72b1c0c28006e1622504a41736a686e484c3433377739434d4b68594352554a484b386552325977774d54866afbaa4ad1dc7cffc4d2dad8fcbc35747cad7422a58bd0e845db2d66c9cda29000
      => e040000015058000002c80000006800000000000000000000000
      <= 41046f0a28d6cb521ee61eee8ba8ac89ee9f94e5db84a7acc6142da31a25424c1fc6de0e7985b3abc2977286befc8c08c9a9a26aa65839b9c9681dcf71bb44dff20522504b3379785955504a554a3547774d4179503742414365557768617a4e52536d5558701f1d4d270e21d5c6ae2244ec70df0bcff0e112192e5d824b5b42745927b9f89000
      => e040000009028000002c80000006
      <= 4104384e2e15aefc645eec7497df572a66f37843d41c022f78683a1d7449af8a5ce6c10d7b9e701fa670df1fc82a3c6cc95e5170052227442891b821a5d377da0dec2250507275616d6469594d6b744a617865313757753663696a475162656a5a6842567085e8ce8fffe7effdc7fe2465303ce36c1491e00b3d1bf163de1bf44e30cb79439000
      => e04000000d038000002c8000000680000000
      <= 4104c34d54872813c5bed16b9bca96677051eb5100a6af37cc62003722df824ecf8b69b861bdd463513e749c5864f4c359e240f0f838360cbf5dd72b1c0c28006e1622504a41736a686e484c3433377739434d4b68594352554a484b386552325977774d54866afbaa4ad1dc7cffc4d2dad8fcbc35747cad7422a58bd0e845db2d66c9cda29000
      => e040000015058000002c80000006800000010000000000000000
      <= 4104e183c50ef938977fbdcc77b66d2f8146369a1a12feadfdba35999db1441cd169f271f6a06a0337599911a259f25f7a74cc054a506f7f2781ee5c0fd04dfb063e225045417a4c644c57664e65567179453272334767744355574c565352447252783242a671db3c3a939249bb87d0c65f83d58bf9037ccf999afb7573e96b085faeeafe9000
      => e040000009028000002c80000006
      <= 4104384e2e15aefc645eec7497df572a66f37843d41c022f78683a1d7449af8a5ce6c10d7b9e701fa670df1fc82a3c6cc95e5170052227442891b821a5d377da0dec2250507275616d6469594d6b744a617865313757753663696a475162656a5a6842567085e8ce8fffe7effdc7fe2465303ce36c1491e00b3d1bf163de1bf44e30cb79439000
      => e04000000d038000002c8000000680000001
      <= 410436732d1ba7ad260bdb6dc8a1da18d895ef6de8a17249226ab9f8eb85fa6c3a9ae4e72b4ceaefe55b43f5a7183e39ef67f5e0e90eb4a7987d27752a13f6be437e2250574a6b72633179654839684a524c726767685561384354323562487a4537434c58b97cc59dcc7854903cc8e7f96f8a69bd32a4006d53e906c74d046c57e69c25859000
      => e040000015058000002c80000006800000020000000000000000
      <= 4104966ca92eecda8a6a0e4e41d8e03e75b2dbec7dc1f77f3cc90b2a3b5057ec879b43abc65aecb430fe7d436706ccbbbc99cfa190fa784821119246ba471c8211b222504d785a6458427a696d73624d594736464a4b6361385042343147436a45626b3654124125d93e2f6560e10ce3a76caadca9012f19aecc4354219b0525d07cc4447c9000
      => e040000009028000002c80000006
      <= 4104384e2e15aefc645eec7497df572a66f37843d41c022f78683a1d7449af8a5ce6c10d7b9e701fa670df1fc82a3c6cc95e5170052227442891b821a5d377da0dec2250507275616d6469594d6b744a617865313757753663696a475162656a5a6842567085e8ce8fffe7effdc7fe2465303ce36c1491e00b3d1bf163de1bf44e30cb79439000
      => e04000000d038000002c8000000680000002
      <= 41049fa6e58ddc08d711132301826d2c916d507dea79f8deef4a309e10f99712fba9d1f1e84ef391635e4f1f0aba88549f748646be84a8df4c4b4d05cd7ed1b9af2e2250394e65456f586236453771626875573977714c33706f416963446f754270756d717bf86a696baa740762f780ee62ab09be9ab337f55033a0f64916156bace7d8e89000
      `,
    },
  ],
};
export default dataset;
