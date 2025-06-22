// Popular chess openings with their move sequences
export const chessOpenings = [
  {
    id: 'starting_position',
    name: 'Starting Position',
    moves: [],
    description: 'Standard starting position'
  },
  {
    id: 'italian_game',
    name: 'Italian Game',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5'],
    description: 'Classical opening focusing on quick development'
  },
  {
    id: 'ruy_lopez',
    name: 'Ruy Lopez (Spanish Opening)',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'],
    description: 'One of the oldest and most classical of all openings'
  },
  {
    id: 'sicilian_defense',
    name: 'Sicilian Defense',
    moves: ['e4', 'c5'],
    description: 'The most popular and best-scoring response to e4'
  },
  {
    id: 'sicilian_najdorf',
    name: 'Sicilian Defense - Najdorf Variation',
    moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'a6'],
    description: 'Sharp and complex variation of the Sicilian'
  },
  {
    id: 'french_defense',
    name: 'French Defense',
    moves: ['e4', 'e6'],
    description: 'Solid defense leading to strategic positions'
  },
  {
    id: 'caro_kann',
    name: 'Caro-Kann Defense',
    moves: ['e4', 'c6'],
    description: 'Solid and reliable defense'
  },
  {
    id: 'scandinavian_defense',
    name: 'Scandinavian Defense',
    moves: ['e4', 'd5'],
    description: 'Immediate counterattack in the center'
  },
  {
    id: 'queens_gambit',
    name: "Queen's Gambit",
    moves: ['d4', 'd5', 'c4'],
    description: 'Classic queen pawn opening'
  },
  {
    id: 'queens_gambit_declined',
    name: "Queen's Gambit Declined",
    moves: ['d4', 'd5', 'c4', 'e6'],
    description: 'Solid response to the Queen\'s Gambit'
  },
  {
    id: 'kings_indian_defense',
    name: "King's Indian Defense",
    moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7'],
    description: 'Hypermodern defense with kingside fianchetto'
  },
  {
    id: 'nimzo_indian',
    name: 'Nimzo-Indian Defense',
    moves: ['d4', 'Nf6', 'c4', 'e6', 'Nc3', 'Bb4'],
    description: 'Strategic opening controlling the center'
  },
  {
    id: 'english_opening',
    name: 'English Opening',
    moves: ['c4'],
    description: 'Flexible opening controlling d5 and e4'
  },
  {
    id: 'english_symmetrical',
    name: 'English Opening - Symmetrical Variation',
    moves: ['c4', 'c5'],
    description: 'Symmetrical response to the English'
  },
  {
    id: 'catalan_opening',
    name: 'Catalan Opening',
    moves: ['d4', 'Nf6', 'c4', 'e6', 'g3'],
    description: 'Combines Queen\'s Gambit with kingside fianchetto'
  },
  {
    id: 'london_system',
    name: 'London System',
    moves: ['d4', 'Nf6', 'Nf3', 'd5', 'Bf4'],
    description: 'Solid system opening for White'
  },
  {
    id: 'alekhines_defense',
    name: "Alekhine's Defense",
    moves: ['e4', 'Nf6'],
    description: 'Provocative defense attacking the e4 pawn immediately'
  },
  {
    id: 'pirc_defense',
    name: 'Pirc Defense',
    moves: ['e4', 'd6', 'd4', 'Nf6', 'Nc3', 'g6'],
    description: 'Flexible hypermodern defense'
  },
  {
    id: 'modern_defense',
    name: 'Modern Defense',
    moves: ['e4', 'g6'],
    description: 'Hypermodern approach with early fianchetto'
  },
  {
    id: 'dutch_defense',
    name: 'Dutch Defense',
    moves: ['d4', 'f5'],
    description: 'Aggressive defense aiming for kingside attack'
  },
  {
    id: 'benoni_defense',
    name: 'Benoni Defense',
    moves: ['d4', 'Nf6', 'c4', 'c5', 'd5'],
    description: 'Sharp counterattacking defense'
  },
  {
    id: 'grunfeld_defense',
    name: 'Grünfeld Defense',
    moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'd5'],
    description: 'Hypermodern defense challenging the center'
  },
  {
    id: 'petrov_defense',
    name: 'Petrov Defense (Russian Game)',
    moves: ['e4', 'e5', 'Nf3', 'Nf6'],
    description: 'Solid symmetrical defense'
  },
  {
    id: 'vienna_game',
    name: 'Vienna Game',
    moves: ['e4', 'e5', 'Nc3'],
    description: 'Flexible opening with early knight development'
  },
  {
    id: 'kings_gambit',
    name: "King's Gambit",
    moves: ['e4', 'e5', 'f4'],
    description: 'Romantic and aggressive opening'
  },
  {
    id: 'four_knights',
    name: 'Four Knights Game',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Nc3', 'Nf6'],
    description: 'Classical development of both knights'
  }
];

// Helper function to get opening by ID
export function getOpeningById(id) {
  return chessOpenings.find(opening => opening.id === id);
}

// Helper function to get all opening names for dropdown
export function getOpeningOptions() {
  return chessOpenings.map(opening => ({
    value: opening.id,
    label: opening.name
  }));
}
