import { Bacteria } from "../models/Bacteria";
import { NotFoundError } from "../utils/errors/CustomErrors";

class BacteriaService {
	private efetchUrl =
		"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi";
	private esearchUrl =
		"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi";

	private transformData(textData: string): string[] {
		const lines = textData.split("\n");
		const bacteriaList: string[] = [];

		lines.forEach((line) => {
			const match = line.match(/^\d+\.\s*(.*)$/);
			if (match) {
				const [, name] = match;
				bacteriaList.push(name.trim());
			}
		});

		return bacteriaList;
	}

	async getBacteriaDataWithRange(
		rangeStart: number = 0,
		rangeEnd: number = 100
	): Promise<Bacteria[]> {
		const params = new URLSearchParams({
			db: "taxonomy",
			term: "bacteria[organism]",
			retmode: "json",
			retmax: rangeEnd.toString(),
			retstart: rangeStart.toString(),
		});

		// Search for all bacteria records
		const url = `${this.esearchUrl}?${params.toString()}`;
		const response = await fetch(url);
		const result = await response.json();
		const ids = result.esearchresult.idlist.join(",");

		// Fetch names for ids
		const idUrl = `${this.efetchUrl}?db=taxonomy&id=${ids}&retmode=json&rettype=taxonomy`;
		const idResponse = await fetch(idUrl);
		const bacteriaData = await idResponse.text();
		const transformedNames = this.transformData(bacteriaData);

		// Combine IDs and transformed names into an array of Bacteria objects
		const bacteria = result.esearchresult.idlist.map(
			(id: number, index: number) =>
				new Bacteria(id, transformedNames[index])
		);

		return bacteria;
	}

	async getBacteriaByName(name: string): Promise<Bacteria> {
		const formattedName = name.replace(" ", "+") + "[Organism]";
		const params = new URLSearchParams({
			db: "genome",
			term: formattedName,
			retmode: "json",
		});

		const searchUrl = `${this.esearchUrl}?${params.toString()}`;
		const response = await fetch(searchUrl);
		const result = await response.json();

		if (result.esearchresult.count == 0) {
			throw new NotFoundError(
				`Bacteria with name ${name} was not found!`
			);
		}

		return new Bacteria(result.esearchresult.idlist[0], name);
	}
}

export default BacteriaService;
