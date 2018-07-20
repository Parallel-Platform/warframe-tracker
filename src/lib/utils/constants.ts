export const SYNDICATES = {
    arbitersOfHexis: 'Arbiters of Hexis',
    newLoka: 'New Loka',
    cephalonSuda: 'Cephalon Suda',
    perrinSequence: 'Perrin Sequence',
    redVeil: 'Red Veil',
    steelMeridian: 'Steel Meridian'
};

export const SYNDICATE_CSS_CLASSES = [
    { name: SYNDICATES.arbitersOfHexis, cssClass: 'syndicate-arbiters' },
    { name: SYNDICATES.newLoka, cssClass: 'syndicate-loka' },
    { name: SYNDICATES.cephalonSuda, cssClass: 'syndicate-suda' },
    { name: SYNDICATES.perrinSequence, cssClass: 'syndicate-perrin' },
    { name: SYNDICATES.redVeil, cssClass: 'syndicate-veil' },
    { name: SYNDICATES.steelMeridian, cssClass: 'syndicate-maridian' }
];

const assetsPath = '../assets/img/syndicates/';

export const SYNDICATE_IMAGES = [
    { name: SYNDICATES.arbitersOfHexis, url: `${assetsPath}Arbiters of Hexis.png` },
    { name: SYNDICATES.newLoka, url: `${assetsPath}New Loka.png` },
    { name: SYNDICATES.cephalonSuda, url: `${assetsPath}Cephalon Suda.png` },
    { name: SYNDICATES.perrinSequence, url: `${assetsPath}The Perrin Sequence.png` },
    { name: SYNDICATES.redVeil, url: `${assetsPath}Red Veil.png` },
    { name: SYNDICATES.steelMeridian, url: `${assetsPath}Steel Maridian.png` }
]
