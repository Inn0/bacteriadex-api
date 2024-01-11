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

	private async getBacteriaNamesByIds(ids: number[]) {
		const params = new URLSearchParams({
			db: "taxonomy",
			retmode: "json",
			rettype: "taxonomy",
		});

		const idUrl = `${this.efetchUrl}?${params.toString()}&id=${ids}`;
		const idResponse = await fetch(idUrl);
		const bacteriaData = await idResponse.text();
		return this.transformData(bacteriaData);
	}

	private createBacteriaList(ids: number[], names: string[]): Bacteria[] {
		return ids.map((id, index) => new Bacteria(id, names[index]));
	}

	async getBacteriaDataWithRange(
		rangeStart: number = 0,
		rangeEnd: number = 100
	): Promise<Bacteria[]> {
		const params = new URLSearchParams({
			db: "taxonomy",
			term: "bacteria[organism]",
			retmode: "json",
			retmax: (rangeEnd - rangeStart).toString(),
			retstart: rangeStart.toString(),
		});

		const url = `${this.esearchUrl}?${params.toString()}`;
		const response = await fetch(url);
		const result = await response.json();
		const ids = result.esearchresult.idlist.join(",");

		const names = await this.getBacteriaNamesByIds(ids);

		return this.createBacteriaList(result.esearchresult.idlist, names);
	}

	async searchForBacteriaByName(name: string) {
		const formattedName = name.replace(" ", "+") + "[Organism]";
		const params = new URLSearchParams({
			db: "taxonomy",
			term: formattedName,
			retmode: "json",
			retmax: "100",
		});

		const searchUrl = `${this.esearchUrl}?${params.toString()}`;
		const response = await fetch(searchUrl);
		const result = await response.json();

		if (result.esearchresult.count == 0) {
			throw new NotFoundError(
				`Bacteria with name ${name} was not found!`
			);
		}

		const ids = result.esearchresult.idlist.map((str: string) => +str);

		const names = await this.getBacteriaNamesByIds(ids);
		return this.createBacteriaList(result.esearchresult.idlist, names);
	}
}

export default BacteriaService;
