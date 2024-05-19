import { Town, Department, Region } from "../types";

export default class Service {
    // static baseUrl: string = "https://geo.api.gouv.fr";

    static loadRegions(): Promise<Region[]> {
        return this.loadData("https://geo.api.gouv.fr/regions");
    }

    static loadDepartments(regionCode: string): Promise<Department[]> {
        return this.loadData(`https://geo.api.gouv.fr/regions/${regionCode}/departements`);
    }

    static loadTowns(departementCode: string): Promise<Town[]> {
        return this.loadData(`https://geo.api.gouv.fr/departements/${departementCode}/communes`);
    }

    static loadData(apiUrl: string) {
        return fetch(apiUrl)
            .then(response => response.json())
            .then(data => data)
            .catch(console.error);
    }

    static findTown(towns: Town[], name: string): Town {
        const town = towns.find((town: Town) => town.nom === name)!;
        return town;
    }

}