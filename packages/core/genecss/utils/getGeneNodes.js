import isEmptyObject from './isEmptyObject'
import getContentString from './getContentString'
import parseGene from './parseGene'

export default function (config) {
	const { content, genes } = config

	if (isEmptyObject(genes)) throw new Error('no genes are defined')

	const contentString = getContentString(content)
	const capturedGenes = {}

	Object.entries(genes).forEach(([geneName, gene]) => {
		const parsedGene = parseGene(
			{
				name: geneName,
				...gene,
			},
			config
		)
		const geneRegexGlobal = new RegExp(parsedGene.matches, 'g')
		const capturedGene = (capturedGenes[geneName] = {})

		let result
		while ((result = geneRegexGlobal.exec(contentString)) !== null) {
			const match = result[0]
			let existingMatch = capturedGene[match]
			if (!existingMatch) {
				existingMatch = {
					gene: parsedGene,
					groups: result.groups,
					count: 0,
				}
				capturedGene[match] = existingMatch
			}
			existingMatch.count += 1
		}
	})

	console.log(capturedGenes)
}
