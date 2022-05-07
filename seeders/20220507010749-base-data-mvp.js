module.exports = {
  async up(queryInterface, __) {
    // define user accounts
    const userData = [
      {
        email: 'a@a.com',
        password: 'a',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: 'b@b.com',
        password: 'b',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    /* Insert user data into table */
    await queryInterface.bulkInsert(
      'users',
      userData,
      { returning: true },
    );

    // define category data
    const categoryData = [
      {
        name: 'console', // 1
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'family', // 2
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'father', // 3
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'inspire', // 4
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'joy', // 5
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'lifepartner', // 6
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'lyft', // 7 ( same as encourage)
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'motivate', // 8
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'reassure', // 9
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'recallGoodness', // 10
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'silly', // 11
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'wonder', // 12
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    // insert category data into its table
    await queryInterface.bulkInsert(
      'categories',
      categoryData,
      { returning: true },
    );

    const songData = [
      {
        title: 'BadDay-DanielPowter',
        category_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'FixYou-Coldplay',
        category_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Superman(ItsNotEasy)-FiveforFighting',
        category_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'JimmyGetsHigh-DanielPowter',
        category_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'HowToLove-LilWayne',
        category_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Blessings-LauraStory',
        category_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'IfWeHaveEachOther-AlecBenjamin',
        category_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'SeeYouAgain-CharliePuth',
        category_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'StandbyMe-BenEKing',
        category_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'NotAllHeroesWearCapes-OwlCity',
        category_id: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'KingsandQueens-ThirtySecondstoMars',
        category_id: 4,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Iridescent-LinkinPark',
        category_id: 4,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'ForgetYou-CeeLoGreen',
        category_id: 4,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'OpenHappiness-ButchWalker',
        category_id: 5,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'GoodTime-OwlCity&CarlyRaeJepsen',
        category_id: 5,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Happy-PharrellWilliams',
        category_id: 5,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Enchanted-OwlCity',
        category_id: 6,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'HeySoulSister-Train',
        category_id: 6,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'SomethingJustLikeThis-TheChainsmokers&Coldplay',
        category_id: 6,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'GrowOldWithYou-AdamSandler',
        category_id: 6,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'High-LighthouseFamily',
        category_id: 7,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'ItsNotOverYetForKingandCountry',
        category_id: 7,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Lifted-LighthouseFamily',
        category_id: 7,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'RedAndGold-JonForeman',
        category_id: 7,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'FightSong-RachelPlatten',
        category_id: 8,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Superheroes-TheScript',
        category_id: 8,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Burntheships-ForKingandCountry',
        category_id: 8,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'WavinFlag-Knaan',
        category_id: 8,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'ByYourSide-TenthAvenueNorth',
        category_id: 9,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'DontWorryBeHappy-BobbyMcFerrin',
        category_id: 9,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'illFindYou-LacraeFtToriKelly',
        category_id: 9,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'OceanDrive-LighthouseFamily',
        category_id: 9,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Priceless-ForKingandCountry',
        category_id: 9,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Memories-Maroon5',
        category_id: 10,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'LostInSpace-LighthouseFamily',
        category_id: 10,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: '100Years-FiveforFighting',
        category_id: 10,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'TheSaltwaterRoom-OwlCity',
        category_id: 10,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Graduation-VitaminC',
        category_id: 10,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'VanillaTwilight-OwlCity',
        category_id: 10,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Unbelievable-OwlCityftHanson',
        category_id: 10,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Sunscreen-BazLuhrmannfeatQuindonTarver',
        category_id: 10,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'AstronautInTheOcean-MaskedWolf',
        category_id: 11,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'RidinDirty-Chamillionare',
        category_id: 11,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'AlligatorSky-OwlCityftShawnChrystopher',
        category_id: 12,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Fireflies-OwlCity',
        category_id: 12,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Onthewing-OwlCity',
        category_id: 12,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'ToTheSky-OwlCity',
        category_id: 12,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'WhatAWonderfulWorld-LouisArmstrong',
        category_id: 12,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('songs', null, {});
    await queryInterface.bulkDelete('categories', null, {});
  },
};
