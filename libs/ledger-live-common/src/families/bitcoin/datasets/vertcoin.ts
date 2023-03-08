import type { CurrenciesData } from "@ledgerhq/types-live";
import type { Transaction } from "../types";
const dataset: CurrenciesData<Transaction> = {
  FIXME_ignoreAccountFields: [
    "bitcoinResources.walletAccount", // it is not "stable"
    "bitcoinResources.utxos", // TODO: fix ordering
  ],
  scanAccounts: [
    {
      name: "vertcoin seed 1",
      apdus: `
      => e04000000d038000002c8000001c80000000
      <= 4104b1699ad7191d659e8060b4cc339ceee0c9e1c23bc357ff695537fa5c93917e9868229c92f4708e820293817fa189287674675cfa824c3ffea18c60051d75247522566a366f7a73695752466e33776161543355374e456d6f70596e464c366f7174345ad167cce17feddfeda5e9350193102249a12263a8a2968c0d1f03da605a33879d9000
      => e040000015058000002c80000080800000000000000000000000
      <= 410440fbf7fbc2108f1ca4b351fe5b65e59df1a1ffcbf629c1fb1c46010cc36ca88ed6f8eb1b30fce3edfee86d23119e4ec77b5ba8dbfd136cb141cd34293ab4759822566f6d325763777974394e726853717872646a346d73655779725856467451475152d07d96d40d04d576a91666f31f7486ef3b2c67c3ca1433e9062ce7a38543e2d79000
      => e040000009028000002c80000080
      <= 4104f05caa702e2a987473753d76b3fef2ce0820a27488b3862cf7d3a3268190af93a4ef7ad0b48b77eb1b37cd79142158809dc7a80f35d5b58dc39e7b0320785fbe2256715562644c73614c5679543852345751626f47664e345867483337676a536a73333ae715ab88efde26070318695ed940177d812309e67e80cd6ac1e194041de5109000
      => e04000000d038000002c8000008080000000
      <= 4104ae5311551bcd53ac6f864e10a808d2692314fa647448825ef2804dc1e566c4f744898247fe033b2cda5b170cf7704c6657c3e5e1607e196642fc6e2cd504be10225678414b456d537a67775565317633674c564142644b5146364762454b446f374559f5ee141236618321c5893701148e9caf5c84dfc471e883f66616cad08cbca6b69000
      => e040000015058000002c80000080800000010000000000000000
      <= 410497fa07f090facdfbecc20ac2331e5bf20e41f889ebbf529f23dea1f88296b435df9bd9d93eca6ed5b32f99fc73d58631bfa67b4a7707104c343c85c8dc2987a922566a72525348463944613746706d7737516a425a3872514e6448537944644b346b32d1458c0d0d8b83d3f9926c459a530eec0ed9a8f5f5fd653b890f664072a956539000
      => e040000009028000002c80000080
      <= 4104f05caa702e2a987473753d76b3fef2ce0820a27488b3862cf7d3a3268190af93a4ef7ad0b48b77eb1b37cd79142158809dc7a80f35d5b58dc39e7b0320785fbe2256715562644c73614c5679543852345751626f47664e345867483337676a536a73333ae715ab88efde26070318695ed940177d812309e67e80cd6ac1e194041de5109000
      => e04000000d038000002c8000008080000001
      <= 410434a44c1585c1c7433dc08613a61545aa7ba40e8e6dd2999018558a5e4577eaf752c46768c782bf770e4b4585fa65377415a867b9864eba2effbbe8791eb073612256617a6d3141434265576b514338346b7953334d46674e6d6d586b417a3264686a4d5752f93ffcc298868eae48c3e76f3ba2eef3a851ffbe5f5bdca8f741733ee8e29000
      => e04000010d03800000318000001c80000000
      <= 4104f566e25fda70768b0f83ecaad57bb2b020ff0c5c46e4f1dfa614c3fe1c43b5a793db5810ec6ed725a23ffcd85be5b5cbcbbf0f3acba9e0cdc7b994475c9e6cb822333663775633737956316d455a6941503964674b713251357251743831775a706e4b98370cd03081f446170704d277baab59f1266d64d5d0f7fe97e179a26302a5529000
      => e040000115058000003180000080800000000000000000000000
      <= 41043c3ec64027697a041cd4224ec8e853c5422f02c75001018e9ecbd848b6b02eda5180e948c157a6d1c0a8dd3c510c01147e284bd805ce149e11acc324900346222233384539774c4c554a456b686971346e65754d34376f5a6f4a4635364155774e7a69407a8f6fb193c8d8e121a8ef7867c519ede185af7bb627c35a36ce1c22bbd9d79000
      => e040000009028000003180000080
      <= 410404221ea3aeb4116ac01e210113be7322b001b157f02721d1fa01f7ddfd2215c8cf4487d322859964de993f3ae62d59ca0f1d6d49b27e622ef7a94d6c917e87442256696967327951616f354b31326955596f7053636b717a724b5446734b4c5a4b567a05397aa866704a02c17fe27257790ac52804fce4dd76f0ca9727e458bb1c8d099000
      => e04000000d03800000318000008080000000
      <= 410405177327e8231774ce4170cdd86bc61b0e0d0fe7cb43a565fb8114fdb4ec92cdb850957ed96bb866503828342d9d94bb211414e951a6c8e9fa84d7100386e08c225675666675574a73343156366b7233695558457471313833704e31696d69743168677399534ac343229b687e91db84e23586928d82abf32be80127683bf8cfe7e63a9000
      => e040000115058000003180000080800000010000000000000000
      <= 410420ecaf1418ce83efdf295d47617dd081aa8c340ab65783d921bf9d3dcb799afc6a5a398ff2092a2a643dfeab1d2e9382b4c66b6a416d01fc07ca9d5427ad61fb2233324e3973753944676134564458357568456142596b3658554354317862746d444e4ac1b26199a739ee0481393e5e9487ec6a1ce957b9772807a17407dfce021b699000
      => e040000009028000003180000080
      <= 410404221ea3aeb4116ac01e210113be7322b001b157f02721d1fa01f7ddfd2215c8cf4487d322859964de993f3ae62d59ca0f1d6d49b27e622ef7a94d6c917e87442256696967327951616f354b31326955596f7053636b717a724b5446734b4c5a4b567a05397aa866704a02c17fe27257790ac52804fce4dd76f0ca9727e458bb1c8d099000
      => e04000000d03800000318000008080000001
      <= 4104eef47a0cd72801cf765c8a736ed57e7338ff4b7788aa9f8f3bd9de7151a1409b70001b5ebe9d68510bd2b7e7222e450c37d0d2c0e8a413a3a8319ecc597c9f5522566337596d725662564145726d32706d556438617348417a59545a45773641553376cd0b9f607c1c5afc548052d7feae6107e96a7c8033b3b070525674c8f29f6d9a9000
      => e040000115058000003180000080800000020000000000000000
      <= 410493fd7f7bbcdfd100156fd62db2222db4806622c71a65564ebc5d43dce426be4acd758816d42d812ab11c966dfccdfcf59b38c103ad13cd824334f7bcc391bd1322334566464c377a70626941535946666e766772396b347747374c733441384a57724494b8b49ec0c85036e6962bb578bf367998af1cb50ce656c3bad69149652c34679000
      => e040000009028000003180000080
      <= 410404221ea3aeb4116ac01e210113be7322b001b157f02721d1fa01f7ddfd2215c8cf4487d322859964de993f3ae62d59ca0f1d6d49b27e622ef7a94d6c917e87442256696967327951616f354b31326955596f7053636b717a724b5446734b4c5a4b567a05397aa866704a02c17fe27257790ac52804fce4dd76f0ca9727e458bb1c8d099000
      => e04000000d03800000318000008080000002
      <= 4104d2269ec71016d59a9a6c52b04bde90ad968f35dbb5c1ea553dfec2b66709792326b9dc2d76a2b9c06d7efc2b2dae1acc8e53e0566b8ababa1df232486ae32303225663674d436d32413144514842514b73446655555843396f32475331726b616e3135901ed703e8cee91665d03b175dedace6520864ff29c6b67b701708606bc8a2909000
      => e04000011505800000318000001c800000000000000000000000
      <= 41045773fd3e2a275197909c6f51257b831d2ebc4b63ed98295997b0e261e8efd7b9b3c7f9a6997f908edfa9bf0a11f220fedeca5e0bad93d15fe4ff0c6525bcec472233423236594d685776715a485463634d6f3668586e69544d723253625256326844616f659f6cf545b767f5502adcfa67a7ea67508098f0bd3d56d483a4ce4407a6089000
      => e04000000902800000318000001c
      <= 4104a5b08be4387e48c9c48969630867e43c305b653b1f678e12b83461048f65daf669091b51e86b31d11d96c3a41e6be234ae2dce6f371829bd012ea8073ce03e8c22566867466b74714478396f4b746e794a725a4e7932665978745147584d59626a5263757a1db7fa270419a57cf6a91efa480f5d1124a79e75d9e4cccc17925b673bd49000
      => e04000000d03800000318000001c80000000
      <= 4104f566e25fda70768b0f83ecaad57bb2b020ff0c5c46e4f1dfa614c3fe1c43b5a793db5810ec6ed725a23ffcd85be5b5cbcbbf0f3acba9e0cdc7b994475c9e6cb822566d706f72336d61647a5263363859346a596b6b4754353664573944516432766e5198370cd03081f446170704d277baab59f1266d64d5d0f7fe97e179a26302a5529000
      => e040000015058000002c8000001c800000000000000000000000
      <= 41041d20492f0fdfdefab06421c2534d5efce66d70bf5657296b90f9af13319deb844cb6c8cc476b1ae5d03ae4b2fe8b1d62a77c8f7bb17af4ac321c3aa998cf44b7225668636835704c464b55757a74556e7157655a437363674b5753656d62315879566f12ea85c56da14d0e1f5465e512fedb355c0a525a65401500ea273d0c40830e3a9000
      => e040000009028000002c8000001c
      <= 4104cd118cd2b4d2415bfa8b3e3830ff9396b0f8248296a45be8435f7792828232d33aabf92808063c7d4a19ea8c3d30987fbee057ea50c70cbb23497fb68779b5d92256726569637456367450764d43787174416b4b785454374b44397247627178567366dee844ad2e6a6854fedd582d58bf6cf4c03e7cde287b02cc42661fa6a7f487f09000
      => e04000000d038000002c8000001c80000000
      <= 4104b1699ad7191d659e8060b4cc339ceee0c9e1c23bc357ff695537fa5c93917e9868229c92f4708e820293817fa189287674675cfa824c3ffea18c60051d75247522566a366f7a73695752466e33776161543355374e456d6f70596e464c366f7174345ad167cce17feddfeda5e9350193102249a12263a8a2968c0d1f03da605a33879d9000
      `,
    },
  ],
};
export default dataset;
