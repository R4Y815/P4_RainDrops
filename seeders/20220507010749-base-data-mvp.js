/* eslint-disable max-len */
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

    // Define Song Data
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
        title: 'GangstasParadise-Coolio',
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
        title: 'AstronautInTheOcean-MaskedWolf',
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

    // insert song data into its table
    await queryInterface.bulkInsert(
      'songs',
      songData,
      { return: true },
    );

    // define photoData
    const photoData = [
      {
        photo_name: 'aad94ae61814bb9ba472d15fdab8a573',
        comment: 'Turns out Stripe-san found out Redhead was pilferin on the monthly cash inflows from his security business',
        mood: 'humor',
        category_id: 11,
        time_print: 'Monday,  2-May-2022, 9:00 am',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        photo_name: '1e3ddcfb4472fa944ab022187c02ea4b',
        comment: 'Looks like the twin chicks worked their stuff again ',
        mood: 'humor',
        category_id: 11,
        time_print: 'Monday,  2-May-2022, 1:27 pm',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        photo_name: '86f3c167407dcd8a1e75b193e798c63a',
        comment: 'Mr Samuel M Pugson was waiting for our answer on the shipment...',
        mood: 'humor',
        category_id: 11,
        time_print: 'Monday,  2-May-2022, 11:02 pm',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        photo_name: '4a79d8899547f0e3490f36bfd60a89e0',
        comment: 'Forgot to get Fluffbrow his nip again, crap, his claws are out this time...',
        mood: 'humor',
        category_id: 11,
        time_print: 'Tuesday,  3-May-2022, 12:29 am',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        photo_name: 'c7c9f070b0df8eb7fffcae25e3c92b2a',
        comment: "Barzini's boys were in town and checking out the place.",
        mood: 'humor',
        category_id: 11,
        time_print: 'Tuesday,  3-May-2022, 11:15 am',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        photo_name: '42faea3aedcb5b714c97112c6e9489f8',
        comment: 'Boss Baby mention times were hard as manufacturers raised the price powder by 25 percent..',
        mood: 'humor',
        category_id: 11,
        time_print: 'Tuesday,  3-May-2022, 1:45 pm',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        photo_name: '915ad41e2d19afdc7bed1a2baa4085a0',
        comment: 'man, the new gang members of Clemenza look tough...',
        mood: 'humor',
        category_id: 11,
        time_print: 'Wednesay,  4-May-2022, 2:29 pm',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        photo_name: '7635cf05924456c3e82f594ea9446a85',
        comment: "The Devil Hound Trio summoned me for questioning...perhaps there's a snitch amongst us...",
        mood: 'humor',
        category_id: 11,
        time_print: 'Wednesday,  4-May-2022, 7:05 pm',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        photo_name: 'fcccb330ae361faec3786417daa8ee11',
        comment: 'Looks like Devil Hound has activated their new assassin this week.',
        mood: 'humor',
        category_id: 11,
        time_print: 'Thursday,  5-May-2022, 9:00 am',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        photo_name: 'a9afaf0b68b33e10bd4335a758d4663f',
        comment: "The alphas from Clemenza's team sent us this report from London saying they have cleared out that perpetrators.",
        mood: 'humor',
        category_id: 11,
        time_print: 'Thursday,  5-May-2022, 10:17 pm',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        photo_name: '53107567ad16dfd25f7dae9944c65fc9',
        comment: "so they tell me, this kid is Miyagi-san's new successor",
        mood: 'humor',
        category_id: 11,
        time_print: 'Thursday,  5-May-2022, 11:02 pm',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        photo_name: '88e4e3d069199cf8932d326a61f07f05',
        comment: 'Simba-sempai allowed me to take this reference for what I need to pack for the next deployment',
        mood: 'humor',
        category_id: 11,
        time_print: 'Friday,  6-May-2022, 7:15 am',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        photo_name: 'db5ab05fef3e9f775fa2b67bf32ca268',
        comment: 'caught him outside our room trying to eavesdrop on me and Simba sempai... he could be that snitch...',
        mood: 'humor',
        category_id: 11,
        time_print: 'Friday,  6-May-2022, 7:35 am',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        photo_name: 'fad0731c24c0d6a65c0f2b7fb7b0a018',
        comment: "Stripe-san's entourage has arrived in full force... looks like Stripe-san has made his decision",
        mood: 'humor',
        category_id: 11,
        time_print: 'Friday,  6-May-2022, 3:00 pm',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        photo_name: '3a1964d8756919b01141e8af54d7da5e',
        comment: 'Mandrill-san looked deep in thought after I told him who I thought the snitch was',
        mood: 'humor',
        category_id: 11,
        time_print: 'Friday,  6-May-2022, 8:00 pm',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        photo_name: '7b0e2c6ccbb37afabf8d5b3cac9667b3',
        comment: "Again? Why can't Redhead be grateful for the second chance from Stripe-san?",
        mood: 'humor',
        category_id: 11,
        time_print: 'Saturday,  7-May-2022, 10:23 am',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        photo_name: '79c1fbeafb3509574f747c5b38be96ef',
        comment: "His finishing move looked cool and all, but I'm not sure if he can play along well with the other guys...",
        mood: 'humor',
        category_id: 11,
        time_print: 'Saturday,  7-May-2022, 7:19 pm',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        photo_name: 'e537af52ff0073ed51a14ce585b3aadd',
        comment: "We're gonna have to contact Bossman, didn't know Klan had such powerful assassin that could settle things in one punch..",
        mood: 'humor',
        category_id: 11,
        time_print: 'Sunday,  8-May-2022, 7:15 am',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        photo_name: '69b83cf44144e6676492f8323f0e5847',
        comment: 'Boss sent us these guys, said these assassins were excellent practioners of the Mantis Fist.',
        mood: 'humor',
        category_id: 11,
        time_print: 'Sunday,  8-May-2022, 2:17 pm',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        photo_name: 'ad20568c7888985a25091b5fca616dd5',
        comment: "Spotted Corleone's gang struttin around the rear beach, perhaps they have already started their hit on the Klan's safehouse",
        mood: 'humor',
        category_id: 11,
        time_print: 'Sunday,  8-May-2022, 5:15 pm',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    // Insert Photo Data into its table
    await queryInterface.bulkInsert(
      'photos',
      photoData,
      { return: true },
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('songs', null, {});
    await queryInterface.bulkDelete('photos', null, {});
    await queryInterface.bulkDelete('categories', null, {});
  },
};
