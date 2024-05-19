import './style.css';
import { Town, Department, Region } from './types';
import DomService from './Services/DomService';
import DataService from './Services/DataService';

// Create a container html element to wire everything together
const root = DomService.createMarkup("div", document.body, { id: "root" }) as HTMLDivElement;

// Create the adminitration division form
const adminDivisionForm = DomService.createMarkup("form", root, { id: "adminDivisionForm" }) as HTMLFormElement;

// Create a select composant to select a region
const regionSelect: HTMLSelectElement = DomService.createSelectComposant("region", "region", "Séléctionner une région", adminDivisionForm);

// Create a select composant to select a department
const departmentSelect: HTMLSelectElement = DomService.createSelectComposant("department", "departement", "Séléctionner un département", adminDivisionForm);

// Create a select composant to select a town
const townSelect: HTMLSelectElement = DomService.createSelectComposant("town", "town", "Séléctionner une town", adminDivisionForm);

// Create a result component to display the fetched data
const townDetailsComponent: HTMLElement = DomService.createMarkup("div", root, { id: "townDetails" });

// Fetching regions right away after the page is loaded
document.addEventListener('DOMContentLoaded', async (): Promise<void> => {

  try {
    // Fetch the list of regions from the API
    const loadedRegions: Region[] = await DataService.loadRegions();

    // Append the fetched regions to the region select menu
    loadedRegions.forEach((region: Region): void => {
      DomService.createOptionComposant(regionSelect, region.nom)
    })

    // Once a region is selected, load the corresponding departments and append them to the department select menu
    regionSelect.addEventListener('change', async (event: Event): Promise<void> => {

      // Clear the department and town select inputs everytime a new region is selected
      DomService.clearSelectMenu(departmentSelect, "Séléctionner un département");
      DomService.clearSelectMenu(townSelect, "Séléctionner un département");

      // Clear the town details component
      DomService.clearAndHideComponent(townDetailsComponent);

      // Save the selected region name
      const regionName: string = (event.target as HTMLSelectElement).value;

      // Look for the region code in the fetched regions array
      const regionCode: string = loadedRegions
        .filter((region: Region): boolean => region.nom === regionName)
        .map((region: Region): string => region.code)[0];

      // Fetch the list of departments from API or create an empty array if no department is found
      const loadedDepartments: Department[] = regionCode ? await DataService.loadDepartments(regionCode) : [];

      // Append the list of departments to the department select menu
      if (loadedDepartments.length > 0) {
        // Append the fetched departments the select menu
        loadedDepartments.forEach((department: Department): void => {
          DomService.createOptionComposant(departmentSelect, department.nom);
        })
      }

      // Once a department is selected, load the corresponding towns and append them to the town select menu
      departmentSelect.addEventListener("change", async (event: Event): Promise<void> => {
        // Clear the town select everytime a new department is selected
        DomService.clearSelectMenu(townSelect, "Séléctionner une town");

        const departmentName: string = (event.target as HTMLSelectElement).value;

        const departmentCode: string = loadedDepartments
          .filter((department: Department): boolean => department.nom === departmentName)
          .map((department: Department): string => department.code)[0];

        if (!DomService.departmentNameIsValid(departmentName)) townDetailsComponent.style.display = 'none';

        const loadedTowns: Town[] = departmentCode ? await DataService.loadTowns(departmentCode) : [];

        if (loadedTowns.length > 0) {
          // Clear the town select everytime a new department is selected
          DomService.clearSelectMenu(townSelect, "Séléctionner une town");

          loadedTowns.forEach((town: Town): void => {
            DomService.createOptionComposant(townSelect, town.nom)
          })

          // Once a town is selected, log its name, population and postal code
          townSelect.addEventListener("change", (event: Event): void => {
            // Clear the town details component everytime a new town is selected
            townDetailsComponent.innerHTML = "";

            // Get the details of the selected town
            const townName: string = (event.target as HTMLSelectElement).value;

            if (!DomService.townNameIsValid(townName)) {
              townDetailsComponent.style.display = "none";
              return;
            }

            const townPopualation: number = DataService.findTown(loadedTowns, townName)?.population;
            const townPostalCodes: string[] = DataService.findTown(loadedTowns, townName)?.codesPostaux;
            const townPostalCodesToString: string = townPostalCodes?.length > 0 ? townPostalCodes.join(", ") : "";
            // Display the details of the selected town
            DomService.createMarkup("h2", townDetailsComponent, { id: "town" }, townName);
            DomService.createMarkup("h2", townDetailsComponent, { id: "population" }, `Population : ${townPopualation}`);
            DomService.createMarkup("span", townDetailsComponent, { id: "postalCodes" }, `${townPostalCodes?.length > 1 ? "Code Postaux" : "Code Postal"} : ${townPostalCodesToString}`);

            townDetailsComponent.style.display = "block";
          })
        }
      })

    })
  } catch (error) {
    // Create an alert element to display errors if something goes wrong
    const alertError = DomService.createMarkup(
      "div",
      root,
      { id: "errorAlert" },
      "Une erreur s'est produite lors du chargement des données. Veuillez réessayer ultérieurement."
    ) as HTMLDivElement;

    // Append the alert element to the root element
    adminDivisionForm.appendChild(alertError);
  }
});