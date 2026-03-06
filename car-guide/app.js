'use strict';

// ---------------------------------------------------------------------------
// MODULE DEFINITIONS
// Each module: { id, icon, title, tagline, questions[], getVerdict(answers) }
// getVerdict returns: { tag, tagColor, recommendation, math?, insight, caveats[] }
// ---------------------------------------------------------------------------

const MODULES = [

  // -------------------------------------------------------------------------
  // 1. PETROL VS DIESEL
  // -------------------------------------------------------------------------
  {
    id: 'fuel',
    icon: '⛽',
    title: 'Petrol or diesel?',
    tagline: 'The most argued question. The answer has changed.',
    questions: [
      {
        id: 'km',
        text: 'How many km do you drive per year?',
        options: [
          { value: 'u10',  label: 'Under 10,000' },
          { value: '1015', label: '10,000 - 15,000' },
          { value: '1520', label: '15,000 - 20,000' },
          { value: '2025', label: '20,000 - 25,000' },
          { value: 'o25',  label: 'Over 25,000' },
        ],
      },
      {
        id: 'pattern',
        text: 'What does most of your driving look like?',
        options: [
          { value: 'city',    label: 'Mostly stop-go city traffic' },
          { value: 'mixed',   label: 'Mix of city and highway' },
          { value: 'highway', label: 'Mostly highway' },
        ],
      },
      {
        id: 'region',
        text: 'Where do you primarily drive?',
        options: [
          { value: 'delhi', label: 'Delhi NCR' },
          { value: 'metro', label: 'Mumbai / Bengaluru / Hyderabad / Chennai' },
          { value: 'other', label: 'Other city or town' },
        ],
      },
    ],
    getVerdict(a) {
      const KM_MAP = { u10: 8000, '1015': 12500, '1520': 17500, '2025': 22500, o25: 28000 };
      const kmYear = KM_MAP[a.km];
      const p      = a.pattern;

      const MPG = {
        petrol: { city: 11, mixed: 14,   highway: 17   },
        diesel: { city: 14, mixed: 17.5, highway: 21   },
      };
      const PP = 105; // petrol ₹/L
      const DP = 93;  // diesel ₹/L
      const DIESEL_PREMIUM = 130000; // ₹1.3L upfront

      const costP  = (PP / MPG.petrol[p]) * kmYear;
      const costD  = (DP / MPG.diesel[p]) * kmYear;
      const saving = Math.round(costP - costD);
      const beven  = +(DIESEL_PREMIUM / saving).toFixed(1);

      let tag, tagColor, recommendation, insight;

      if (beven > 5.5) {
        tag            = 'CLEAR CALL';
        tagColor       = 'green';
        recommendation = 'Go petrol.';
        insight        = `At ${Math.round(kmYear / 1000)}K km/year, diesel saves roughly ₹${Math.round(saving / 1000)}K annually on fuel. That sounds decent until you realise it takes ${beven} years to recover the ₹1.3L diesel premium - longer than most people keep a car. On top of that, diesel service costs run 15-20% higher, BS6 diesels need regular highway runs to keep the DPF clean (pure city diesels develop carbon buildup), and diesel resale has quietly gotten harder as its market share dropped below 18% of new car sales. The price gap between petrol and diesel has narrowed from ₹25+/L to ₹10-13/L in most cities - that's what changed this calculation. Petrol is simpler, cheaper to maintain, and easier to sell. No reason to fight it.`;
      } else if (beven > 4.0) {
        tag            = 'OUR LEAN';
        tagColor       = 'amber';
        recommendation = 'Lean petrol - but it\'s not a slam dunk.';
        insight        = `The math is borderline at ${beven} years to break even. Whether diesel makes sense depends on what those ${Math.round(kmYear / 1000)}K km actually look like. If they're sustained highway runs at 80+ kmph, diesel's efficiency advantage is real and you'll see close to the estimated mileage. If it's mostly stop-go city, real-world mileage will be worse and the breakeven stretches further. Given diesel's softening resale, higher service costs, and BS6 DPF maintenance, petrol is still the lower-friction choice at this range unless your driving is genuinely highway-heavy.`;
      } else if (beven > 2.5) {
        tag            = 'OUR LEAN';
        tagColor       = 'amber';
        recommendation = 'Diesel makes sense.';
        insight        = `Breakeven at ${beven} years is a reasonable case for diesel, and the savings compound meaningfully after that. At ${Math.round(kmYear / 1000)}K km/year with your driving pattern, the numbers work. Two things to confirm before committing: does the model you want actually offer a diesel variant at your budget (diesel is being dropped from entry trims across the board)? And are these km genuinely ${p === 'highway' ? 'highway-dominant' : 'as you described'} - diesel's advantage in pure city crawl is smaller than the estimates above suggest.`;
      } else {
        tag            = 'CLEAR CALL';
        tagColor       = 'green';
        recommendation = 'Go diesel. Clear.';
        insight        = `At ${Math.round(kmYear / 1000)}K km/year, you break even in under ${beven} years and the savings are real and sustained. For this kind of usage, diesel also gives you meaningfully better highway torque - overtaking is effortless in a way petrol can't match in most budget cars. Just verify one thing: diesel is increasingly unavailable in smaller cars and lower trims. Check your shortlisted models before assuming diesel is an option.`;
      }

      const caveats = [
        `Fuel prices shift. This assumes petrol at ₹${PP}/L and diesel at ₹${DP}/L. If the gap narrows further, the case for diesel weakens.`,
        'BS6 diesels with DPF need regular highway runs to regenerate. Pure city diesel use can cause carbon buildup over high mileage.',
      ];
      if (a.region === 'delhi') {
        caveats.push('Delhi NCR has had periodic diesel vehicle restrictions under NGT orders. Verify current rules before buying - they have changed before and could again.');
      }

      return {
        tag, tagColor, recommendation,
        math: {
          headline: `₹${Math.round(saving / 1000)}K saved per year. Breakeven in ${beven} years.`,
          detail:   `${Math.round(kmYear / 1000)}K km/year, petrol at ${MPG.petrol[p]} kmpl vs diesel at ${MPG.diesel[p]} kmpl for ${p} driving. ₹1.3L diesel variant premium assumed.`,
        },
        insight,
        caveats,
      };
    },
  },

  // -------------------------------------------------------------------------
  // 2. WHICH COMPACT SUV
  // -------------------------------------------------------------------------
  {
    id: 'compact-suv',
    icon: '🚙',
    title: 'Nexon, Brezza, Venue, or Sonet?',
    tagline: 'Sub-₹12L SUVs. Four strong options. One right answer for your situation.',
    questions: [
      {
        id: 'priority',
        text: 'What matters most to you when buying a car?',
        options: [
          { value: 'safety',      label: 'Safety in a crash, above everything' },
          { value: 'reliability', label: 'Trouble-free ownership and strong resale' },
          { value: 'features',    label: 'Best features and cabin experience' },
          { value: 'performance', label: 'Driving feel and engine performance' },
        ],
      },
      {
        id: 'city',
        text: 'Where do you primarily drive?',
        options: [
          { value: 'metro',  label: 'Major metro (Mumbai / Delhi / Bengaluru / Hyderabad / Chennai / Pune)' },
          { value: 'tier2',  label: 'Large Tier-2 city (Jaipur / Lucknow / Nagpur etc.)' },
          { value: 'tier3',  label: 'Smaller town or frequently on highways' },
        ],
      },
      {
        id: 'term',
        text: 'How long do you plan to keep the car?',
        options: [
          { value: 'short',  label: '3 - 4 years, then sell' },
          { value: 'medium', label: '5 - 8 years' },
          { value: 'long',   label: '8+ years, keeping it long term' },
        ],
      },
    ],
    getVerdict(a) {
      const { priority, city, term } = a;
      let tag, tagColor, recommendation, insight, caveats;

      if (priority === 'safety') {
        tag            = 'CLEAR CALL';
        tagColor       = 'green';
        recommendation = 'Tata Nexon.';
        if (city === 'tier3') {
          insight = `Nexon is the only 5-star NCAP car in this segment and it isn't close. The crash test numbers matter - this is the variable that doesn't show up in a test drive but becomes the most important one if something actually goes wrong. The concern in smaller cities is real though: Tata's service network is thinner than Maruti's, and forum reports consistently show more variance in service quality outside metros. If your nearest Tata ASC is within comfortable distance, buy Nexon without hesitation. If not, Brezza's safety has improved on the 2022+ facelift (though not to Nexon's level) and the service peace of mind is worth factoring in.`;
          caveats = ['Verify your nearest Tata authorized service center before buying. Distance and quality vary significantly outside metros.', 'Run a PDI checklist before accepting delivery. Check door seals, cabin rattles with AC on, and all electronics. Catching issues at delivery is far easier than after.'];
        } else {
          insight = `Nexon is the answer and it isn't a close call. India's only sub-10L car with Bharat NCAP 5 stars - it performs differently in a crash compared to everything else in this segment. The often-cited concerns (cabin rattles, fit-finish variance) are real but have been improving steadily, and they're liveable. The things you can't fix after the fact - crash safety - Nexon leads clearly. In a metro with multiple Tata service centers, the ownership experience is far more manageable than it was 4-5 years ago.`;
          caveats = ['Do a PDI. Cabin rattle issues are partly catch-at-delivery problems. Check door seals, rattles with AC running, and infotainment before signing off.', 'The XZ+ trim is the sweet spot - it has the safety-critical features without paying for tech you may not use regularly.'];
        }
      } else if (priority === 'reliability') {
        tag            = 'CLEAR CALL';
        tagColor       = 'green';
        recommendation = 'Maruti Brezza.';
        insight        = `If you want to own a car for 7-8 years without dreading service calls, Brezza is the answer. Maruti's service network is genuinely unmatched - there are authorized centers in towns most manufacturers have never heard of. Parts are cheap, mechanics everywhere understand the car, and resale is strong because the used car market trusts the brand. What you give up: Brezza doesn't have Nexon's crash test pedigree. If outright safety is important, that trade-off is worth acknowledging. But if your driving is mostly lower-speed urban and long-term reliability keeps you up at night, Brezza is the most sensible choice in this segment.`;
        caveats = ['Brezza's safety has improved on 2022+ models. If buying used, verify it's the facelifted version.', 'Dealer-fitted accessories at Maruti outlets are pushed aggressively. Decline everything not standard - floor mats, body kits, and seat covers are classic margin plays. Aftermarket is better and cheaper.'];
      } else if (priority === 'features') {
        if (city === 'metro') {
          tag            = 'OUR LEAN';
          tagColor       = 'amber';
          recommendation = 'Hyundai Venue or Kia Sonet.';
          insight        = `Venue and Sonet lead this segment on features. Sunroof, connected car tech, ADAS, ventilated seats - available at price points where Nexon and Brezza charge significantly more or don't offer them. Hyundai and Kia service is solid in metros. Kia has fewer outlets but consistently higher owner satisfaction. The safety caveat: neither matches Nexon on crash tests, so don't go bare - pick mid or high trims with at least 6 airbags. Venue if you prefer a softer, family-oriented feel; Sonet if you want the 1.0 turbo petrol option and sportier styling.`;
          caveats = ["ADAS on Indian roads has real limitations - lane keep assist and forward collision warnings struggle with unmarked roads and chaotic traffic. Most owners disable it within months. Don't let it be your deciding factor.", 'Resale for Hyundai/Kia is decent but consistently below Maruti. Plan for a smaller buyer pool when you sell.'];
        } else {
          tag            = 'OUR LEAN';
          tagColor       = 'amber';
          recommendation = 'Maruti Brezza (or Tata Nexon).';
          insight        = `In Tier-2 and smaller cities, Venue and Sonet's service network thins out and the features advantage becomes harder to justify when a repair turns into a hassle. Brezza's features have caught up significantly in the 2022+ facelift and service makes ownership genuinely low-stress. If safety ranks alongside features for you, Nexon remains the call - features plus safety is a stronger combination than features alone.`;
          caveats = ['Check Hyundai and Kia service center locations in your specific city before dismissing them - network coverage has expanded and varies more than you might expect.'];
        }
      } else {
        tag            = 'OUR LEAN';
        tagColor       = 'amber';
        recommendation = 'Kia Sonet (turbo) or Tata Nexon.';
        insight        = `For driving feel, Kia Sonet's 1.0 T-GDI turbo petrol (120 PS, 172 Nm) with a 7-speed DCT is the most engaging package in this segment - it genuinely pulls and the shifts are satisfying. Tata Nexon's 1.2 turbo petrol (120 PS) is close but the iAMT is less polished than the DCT. If you're an enthusiast who also cares about being in one piece after a crash, Nexon in manual is worth considering - you get safety and full control. Venue's turbo is smooth but not exciting. Brezza's mild hybrid is the least engaging of the four.`;
        caveats = ["Sonet's DCT is the same family as VW/Skoda units. It's been reliable in Sonet applications but carry this awareness into your 5-year ownership cost thinking.", 'Drive all four before deciding. Perceived performance is subjective and what feels fast on paper often feels different on Indian roads.'];
      }

      if (term === 'short' && (priority === 'safety' || priority === 'reliability')) {
        caveats.push('Selling in 3-4 years? Brezza tends to hold value the best in this segment for short-term owners. Nexon resale has improved but Maruti still leads.');
      }

      return { tag, tagColor, recommendation, math: null, insight, caveats };
    },
  },

  // -------------------------------------------------------------------------
  // 3. TRANSMISSION
  // -------------------------------------------------------------------------
  {
    id: 'transmission',
    icon: '⚙️',
    title: 'Manual, AMT, CVT, or DCT?',
    tagline: 'Four very different gearboxes. One will suit you. Three might not.',
    questions: [
      {
        id: 'pattern',
        text: 'What does most of your daily driving look like?',
        options: [
          { value: 'city',    label: 'Heavy stop-go city traffic most of the time' },
          { value: 'mixed',   label: 'Mix of city and highway' },
          { value: 'highway', label: 'Open roads and highways, mostly' },
        ],
      },
      {
        id: 'priority',
        text: 'What do you want most from your gearbox?',
        options: [
          { value: 'smooth',   label: 'Zero effort in traffic. Smoothness above all.' },
          { value: 'reliable', label: 'Nothing to worry about. Just works forever.' },
          { value: 'engaging', label: 'I enjoy driving. Want to feel connected.' },
          { value: 'budget',   label: 'Save money. An automatic for less.' },
        ],
      },
    ],
    getVerdict(a) {
      const { pattern, priority } = a;
      let tag, tagColor, recommendation, insight, caveats;

      if (priority === 'engaging') {
        tag            = 'OUR LEAN';
        tagColor       = 'amber';
        recommendation = 'Manual - or DCT if traffic is a dealbreaker.';
        insight        = `If you enjoy driving, manual is still the most satisfying option in India. You're in control, there's no expensive transmission to worry about, fuel efficiency is better, and repair costs are a fraction of any automatic. The only genuine case against manual is severe city stop-go 5 days a week - the clutch fatigue is real. If that's your life, DCT is the performance automatic: Kia Sonet's 7-speed and VW/Skoda's DSG give you fast, engaging shifts. Caveat on DCT: the VW/Skoda DQ200 has a complicated India history - older Polo/Vento era units had well-documented failures and ₹5L+ replacement bills. India 2.0 generation (Kushaq, Virtus, Taigun, Slavia) is reported improved. Current owners say it works well. The community trust is rebuilding but isn't fully there yet.`;
        caveats = ['Manual gearboxes are being dropped from popular models. Verify your preferred car still offers one before making this the deciding factor.', 'DCT option: carry the DSG reliability question into your 5-year cost thinking. If something does go wrong, parts and labour are expensive.'];
      } else if (priority === 'smooth' && pattern === 'city') {
        tag            = 'CLEAR CALL';
        tagColor       = 'green';
        recommendation = 'CVT.';
        insight        = `CVT is the smoothest automatic for city driving - no gear hunting, no jerk on inclines, just linear power delivery in stop-go. The rubber-band drone at highway speeds is real but mostly affects sustained 80+ kmph cruising; city drivers rarely notice it. Honda's CVTs (City, Amaze), Maruti's K-series CVTs, and Toyota's hybrid CVTs are all solid units with good reliability track records in India. One to be careful with: older Renault and Nissan CVT applications had issues. Stick to Japanese brand implementations and you're fine.`;
        caveats = ['CVT is not ideal for aggressive highway driving or high-altitude routes where you want engine braking. For significant highway use, torque converter is a more complete package.', 'Never tow with a CVT. Most have strict towing restrictions.'];
      } else if (priority === 'reliable') {
        tag            = 'CLEAR CALL';
        tagColor       = 'green';
        recommendation = 'Torque Converter automatic.';
        insight        = `Torque converter (TC) is the most proven, most reliable automatic in India. Hyundai and Kia use 6-speed TCs across the Creta, Seltos, and Grand i10 Nios. Toyota uses them extensively. No widely reported systematic failures, smooth in city, confident on highways. It's not as sporty as DCT, not as droney as CVT, and better than AMT in every way. If you want an automatic that works reliably for 8+ years without drama, TC is the answer. It's not exciting. That's the point.`;
        caveats = ['TC automatics are typically ₹1-1.5L more expensive than AMT. The premium is worth it.', 'Fuel efficiency is marginally worse than CVT but the difference in real Indian driving is small enough to ignore.'];
      } else if (priority === 'budget') {
        tag            = 'OUR LEAN';
        tagColor       = 'amber';
        recommendation = 'AMT - but understand what you\'re getting.';
        insight        = `AMT is the budget automatic and it behaves like one. In moving traffic at 20-40 kmph, it's fine. In crawling stop-go, it hunts, jerks, and feels hesitant - particularly on inclines where it can creep backward briefly before finding grip. This isn't a reliability problem, it's just how AMT works. If your budget doesn't stretch to CVT or TC, AMT beats manual in heavy traffic, just with constant small compromises you'll always notice. Important improvement: AMT software has gotten meaningfully better. Current Tata and Maruti AMTs are noticeably smoother than the first-generation units from 8 years ago. Do a proper test drive in heavy traffic before deciding.`;
        caveats = ['AMT on hills is genuinely stressful. If you live in a hilly city or do regular ghats driving, this is not the right gearbox.', 'Test the creep function specifically. Some AMTs lack proper slow creep movement (needed for parking lots and slow maneuvering). This is something you notice every single day.'];
      } else {
        // mixed/highway + smooth, or catch-all
        tag            = 'OUR LEAN';
        tagColor       = 'amber';
        recommendation = 'Torque Converter automatic.';
        insight        = `For mixed or highway driving, torque converter is the most complete automatic package. CVT is better in pure city but gets droney at sustained highway speeds. DCT is more engaging but carries the VW/Skoda reliability caveat in India. TC sits cleanly in the middle: smooth enough in city, confident on highways, with the most proven reliability of the three. Hyundai and Kia's 6-speed TC in the Creta and Seltos is a benchmark for the segment.`;
        caveats = ['If engagement matters and reliability feels secondary, DCT in the Sonet or VW/Skoda cars is worth a test drive. The difference is genuinely noticeable.'];
      }

      return { tag, tagColor, recommendation, math: null, insight, caveats };
    },
  },

  // -------------------------------------------------------------------------
  // 4. HOW MUCH CAR
  // -------------------------------------------------------------------------
  {
    id: 'budget',
    icon: '₹',
    title: 'How much car can I afford?',
    tagline: 'The question most people get wrong. A real answer.',
    questions: [
      {
        id: 'salary',
        text: 'What\'s your monthly take-home salary (after tax)?',
        options: [
          { value: 'u40',   label: 'Under ₹40,000' },
          { value: '4060',  label: '₹40,000 - ₹60,000' },
          { value: '6080',  label: '₹60,000 - ₹80,000' },
          { value: '80120', label: '₹80,000 - ₹1.2L' },
          { value: 'o120',  label: 'Over ₹1.2L' },
        ],
      },
      {
        id: 'emis',
        text: 'What are your current monthly EMIs (all loans combined)?',
        options: [
          { value: 'none', label: 'None' },
          { value: 'u10',  label: 'Under ₹10,000' },
          { value: '1020', label: '₹10,000 - ₹20,000' },
          { value: 'o20',  label: 'Over ₹20,000' },
        ],
      },
      {
        id: 'dp',
        text: 'How much down payment can you put in right now?',
        options: [
          { value: 'u2',  label: 'Under ₹2L' },
          { value: '25',  label: '₹2L - ₹5L' },
          { value: '510', label: '₹5L - ₹10L' },
          { value: 'o10', label: 'Over ₹10L' },
        ],
      },
    ],
    getVerdict(a) {
      const SAL = { u40: 35000, '4060': 50000, '6080': 70000, '80120': 100000, o120: 150000 };
      const EMI = { none: 0, u10: 5000, '1020': 15000, o20: 25000 };
      const DPM = { u2: 100000, '25': 350000, '510': 750000, o10: 1500000 };

      const income     = SAL[a.salary];
      const existEmi   = EMI[a.emis];
      const dp         = DPM[a.dp];
      const emiRoom    = Math.round(income * 0.15) - existEmi;
      const maxLoan    = emiRoom > 0 ? Math.round(emiRoom * 48 / 1.2) : 0;
      const maxOnRoad  = maxLoan + dp;
      const maxExShow  = Math.round(maxOnRoad * 0.87);
      const running    = Math.round(maxOnRoad * 0.008);

      let tag, tagColor, recommendation, insight, caveats;

      if (emiRoom <= 0) {
        tag            = 'CLOSE CALL';
        tagColor       = 'red';
        recommendation = 'Your existing EMIs leave very little room for a car loan.';
        insight        = `With ₹${(existEmi / 1000).toFixed(0)}K already going to EMIs on ₹${(income / 1000).toFixed(0)}K take-home, adding a car loan puts you in financially stressed territory. The 15% rule says total loan obligations shouldn't exceed ₹${Math.round(income * 0.15 / 1000)}K/month - you're already near or past that. A cash-only purchase using your ₹${(dp / 100000).toFixed(1)}L down payment is the safer path, putting your budget at roughly ₹${(dp / 100000).toFixed(1)}-${((dp * 1.15) / 100000).toFixed(1)}L on-road. In that range: entry new hatchbacks or well-maintained used compact cars.`;
        caveats = ["Don't stretch the car budget to compensate for constraints elsewhere. A ₹5L reliable car beats a ₹12L stressed ownership experience.", `Insurance, fuel, and maintenance add ₹6-10K/month to ownership cost even on a sub-₹8L car. Factor this in before committing.`];
      } else if (maxOnRoad < 700000) {
        tag            = 'OUR LEAN';
        tagColor       = 'amber';
        recommendation = `Up to ₹${(maxOnRoad / 100000).toFixed(1)}L on-road (ex-showroom ~₹${(maxExShow / 100000).toFixed(1)}L)`;
        insight        = `At this budget, your options are: new entry hatchbacks (Alto K10, Tata Tiago, WagonR base trim) or a significantly better used car. The used market here clearly outperforms new - a 4-year-old Baleno, Swift, or Tiago in mid trim at ₹${(maxOnRoad / 100000).toFixed(1)}L gives you far more car than anything new at the same price. Strongly consider certified used if you have any mechanical confidence, or can bring someone who does.`;
        caveats = [`EMI at ₹${Math.max(0, emiRoom / 1000).toFixed(0)}K/month. Add ₹${(running / 1000).toFixed(0)}-${(running * 1.2 / 1000).toFixed(0)}K/month in running costs (fuel, insurance, maintenance) to your monthly calculation.`, 'Ex-showroom is not what you pay. On-road adds registration, insurance, FASTag, and handling charges - typically ₹80K-1.4L depending on state and car value.'];
      } else if (maxOnRoad < 1400000) {
        tag            = 'CLEAR CALL';
        tagColor       = 'green';
        recommendation = `Up to ₹${(maxOnRoad / 100000).toFixed(1)}L on-road (ex-showroom ~₹${(maxExShow / 100000).toFixed(1)}L)`;
        insight        = `This gets you into the heart of the Indian car market. Tata Nexon, Maruti Brezza, Hyundai Venue, Kia Sonet (mid trims), Tata Punch (top trim) - you have real choices without heavy compromise. Practical tip: on-road price includes registration, first-year insurance, and various charges that add ₹1-1.5L to the ex-showroom number. Don't let the on-road quote surprise you at the dealership. Negotiate the car price, then compare insurance outside the dealer - dealer insurance is rarely competitive.`;
        caveats = [`Running costs on a car at this budget run roughly ₹${(running / 1000).toFixed(0)}-${(running * 1.2 / 1000).toFixed(0)}K/month. Make sure post-EMI income comfortably absorbs this.`, 'Dealer accessories packages are almost always overpriced. Decline everything not legally required. FASTag is mandatory. Floor mats, body covers, and seat covers are not.'];
      } else {
        tag            = 'CLEAR CALL';
        tagColor       = 'green';
        recommendation = `Up to ₹${(maxOnRoad / 100000).toFixed(1)}L on-road (ex-showroom ~₹${(maxExShow / 100000).toFixed(1)}L)`;
        insight        = `You have meaningful flexibility. This opens up Hyundai Creta, Kia Seltos, Tata Harrier, Mahindra Scorpio N (lower trims), Volkswagen Taigun, Skoda Kushaq, and Toyota Hyryder / Maruti Grand Vitara. At this level the decision is about what the car needs to do - 5-seater vs. 7-seater, urban vs. highway, tech vs. reliability. Don't buy at the absolute limit of your calculation. Leave ₹1-2L buffer for on-road charges and first-year extras that always appear.`;
        caveats = [`Insurance on a ₹${(maxExShow / 100000).toFixed(0)}L car is ₹25-45K/year. Factor this into total ownership cost.`, 'Popular models (XUV700, Scorpio N) can have 3-12 month waiting periods. If you need a car soon, plan around this.'];
      }

      return {
        tag, tagColor, recommendation,
        math: {
          headline: `Max car EMI: ₹${Math.max(0, emiRoom / 1000).toFixed(0)}K/month. Supported budget: ₹${(maxOnRoad / 100000).toFixed(1)}L on-road.`,
          detail:   `15% of ₹${(income / 1000).toFixed(0)}K take-home for total loan obligations, less ₹${(existEmi / 1000).toFixed(0)}K existing EMIs = ₹${Math.max(0, emiRoom / 1000).toFixed(0)}K available. Plus ₹${(dp / 100000).toFixed(1)}L down payment. 48-month loan at ~9% assumed.`,
        },
        insight,
        caveats,
      };
    },
  },

  // -------------------------------------------------------------------------
  // 5. NEW VS USED
  // -------------------------------------------------------------------------
  {
    id: 'new-vs-used',
    icon: '🔑',
    title: 'New car or used?',
    tagline: 'Depreciation is real. So is the risk of inheriting someone\'s problem.',
    questions: [
      {
        id: 'budget',
        text: 'What\'s your budget on-road?',
        options: [
          { value: 'u6',   label: 'Under ₹6L' },
          { value: '610',  label: '₹6L - ₹10L' },
          { value: '1016', label: '₹10L - ₹16L' },
          { value: 'o16',  label: 'Over ₹16L' },
        ],
      },
      {
        id: 'comfort',
        text: 'How comfortable are you with car maintenance?',
        options: [
          { value: 'confident',  label: 'Comfortable - I know cars or know people who do' },
          { value: 'warranty',   label: 'I really want the comfort of a manufacturer warranty' },
          { value: 'no-idea',    label: 'Honestly no idea about cars. I need something I can trust.' },
        ],
      },
      {
        id: 'usage',
        text: 'How will you use this car?',
        options: [
          { value: 'daily',    label: 'Daily driver, commuting 5-6 days a week' },
          { value: 'second',   label: 'Occasional use or second car in household' },
          { value: 'first',    label: 'First car in the family - a big deal' },
        ],
      },
    ],
    getVerdict(a) {
      const { budget, comfort, usage } = a;
      let tag, tagColor, recommendation, insight, caveats;

      if (budget === 'u6') {
        tag            = 'CLEAR CALL';
        tagColor       = 'green';
        recommendation = 'Buy used. New is a poor use of this budget.';
        insight        = `Under ₹6L on-road, new cars are entry-level only: Maruti Alto K10 (base), Tata Tiago (base), Renault Kwid (bare). All are genuinely stripped - limited features, entry-level safety, small engines. With the same ₹6L in the used market, you're looking at a 4-5 year old Swift, Grand i10 Nios, or Tata Tiago in mid trims. Cars that cost ₹8-9L new are now ₹4.5-6L used. You're getting significantly more car for the same money. The catch: you're inheriting someone else's maintenance choices. Stick to cars with documented service history and get a pre-purchase inspection from an independent mechanic before buying.`;
        caveats = ['Pre-purchase inspection by an independent mechanic costs ₹500-1,500 and is worth it every time. Don\'t skip it, even on Spinny or certified used.', 'Check RC and insurance history via Carinfo or your state RTO portal. Verify owner count and challan history before proceeding.', 'Maruti used cars are slightly overpriced in the used market because of brand trust. A used Honda Amaze or Hyundai Grand i10 at the same price often gives you more.'];
      } else if (budget === '610') {
        if (comfort === 'no-idea') {
          tag            = 'OUR LEAN';
          tagColor       = 'amber';
          recommendation = 'New car, or certified used at minimum.';
          insight        = `If you have no experience with cars and maintenance, a new car's warranty is meaningful insurance. In the ₹6-10L range new, you can get Maruti Swift or Baleno (top trims), Tata Punch (mid-top), Hyundai Grand i10 Nios (top trim) - genuinely good cars with real features. The used market here is compelling (3-year-old Nexon or Venue) but the risk of inheriting a problem you can't diagnose is real when you have zero car knowledge. Certified used from Maruti True Value or Hyundai H-Promise reduces this risk meaningfully - not to zero, but significantly.`;
          caveats = ['Certified used program quality varies. Maruti True Value is the most trusted. Hyundai H-Promise is decent. Avoid random dealer "certified" claims without a standard process.', 'Test drive extensively. Issues with AC performance, brake feel, and suspension sounds tell you a lot in 30 minutes.'];
        } else {
          tag            = 'CLEAR CALL';
          tagColor       = 'green';
          recommendation = 'Used market wins at this budget.';
          insight        = `₹6-10L in the used market gets you dramatically more car than new. You're looking at 2-4 year old Tata Nexon, Hyundai Venue, Kia Sonet, or Maruti Brezza in mid-to-high trims - cars that cost ₹11-14L new. A 3-year-old Nexon XZ at ₹8.5L is a vastly better car than a new Tiago XZ at the same price. Depreciation is front-loaded heavily in India (25-35% in the first 3 years), and that loss is your gain as the second buyer. The used market at this budget, approached carefully, is one of the best value propositions in Indian car buying.`;
          caveats = ['Single-owner preferred. Two or more owners signals potential maintenance issues or an unlucky car.', 'Avoid cars with modified suspension, engine work, or extensive audio upgrades. These often mask underlying issues or introduce new ones.', 'Verify insurance history. A recent major claim needs detailed scrutiny. Carinfo or VAHAN portal shows claim and ownership history.'];
        }
      } else if (budget === '1016') {
        tag            = 'OUR LEAN';
        tagColor       = 'amber';
        recommendation = 'Close call. Depends on your plan.';
        insight        = `At ₹10-16L, the decision gets genuinely nuanced. New options are legitimately good cars: Tata Nexon (top trims), Hyundai Creta (entry), Kia Seltos (entry). Used options reach: 2-3 year old Creta or Seltos in mid-top trim. The depreciation advantage is still real but less dramatic than at lower budgets. Our lean: if you plan to keep 5+ years and value the latest safety tech and warranty, new makes sense. If you plan to sell in 4-5 years, used gives you better value because you're not absorbing the steepest depreciation years yourself.`;
        caveats = ['Check for upcoming model updates before buying. Buying 6 months before a major facelift or generation change is the worst-value timing in a car\'s lifecycle.', 'For used at this budget, insist on documented service history, single-owner with original paint, and a pre-purchase inspection.'];
      } else {
        tag            = 'OUR LEAN';
        tagColor       = 'amber';
        recommendation = 'New car. The premium is more justifiable here.';
        insight        = `Above ₹16L, the case for new strengthens. The absolute rupee depreciation in the first 3 years is higher (₹4-6L on an ₹18L car) but you're also getting the latest generation safety tech, full warranty, current connected features, and financing terms that make the effective monthly cost manageable. More importantly, the used market at premium prices in India is thinner and more opaque. Finding a clean 2-year-old Harrier or XUV700 at the right price and verifiable condition requires significantly more work. If the budget is there, new is cleaner.`;
        caveats = ['Extended warranty (Tata, Hyundai etc.) at delivery is worth buying for cars above ₹15L. ₹15-25K and it covers years 3-5 when components start aging.', 'Don\'t take the dealer\'s finance offer at face value. Get a pre-approved loan quote from your bank first - dealer finance is convenient but rarely the cheapest rate.'];
      }

      return { tag, tagColor, recommendation, math: null, insight, caveats };
    },
  },

  // -------------------------------------------------------------------------
  // 6. IS THE STRONG HYBRID WORTH IT?
  // -------------------------------------------------------------------------
  {
    id: 'hybrid',
    icon: '🔋',
    title: 'Strong hybrid - worth the premium?',
    tagline: 'Grand Vitara / Hyryder strong hybrid. ₹3-4L more. Is the maths there?',
    questions: [
      {
        id: 'km',
        text: 'How many km do you drive per year?',
        options: [
          { value: 'u12',  label: 'Under 12,000' },
          { value: '1220', label: '12,000 - 20,000' },
          { value: '2030', label: '20,000 - 30,000' },
          { value: 'o30',  label: 'Over 30,000' },
        ],
      },
      {
        id: 'pattern',
        text: 'What does your driving look like?',
        options: [
          { value: 'city',    label: 'Mostly city stop-go' },
          { value: 'mixed',   label: 'Mix of city and highway' },
          { value: 'highway', label: 'Mostly highway' },
        ],
      },
      {
        id: 'term',
        text: 'How long will you keep this car?',
        options: [
          { value: 'u4',   label: 'Under 4 years' },
          { value: '47',   label: '4 - 7 years' },
          { value: 'o7',   label: '7+ years' },
        ],
      },
    ],
    getVerdict(a) {
      const KM_MAP = { u12: 9000, '1220': 16000, '2030': 25000, o30: 35000 };
      const kmYear = KM_MAP[a.km];
      const p      = a.pattern;
      const term   = a.term;

      const HYBRID_MPG  = { city: 27, mixed: 22, highway: 18 };
      const PETROL_MPG  = { city: 14, mixed: 16.5, highway: 18.5 };
      const PP          = 105;
      const PREMIUM     = 350000; // ₹3.5L strong hybrid premium

      const hMpg    = HYBRID_MPG[p];
      const pMpg    = PETROL_MPG[p];
      const saving  = Math.round((PP / pMpg - PP / hMpg) * kmYear);
      const beven   = +(PREMIUM / saving).toFixed(1);

      let tag, tagColor, recommendation, insight, caveats;

      if (p === 'highway') {
        tag            = 'CLEAR CALL';
        tagColor       = 'green';
        recommendation = 'Skip the strong hybrid for highway use.';
        insight        = `Strong hybrid's advantage is almost entirely in city driving - that's where the electric motor and regenerative braking make a real difference. On highways at sustained speeds, the strong hybrid's real-world mileage converges with a regular petrol car (both around 18-19 kmpl). The ₹3.5L premium doesn't pay off in highway-heavy use. The mild hybrid or regular 1.5L petrol variant gets you 90% of the car for ₹3-4L less.`;
        caveats = ['If you have any city driving mixed in, revisit this with a "mixed" profile - the hybrid's advantage returns whenever the engine can cut off in traffic.', 'Mild hybrid in Grand Vitara gives minimal fuel savings. If you\'re skipping strong hybrid, the regular 1.5L petrol is often the cleaner choice over mild hybrid too.'];
      } else if (beven > 6 || term === 'u4') {
        tag            = 'CLEAR CALL';
        tagColor       = 'green';
        recommendation = 'Skip the strong hybrid.';
        insight        = term === 'u4'
          ? `At under 4 years ownership, strong hybrid doesn't pay off regardless of km. Breakeven is ${beven} years at your current usage. You'll sell the car before you see the savings. Go with the regular petrol variant and put the ₹3.5L toward something else.`
          : `At ${Math.round(kmYear / 1000)}K km/year, the strong hybrid saves ₹${Math.round(saving / 1000)}K annually - and the breakeven of ${beven} years is longer than most primary ownership cycles. Unless you're very certain you're keeping this car for 7+ years, the math doesn't hold up. The mild hybrid or regular 1.5L petrol variant is the rational choice here.`;
        caveats = ['Strong hybrid resale (especially Toyota UCH) has been strong historically. If you plan to sell in 4-6 years, the premium may partially recover through better resale - but it\'s not guaranteed.', "Don't confuse strong hybrid with mild hybrid. Mild hybrid gets only marginally better city mileage and the savings case is much weaker."];
      } else if (beven > 4.5) {
        tag            = 'OUR LEAN';
        tagColor       = 'amber';
        recommendation = 'Borderline. Only if you\'re keeping it long term.';
        insight        = `Breakeven at ${beven} years means strong hybrid pays off, but only if you're committed to 6-7+ years of ownership. If you're a 4-5 year seller, it doesn't add up. The daily experience case: city strong hybrid ownership is genuinely pleasant - near-silent start-stop in slow traffic, AC maintained by battery during stops, none of the engine-on vibration at lights. Whether ₹3.5L is worth that experience plus eventual fuel savings is a personal call.`;
        caveats = ['Toyota UCH resale has been notably strong. The premium at resale may partially offset the upfront cost if you hold 5+ years.', 'Strong hybrid service requires qualified technicians. Verify there\'s a capable service center in your city before buying.'];
      } else {
        tag            = 'CLEAR CALL';
        tagColor       = 'green';
        recommendation = 'Strong hybrid makes sense.';
        insight        = `At ${Math.round(kmYear / 1000)}K km/year in city-heavy driving, the savings are real - ₹${Math.round(saving / 1000)}K per year and breakeven at ${beven} years. After that, you're saving money every month. City strong hybrid ownership is also a genuinely better daily experience: near-silent at low speeds, no engine noise while crawling in traffic, AC maintained by the battery at stops. This isn't just a feel-good choice - the numbers support it at your usage level.`;
        caveats = ['Strong hybrid battery is warranted for 8 years / 1.6L km (Toyota). Battery replacement concern at normal ownership periods is low.', "The Grand Vitara and Urban Cruiser Hyryder are mechanically identical. Maruti tends to have slightly better dealer pricing flexibility. Toyota has marginally stronger resale and service perception. Pick based on which brand you trust more in your city."];
      }

      return {
        tag, tagColor, recommendation,
        math: {
          headline: `₹${Math.round(saving / 1000)}K saved per year. Breakeven in ${beven} years.`,
          detail:   `${Math.round(kmYear / 1000)}K km/year. Strong hybrid at ${hMpg} kmpl vs petrol at ${pMpg} kmpl for ${p} driving. ₹3.5L strong hybrid premium assumed.`,
        },
        insight,
        caveats,
      };
    },
  },
];

// ---------------------------------------------------------------------------
// APP STATE & RENDERING
// ---------------------------------------------------------------------------

let state = {
  view:    'home',   // 'home' | 'quiz' | 'verdict'
  module:  null,
  answers: {},
  qIndex:  0,
};

function $(id) { return document.getElementById(id); }

function setState(partial) {
  Object.assign(state, partial);
  render();
}

function render() {
  $('screen-home').classList.toggle('hidden', state.view !== 'home');
  $('screen-quiz').classList.toggle('hidden', state.view !== 'quiz');
  $('screen-verdict').classList.toggle('hidden', state.view !== 'verdict');
  $('quiz-chrome').classList.toggle('hidden', state.view === 'home');

  if (state.view === 'quiz')    renderQuiz();
  if (state.view === 'verdict') renderVerdict();
}

// ---------------------------------------------------------------------------
// HOME SCREEN - module cards
// ---------------------------------------------------------------------------

function renderHome() {
  const grid = $('module-grid');
  grid.innerHTML = MODULES.map(m => `
    <button class="module-card" data-id="${m.id}">
      <span class="module-icon">${m.icon}</span>
      <span class="module-title">${m.title}</span>
      <span class="module-tagline">${m.tagline}</span>
      <span class="module-cta">Get the verdict →</span>
    </button>
  `).join('');

  grid.querySelectorAll('.module-card').forEach(btn => {
    btn.addEventListener('click', () => {
      const mod = MODULES.find(m => m.id === btn.dataset.id);
      setState({ view: 'quiz', module: mod, answers: {}, qIndex: 0 });
    });
  });
}

// ---------------------------------------------------------------------------
// QUIZ SCREEN - one question at a time
// ---------------------------------------------------------------------------

function renderQuiz() {
  const mod = state.module;
  const q   = mod.questions[state.qIndex];
  const pct = Math.round((state.qIndex / mod.questions.length) * 100);

  $('quiz-module-title').textContent   = mod.title;
  $('quiz-progress-bar').style.width   = pct + '%';
  $('quiz-step').textContent           = `${state.qIndex + 1} of ${mod.questions.length}`;
  $('quiz-question-text').textContent  = q.text;

  const opts = $('quiz-options');
  opts.innerHTML = q.options.map(o => `
    <button class="option-btn" data-value="${o.value}">${o.label}</button>
  `).join('');

  opts.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', () => selectOption(q.id, btn.dataset.value));
  });
}

function selectOption(qId, value) {
  const newAnswers = { ...state.answers, [qId]: value };
  const mod        = state.module;
  const nextIndex  = state.qIndex + 1;

  if (nextIndex < mod.questions.length) {
    // Animate out then in
    const container = $('quiz-question-wrap');
    container.classList.add('slide-out');
    setTimeout(() => {
      container.classList.remove('slide-out');
      setState({ answers: newAnswers, qIndex: nextIndex });
    }, 180);
  } else {
    setState({ view: 'verdict', answers: newAnswers });
  }
}

// ---------------------------------------------------------------------------
// VERDICT SCREEN
// ---------------------------------------------------------------------------

function renderVerdict() {
  $('quiz-module-title').textContent = state.module.title;
  $('quiz-progress-bar').style.width = '100%';
  $('quiz-step').textContent         = '';

  const mod     = state.module;
  const verdict = mod.getVerdict(state.answers);
  const el      = $('verdict-container');

  const mathHTML = verdict.math ? `
    <div class="verdict-section">
      <div class="section-label">The numbers</div>
      <div class="verdict-math-headline">${verdict.math.headline}</div>
      <div class="verdict-math-detail">${verdict.math.detail}</div>
    </div>
  ` : '';

  const caveatsHTML = verdict.caveats.length ? `
    <div class="verdict-section">
      <div class="section-label">Watch out for</div>
      <ul class="verdict-caveats">
        ${verdict.caveats.map(c => `<li>${c}</li>`).join('')}
      </ul>
    </div>
  ` : '';

  el.innerHTML = `
    <div class="verdict-tag verdict-tag--${verdict.tagColor}">${verdict.tag}</div>
    <h2 class="verdict-recommendation">${verdict.recommendation}</h2>

    ${mathHTML}

    <div class="verdict-section">
      <div class="section-label">The real talk</div>
      <p class="verdict-insight">${verdict.insight}</p>
    </div>

    ${caveatsHTML}

    <div class="verdict-footer">
      <button class="btn-secondary" id="btn-another">Try another question</button>
      <a class="btn-data" href="https://pivode.github.io" target="_blank" rel="noopener">
        Browse our datasets →
      </a>
    </div>
  `;

  $('btn-another').addEventListener('click', () => {
    setState({ view: 'home', module: null, answers: {}, qIndex: 0 });
  });
}

// ---------------------------------------------------------------------------
// BACK BUTTON
// ---------------------------------------------------------------------------

function initBackButton() {
  $('btn-back').addEventListener('click', () => {
    if (state.view === 'quiz' && state.qIndex > 0) {
      setState({ qIndex: state.qIndex - 1 });
    } else {
      setState({ view: 'home', module: null, answers: {}, qIndex: 0 });
    }
  });
}

// ---------------------------------------------------------------------------
// INIT
// ---------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  renderHome();
  initBackButton();
  render();
});
