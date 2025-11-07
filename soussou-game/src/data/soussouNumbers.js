// Données statiques des nombres et leurs traductions en Soussou
// Cela permet d'accélérer le chargement en évitant les appels API

export const soussouNumbers = [
  // Nombres de base (1-20)
  { number: 1, soussou: "kelen", translation: "kelen", alternatives: ["kelen"] },
  { number: 2, soussou: "fila", translation: "fila", alternatives: ["fila"] },
  { number: 3, soussou: "saba", translation: "saba", alternatives: ["saba"] },
  { number: 4, soussou: "naani", translation: "naani", alternatives: ["naani"] },
  { number: 5, soussou: "loolu", translation: "loolu", alternatives: ["loolu"] },
  { number: 6, soussou: "wooro", translation: "wooro", alternatives: ["wooro"] },
  { number: 7, soussou: "wolonfila", translation: "wolonfila", alternatives: ["wolonfila"] },
  { number: 8, soussou: "seyi", translation: "seyi", alternatives: ["seyi"] },
  { number: 9, soussou: "kononto", translation: "kononto", alternatives: ["kononto"] },
  { number: 10, soussou: "fu", translation: "fu", alternatives: ["fu"] },
  { number: 11, soussou: "fu nin kelen", translation: "fu nin kelen", alternatives: ["fu nin kelen"] },
  { number: 12, soussou: "fu nin fila", translation: "fu nin fila", alternatives: ["fu nin fila"] },
  { number: 13, soussou: "fu nin saba", translation: "fu nin saba", alternatives: ["fu nin saba"] },
  { number: 14, soussou: "fu nin naani", translation: "fu nin naani", alternatives: ["fu nin naani"] },
  { number: 15, soussou: "fu nin loolu", translation: "fu nin loolu", alternatives: ["fu nin loolu"] },
  { number: 16, soussou: "fu nin wooro", translation: "fu nin wooro", alternatives: ["fu nin wooro"] },
  { number: 17, soussou: "fu nin wolonfila", translation: "fu nin wolonfila", alternatives: ["fu nin wolonfila"] },
  { number: 18, soussou: "fu nin seyi", translation: "fu nin seyi", alternatives: ["fu nin seyi"] },
  { number: 19, soussou: "fu nin kononto", translation: "fu nin kononto", alternatives: ["fu nin kononto"] },
  { number: 20, soussou: "moya", translation: "moya", alternatives: ["moya"] },

  // Dizaines
  { number: 30, soussou: "saba tan", translation: "saba tan", alternatives: ["saba tan"] },
  { number: 40, soussou: "naani tan", translation: "naani tan", alternatives: ["naani tan"] },
  { number: 50, soussou: "loolu tan", translation: "loolu tan", alternatives: ["loolu tan"] },
  { number: 60, soussou: "wooro tan", translation: "wooro tan", alternatives: ["wooro tan"] },
  { number: 70, soussou: "wolonfila tan", translation: "wolonfila tan", alternatives: ["wolonfila tan"] },
  { number: 80, soussou: "seyi tan", translation: "seyi tan", alternatives: ["seyi tan"] },
  { number: 90, soussou: "kononto tan", translation: "kononto tan", alternatives: ["kononto tan"] },
  { number: 100, soussou: "keme", translation: "keme", alternatives: ["keme"] },

  // Nombres composés courants
  { number: 21, soussou: "moya nin kelen", translation: "moya nin kelen", alternatives: ["moya nin kelen"] },
  { number: 22, soussou: "moya nin fila", translation: "moya nin fila", alternatives: ["moya nin fila"] },
  { number: 25, soussou: "moya nin loolu", translation: "moya nin loolu", alternatives: ["moya nin loolu"] },
  { number: 35, soussou: "saba tan nin loolu", translation: "saba tan nin loolu", alternatives: ["saba tan nin loolu"] },
  { number: 45, soussou: "naani tan nin loolu", translation: "naani tan nin loolu", alternatives: ["naani tan nin loolu"] },
  { number: 55, soussou: "loolu tan nin loolu", translation: "loolu tan nin loolu", alternatives: ["loolu tan nin loolu"] },
  { number: 65, soussou: "wooro tan nin loolu", translation: "wooro tan nin loolu", alternatives: ["wooro tan nin loolu"] },
  { number: 75, soussou: "wolonfila tan nin loolu", translation: "wolonfila tan nin loolu", alternatives: ["wolonfila tan nin loolu"] },
  { number: 85, soussou: "seyi tan nin loolu", translation: "seyi tan nin loolu", alternatives: ["seyi tan nin loolu"] },
  { number: 95, soussou: "kononto tan nin loolu", translation: "kononto tan nin loolu", alternatives: ["kononto tan nin loolu"] },

  // Centaines
  { number: 200, soussou: "fila keme", translation: "fila keme", alternatives: ["fila keme"] },
  { number: 300, soussou: "saba keme", translation: "saba keme", alternatives: ["saba keme"] },
  { number: 400, soussou: "naani keme", translation: "naani keme", alternatives: ["naani keme"] },
  { number: 500, soussou: "loolu keme", translation: "loolu keme", alternatives: ["loolu keme"] },
  { number: 600, soussou: "wooro keme", translation: "wooro keme", alternatives: ["wooro keme"] },
  { number: 700, soussou: "wolonfila keme", translation: "wolonfila keme", alternatives: ["wolonfila keme"] },
  { number: 800, soussou: "seyi keme", translation: "seyi keme", alternatives: ["seyi keme"] },
  { number: 900, soussou: "kononto keme", translation: "kononto keme", alternatives: ["kononto keme"] },
  { number: 1000, soussou: "wuli", translation: "wuli", alternatives: ["wuli"] },

  // Nombres composés avec centaines
  { number: 101, soussou: "keme nin kelen", translation: "keme nin kelen", alternatives: ["keme nin kelen"] },
  { number: 110, soussou: "keme nin fu", translation: "keme nin fu", alternatives: ["keme nin fu"] },
  { number: 125, soussou: "keme nin moya nin loolu", translation: "keme nin moya nin loolu", alternatives: ["keme nin moya nin loolu"] },
  { number: 150, soussou: "keme nin loolu tan", translation: "keme nin loolu tan", alternatives: ["keme nin loolu tan"] },
  { number: 175, soussou: "keme nin wolonfila tan nin loolu", translation: "keme nin wolonfila tan nin loolu", alternatives: ["keme nin wolonfila tan nin loolu"] },
  { number: 250, soussou: "fila keme nin loolu tan", translation: "fila keme nin loolu tan", alternatives: ["fila keme nin loolu tan"] },
  { number: 333, soussou: "saba keme nin saba tan nin saba", translation: "saba keme nin saba tan nin saba", alternatives: ["saba keme nin saba tan nin saba"] },
  { number: 444, soussou: "naani keme nin naani tan nin naani", translation: "naani keme nin naani tan nin naani", alternatives: ["naani keme nin naani tan nin naani"] },
  { number: 555, soussou: "loolu keme nin loolu tan nin loolu", translation: "loolu keme nin loolu tan nin loolu", alternatives: ["loolu keme nin loolu tan nin loolu"] },
  { number: 777, soussou: "wolonfila keme nin wolonfila tan nin wolonfila", translation: "wolonfila keme nin wolonfila tan nin wolonfila", alternatives: ["wolonfila keme nin wolonfila tan nin wolonfila"] },
  { number: 999, soussou: "kononto keme nin kononto tan nin kononto", translation: "kononto keme nin kononto tan nin kononto", alternatives: ["kononto keme nin kononto tan nin kononto"] }
];

// Fonction pour obtenir un nombre aléatoire avec sa traduction
export const getRandomSoussouNumber = () => {
  const randomIndex = Math.floor(Math.random() * soussouNumbers.length);
  return soussouNumbers[randomIndex];
};

// Fonction pour obtenir plusieurs nombres aléatoires
export const getRandomSoussouNumbers = (count = 5) => {
  const shuffled = [...soussouNumbers].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Fonction pour trouver un nombre par sa valeur
export const findSoussouNumber = (number) => {
  return soussouNumbers.find(item => item.number === parseInt(number));
};

// Fonction pour trouver un nombre par sa traduction Soussou
export const findNumberBySoussou = (soussouText) => {
  const normalizedText = soussouText.toLowerCase().trim();
  return soussouNumbers.find(item => 
    item.soussou.toLowerCase() === normalizedText ||
    item.translation.toLowerCase() === normalizedText ||
    item.alternatives.some(alt => alt.toLowerCase() === normalizedText)
  );
};

export default soussouNumbers;