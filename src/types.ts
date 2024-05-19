export interface MarkupAttributes {
    [key: string]: string;
}

export interface Region {
    code: string,
    nom: string,
}

export interface Department {
    code: string,
    nom: string,
    codeRegion: string,
}


export interface Town {
    nom: string
    code: string,
    codeDepartement: string,
    siren: string,
    codeEpci: string,
    codeRegion: string,
    codesPostaux: string[],
    population: number,
}