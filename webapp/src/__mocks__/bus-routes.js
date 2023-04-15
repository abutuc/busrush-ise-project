import { v4 as uuid } from 'uuid';

export const busRoutes = [
  {
    id: 'AVRBUS-L11',
    name: 'Linha 11',
    stops: [
      {
        id: uuid(),
        name: 'Terminal Rodoviário de Aveiro',
        position: [40.64404, -8.63906]
      },
      {
        id: uuid(),
        name: 'Av. Dr. Lourenço Peixinho - CTT B',
        position: [40.6434, -8.64491]
      },
      {
        id: uuid(),
        name: 'Av. Dr. Lourenço Peixinho - Oita B',
        position: [40.64289, -8.6475]
      },
      {
        id: uuid(),
        name: 'Av. Dr. Lourenço Peixinho - Capitania B',
        position: [40.64195, -8.65185]
      },
      {
        id: uuid(),
        name: 'Caçadores 10 - Misericórdia',
        position: [40.64081, -8.65299]
      },
      {
        id: uuid(),
        name: 'Av. de Santa Joana B',
        position: [40.63834, -8.6518]
      },
      {
        id: uuid(),
        name: 'Universidade - Antiga Reitoria A',
        position: [40.63496, -8.65693]
      },
      {
        id: uuid(),
        name: 'Universidade - Reitoria A',
        position: [40.63208, -8.65802]
      },
      {
        id: uuid(),
        name: 'Universidade - Pavilhão A',
        position: [40.63017, -8.65501]
      },
      {
        id: uuid(),
        name: 'Universidade - Santiago A',
        position: [40.62979, -8.65955]
      },
      {
        id: uuid(),
        name: 'Universidade - Crasto',
        position: [40.62316, -8.65772]
      },
      {
        id: uuid(),
        name: 'Universidade - Santiago B',
        position: [40.62978, -8.65953]
      },
      {
        id: uuid(),
        name: 'Universidade - ISCAUA A',
        position: [40.63076, -8.65341]
      },
      {
        id: uuid(),
        name: 'Universidade - ISCAUA B',
        position: [40.63083, -8.65325]
      },
      {
        id: uuid(),
        name: 'Universidade - Pavilhão B',
        position: [40.63018, -8.65499]
      },
      {
        id: uuid(),
        name: 'Universidade - Reitoria B',
        position: [40.63212, -8.65804]
      },
      {
        id: uuid(),
        name: 'Universidade - Antiga Reitoria B',
        position: [40.63492, -8.65686]
      }
    ]
  }
];
