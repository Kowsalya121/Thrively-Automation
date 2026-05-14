export const landerData = {
  overview: 'https://thrively-ssr.thrively.com/overview',
  whyThrively: 'https://thrively-ssr.thrively.com/why-thrively',
  strengths: 'https://thrively-ssr.thrively.com/strengths',
  wellbeing: 'https://thrively-ssr.thrively.com/wbi',
  hope: 'https://thrively-ssr.thrively.com/hope',
  agency: 'https://thrively-ssr.thrively.com/agency',
  pricing: 'https://thrively-ssr.thrively.com/pricing'
};

export const signupData = {
  validUser: {
    email: `kowsalya+${Date.now()}@liftoffllc.com`, // dynamic email
    password: 'pass@121',
    firstName: 'kowsalya',
    lastName: 'gowda',
    age: '15',
    role: 'Assistant Principal',
    interest: 'Career and College Readiness',
    schoolSearch: 'pom',
    schoolOption: 'Pomaikai Elementary School 4650 S Kamehameha Ave, Kahului, Hawaii,'
  }
};
  export const schoolofhopeuser = {
    validUser: {
      firstName: 'kowsalya',
      lastName: 'gowda',
      email: () => `kowsalya+${Date.now()}@liftoffllc.com`
    },
  
    demoUser: {
      fullName: 'kowsalya+jio@mail.com',
      email: 'kows@com',
      phone: '9632821905',
      school: 'tests'
    }
  };
  export const parentData = {
    signupUser: {
      email: (ts) => `kowsalya+parent${ts}@liftoffllc.com`,
      firstName: 'kowsalya',
      lastName: 'gowda',
      password: 'pass@121'
    },
  
    purchaseUser: {
      promoCode: 'strength',
      paymentEmail: (ts) => `kowsalya+parent${ts}@liftoffllc.com`,
      firstName: 'kowsalya',
      lastName: 'gowda',
      password: 'pass@121'
    },
  
    childData: {
      firstName: (ts) => `kowsu${ts}`,
      lastName: (ts) => `gowda${ts}`,
      username: (ts) => `kowsu_${ts}`,
      password: '123456',
      age1: '6'
    }
  };


  export const hopeaudituser = {
    signupUser: {
      firstName: 'kowsalya',
      lastName: 'gowda',
      email: () => `kowsalya+hope${Date.now()}@liftoffllc.com`,
      password: 'pass@121',
      school: 'testing'
    },
  
    inviteUser: {
      firstName: 'kowsalya',
      lastName: 'gowda',
      email: () => `kowsalya+invite${Date.now()}@liftoffllc.com`
    }
  };
  
  export const hopeAuditQuestions = [
    {
      question: 'There is a space and time built into the school day',
      answers: ['Sufficient This rating', 'Sufficient This rating', 'Sufficient This rating']
    },
    {
      question: 'There is evidence that the majority',
      answers: ['Sufficient This rating']
    },
    {
      question: 'well-being policy and plan',
      answers: ['Advanced This rating']
    },
    {
      question: 'roles of teachers',
      answers: ['Emergent This rating']
    },
    {
      question: 'prepared the school well',
      answers: ['Advanced This rating']
    },
    {
      question: 'The school is pretty successful.',
      answers: ['Sufficient This rating']
    },
    {
      question: 'foster community support',
      answers: ['Emergent This rating']
    },
    {
      question: 'development and revision',
      answers: ['Missing This rating']
    },
    {
      question: 'allocation of school materials',
      answers: ['Emergent This rating']
    },
    {
      question: 'personnel or advisory committee',
      answers: ['Emergent This rating']
    },
    {
      question: 'contingency plans',
      answers: ['Advanced This rating']
    },
    {
      question: 'opportunities during the day',
      answers: ['Emergent This rating']
    },
    {
      question: 'recognize staff and students',
      answers: ['Sufficient This rating']
    },
    {
      question: 'methods of communication',
      answers: ['Sufficient This rating']
    },
    {
      question: 'collect feedback',
      answers: ['Sufficient This rating']
    },
    {
      question: 'review academic, behavioral',
      answers: ['Advanced This rating']
    },
    {
      question: 'tools and systems',
      answers: ['Emergent This rating']
    },
    {
      question: 'collaboration, goal pursuit',
      answers: ['Sufficient This rating']
    },
    {
      question: 'team that reviews school data',
      answers: ['Emergent This rating']
    },
    {
      question: 'time built into the day',
      answers: ['Sufficient This rating']
    },
    {
      question: 'communicates about all the resources',
      answers: ['Sufficient This rating']
    },
    {
      question: 'announcements, newsletters',
      answers: ['Advanced This rating']
    },
    {
      question: 'visual environment reflects',
      answers: ['Emergent This rating']
    },
    {
      question: 'space in the building',
      answers: ['Emergent This rating']
    }
  ];

  export const studentUser = {
    dob: {
      day: '4',
      month: '8',
      year: '2008'
    },
  
    firstName: 'kowsalya',
    lastName: 'gowda',
  
    email: () => `kowsalya+student${Date.now()}@liftoffllc.com`,
  
    password: 'pass@121',
  
    inviteCode: 'MA7XWFMT'
  };

  export const webinarUser = {
    email: () => `kowsalya+webinar${Date.now()}@liftoffllc.com`,
    firstName: 'kowsal',
    lastName: 'gowda',
    password: 'pass@121',
    grade: '15',
    role: 'Specialist',
    interest: 'Social & Emotional Well-being',
    schoolSearch: 'pom'
  };
  export const Loginusers = {
    /*educator: {
      email: 'qa+kowsalya+test2@liftoffllc.com',
      password: 'pass@121',
      schoolName: 'GECK',
      role: 'educator'
    },*/
    /*parent: {
      email: 'tybuzyny@mailinator.com',
      password: 'pass@121',
      role: 'parent'
    },*/
    student: {
      email: '634238_ram',
      password: '123456',
      role: 'student'
    }
  };
  
  export const childData = {
    firstName:'kowsu',
    childName: () => `kid${Date.now()}`,
    lastName: 'gowda',
    age1: '6',
    checkoutAge: '17',
  
    username: () => `child${Date.now()}`,
    password: '123456',
  
    promoCode: 'strength'
  };

  export const parentQuestions = [
    {
      question: 'For what does your child seem to have a natural affinity?',
      answers: ['Rhythm/Music/Dance', 'Building Legos/Putting things']
    },
    {
      question: 'In New Social Situations',
      answers: ['My child is comfortable and']
    },
    {
      question: 'My child’s temperament is',
      answers: ['Pretty even and calm; easily']
    },
    {
      question: 'My child’s vocabulary is',
      answers: ['Very advanced'],
    },
    {
      question: 'My child seems',
      answers: ['Super coordinated']
    },
    {
      question: 'My child can have a back and forth conversation',
      answers: ['Sometimes']
    },
    {
      question: 'My child...',
      answers: ['Is adventurous but not too']
    },
    {
      question: 'My child...',
      answers: ['Almost always notices when']
    },
    {
      question: 'My child....',
      answers: ['Bounces back very quickly']
    },
    {
      question: 'My child...',
      answers: ['Needs some help to persevere']
    },
    {
      question: 'My child...',
      answers: ['Is easily able to entertain']
    },
    {
      question: 'My child...',
      answers: ['Is able to stay focused in']
    },
    {
      question: 'My child is able to deal with changes in plans without much fuss',
      answers: ['Most of the time']
    },
    {
      question: 'When things don\'t go my child\'s way',
      answers: ['Some of the time']
    },
    {
      question: 'I would describe my child as courageous',
      answers: ['Some of the time']
    },
    {
      question: 'My child tends to be a pretty creative problem solver',
      answers: ['Some of the time']
    }
  ];
  
  export const childQuestions = [
    { question: 'Which picture looks most fun to you?', type: 'image', index: 2 },
    { question: 'Which picture looks most fun to you?', type: 'image', index: 1 },
    { question: 'Which picture looks most fun to you?', type: 'image', index: 1 },
    { question: 'Which job looks most fun to you?', type: 'image', index: 1 },
    { question: 'Which kid would you rather be?', type: 'image', index: 1 },
    { question: 'If you could choose one super power', type: 'text', answer: 'To be the smartest person in' },
    { question: 'Which do you like better?', type: 'image', index: 1 },
    { question: 'What would be most fun for you to play?', type: 'image', index: 3 },
    { question: 'Which choice completes the pattern?', type: 'image', index: 1 },
    { question: 'What number completes the empty space', type: 'text', answer: '7' },
    { question: 'A scooter and a tricycle are both', type: 'text', answer: 'ways to move' },
    { question: 'How many seasons are in a year?', type: 'text', answer: '3' },
    { question: 'Who is the leader of our country?', type: 'text', answer: 'president' },
    { question: 'What is the missing letter in BL_E', type: 'text', answer: 'E' }
  ];
  export const DemoQuotedata = {
    getData(ts) {
      return {
        name: `kowsu${ts}`,
        email: `kowsu+${ts}@liftoffllc.com`,
        phone: '9632821905',
        school: 'Thrively',
        students: '20',
        description: 'testing'
      };
    }
  };
  export const checkinData = {
    login: {
      hopeUser: {
        email: 'cadeb@mailinator.com',
        password: '123456'
      },
      wellbeingUser: {
        email: 'cadeb@mailinator.com',
        password: '123456'
      }
    },

    hope: {
      questions: [
        'I can think of many ways to get out of a jam',
        'I energetically pursue my goals',
        'I feel tired most of the time',
        'There are lots of ways around any problem',
        'I am easily drowned in an argument',
        'I can think of many ways to get the things in life that are important to me',
        'I worry about my health',
        'Even when others get discouraged, I know I can find a way to solve the problem',
        'My past experiences have prepared me well for my future',
        'I’ve been pretty successful in life',
        'I usually find myself worrying about something',
        'I meet the goals that I set for myself'
      ],
  
      answers: [
        '4.5','5.1','5.4','5.2','4.9','5.3',
        '4.9','5','5.2','5','5.1','5.5'
      ],
  
      reflection: 'testing educator hope'
    },
  
    wellbeing: {
      reflection: "I'm doing good! i have a lot of work to do..will do and will take the responsibility"
    }
,
    wellbeingQuestions :[
      'I’ve been feeling good about my health',
      'I’ve been in a good mood (your emotional state)',
      'I’ve been getting along well with others (relationships at work)',
      'I’ve been engaged in my daily activities (life outside of work)',
      'I’ve been waking up feeling rested',
      'I’ve been hopeful about the future'
    ]
    ,
    wellbeingAnswers :[
      '9',
      '1.41',
      '8.23',
      '2.84',
      '3.51',
      '8.36'
    ]
  };

  export const districtData = {
    urls: {
      base: 'https://qa.thrively.com/ng/#/district-self-assessment',
      talkToUs: 'https://qa.thrively.com/ng/#/contact?t=quote',
      learnMore: 'https://qa.thrively.com/ng/#/classroom'
    },
  
    email: 'kowsalya+the@liftoffllc.com',
  
    questions: [
      {
        question: 'Does our district/school help every student develop positive learning identities?',
        action: { type: 'nth', value: 2 }
      },
      {
        question: 'Do we have the systems in place to measure how our students are developing agency and pathways?',
        action: { type: 'nth', value: 2 },
        hasBackCheck: true
      },
      {
        question: 'Do we have systems to monitor student well-being in real time?',
        action: { type: 'nth', value: 2 }
      },
      {
        question: 'Have we defined the Portrait of a Learner? If yes, have we operationalized it?',
        action: { type: 'nth', value: 3 }
      },
      {
        question: 'Have we defined what we mean by ‘equity’ in our system and have we operationalized it?',
        action: { type: 'text', value: 'Full Implementation + Sustainability' }
      },
      {
        question: 'Are we equipping our families with information about their child\'s strengths and assets and with resources to keep their children enriched at home?',
        action: { type: 'text', value: 'Limited Development' }
      }
    ]
  };