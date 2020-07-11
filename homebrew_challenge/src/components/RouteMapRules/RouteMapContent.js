export const LOCKDOWN = "lockdown";
export const PHASE_1 = "phase1";
export const PHASE_2 = "phase2";
export const PHASE_3 = "phase3";
export const PHASE_4 = "phase4";

// Update this when current phase changes.
// One of the phases above
export const CURRENT_PHASE = PHASE_3;

const ICON_SOCIAL_DISTANCING = {
  image: "./assets/social_distancing.png",
  altText: "social distancing",
};
const ICON_PUBLIC_HEALTH_ADVICE = {
  image: "./assets/public_health_advice.png",
  altText: "public health advice",
};
const ICON_WASHING_HANDS = {
  image: "./assets/washing_hands_dark.png",
  altText: "washing hands ",
};
const ICON_SCHOOLS = {
  image: "./assets/school_roof_alt.png",
  altText: "schools",
};
const ICON_HOUSEHOLDS_OUTDOOR = {
  image: "./assets/households_outdoor.png",
  altText: "households outdoor",
};
const ICON_EXERCISE = {
  image: "./assets/exercising.png",
  altText: "exercise",
};
const ICON_HOUSEHOLDS_INDOOR = {
  image: "./assets/household_meeting_alt.png",
  altText: "households indoor",
};
const ICON_FACE_COVERING = {
  image: "./assets/face_covering_alt.png",
  altText: "face covering",
};
const ICON_SHOPPING = {
  image: "./assets/shopping_centre.png",
  altText: "shopping",
};
const ICON_CINEMA_MUSEUM = {
  image: "./assets/cinema_museum.png",
  altText: "cinemas and museums",
};
const ICON_HOTEL_CAMPSITE = {
  image: "./assets/hotels_campsites.png",
  altText: "hotels and campsites",
};
const ICON_LARGER_GATHERING = {
  image: "./assets/larger_gatherings.png",
  altText: "larger gathering",
};
const ICON_LIVE_EVENTS = {
  image: "./assets/larger_gatherings_alt.png",
  altText: "live events",
};

export const PHASE_CONTENT = {
  lockdown: {
    title: "Lockdown",
    cat1: {
      text:
        "Maintain strict social distancing, keeping 2m from people not from your household.",
      icon: ICON_SOCIAL_DISTANCING,
    },
    cat2: {
      text:
        "High risk individuals must shield in line with public health advice.",
      icon: ICON_PUBLIC_HEALTH_ADVICE,
    },
    cat3: {
      text: "Frequent handwashing and hygiene measures for all.",
      icon: ICON_WASHING_HANDS,
    },
    cat4: {
      text: "Schools and childcare services closed.",
      icon: ICON_SCHOOLS,
    },
  },
  phase1: {
    title: "Phase 1",
    cat1: {
      text:
        "Maintain social distancing, keeping 2m from people that are not from your household.",
      icon: ICON_SOCIAL_DISTANCING,
    },
    cat2: {
      text: "You can meet with one other household outdoors.",
      icon: ICON_HOUSEHOLDS_OUTDOOR,
    },
    cat3: {
      text: "Frequent handwashing and hygiene measures for all.",
      icon: ICON_WASHING_HANDS,
    },
    cat4: {
      text: "You can have unrestricted trips outdoors for exercise.",
      icon: ICON_EXERCISE,
    },
  },
  phase2: {
    title: "Phase 2",
    cat1: {
      text:
        "Maintain social distancing, keeping 2m from people that are not from your household.",
      icon: ICON_SOCIAL_DISTANCING,
    },
    cat2: {
      text: "You can meet with people from another household inside.",
      icon: ICON_HOUSEHOLDS_INDOOR,
    },
    cat3: {
      text:
        "You must wear a face covering when using public transport or in shops.",
      icon: ICON_FACE_COVERING,
    },
    cat4: {
      text: "Non-essential retail can open with safeguards in place.",
      icon: ICON_SHOPPING,
    },
  },
  phase3: {
    title: "Phase 3",
    cat1: {
      text:
        "Maintain social distancing, keeping 2m from people that are not from your household.",
      icon: ICON_SOCIAL_DISTANCING,
    },
    cat2: {
      text:
        "Able to meet with people from more than one household indoors with physical distancing and hygiene measures in place.",
      icon: ICON_HOUSEHOLDS_INDOOR,
    },
    cat3: {
      text:
        "Museums, galleries, libraries, cinemas open, subject to physical distancing and hygiene measures.",
      icon: ICON_CINEMA_MUSEUM,
    },
    cat4: {
      text: "Hotels, campsites, B&Bs can open with safeguards in place.",
      icon: ICON_HOTEL_CAMPSITE,
    },
  },
  phase4: {
    title: "Phase 4",
    cat1: {
      text:
        "Physical distancing requirements to be updated on scientific advice.",
      icon: ICON_SOCIAL_DISTANCING,
    },
    cat2: {
      text: "Further relaxation on restrictions for gathering.",
      icon: ICON_LARGER_GATHERING,
    },
    cat3: {
      text:
        "Schools and childcare provision, operating with any necessary precaution.",
      icon: ICON_SCHOOLS,
    },
    cat4: {
      text:
        "Further relaxation of restrictions on live events in line with public health advice.",
      icon: ICON_LIVE_EVENTS,
    },
  },
};
