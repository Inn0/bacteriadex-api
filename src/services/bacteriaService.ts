import { Bacteria } from "../models/Bacteria";

class BacteriaService {
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

	async getBacteriaData(rangeStart: number = 0, rangeEnd: number = 100) {
		// Prepare search parameters
		const params = new URLSearchParams({
			db: "taxonomy",
			term: "bacteria[organism]",
			retmode: "json",
			retmax: rangeEnd.toString(),
			retstart: rangeStart.toString(),
		});

		// Search for all bacteria records
		const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?${params.toString()}`;
		const searchResponse = await fetch(searchUrl);
		const searchData = await searchResponse.json();
		const ids = searchData.esearchresult.idlist.join(",");

		// Fetch names for ids
		const fetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=taxonomy&id=${ids}&retmode=json&rettype=taxonomy`;
		const fetchResponse = await fetch(fetchUrl);
		const bacteriaData = await fetchResponse.text();
		const transformedNames = this.transformData(bacteriaData);

		// Combine IDs and transformed names into an array of Bacteria objects
		const bacteria = searchData.esearchresult.idlist.map(
			(id: number, index: number) =>
				new Bacteria(id, transformedNames[index])
		);

		return bacteria;
	}
}

export default BacteriaService;
