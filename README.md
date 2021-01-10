# Mozaïk remote widgets

This is an extension for Mozaïk dashboard, that contains widgets related to Oxen blockchain dashboard

## Widgets

It contains the following widgets:

3 generic widgets from https://github.com/plouc/mozaik-ext-json:

- JsonKeys
- CustomJson
- JsonStatus

Oxen dashboard related widgets:

- StakingGraph
- MedianBlockSizeGraph
- BlockchainSizeGraph
- BlockTimeHistogram
- HashrateGraph
- HashrateGraph24
- NumOfSnGraph
- MinorMajorVersionsGraph
- AlternateChainCountGraph
- NodesDistribution
- NodesDistributionCountries
- NodesDistributionAsn
- MiningPools
- SnVersionGraph

## Usage

### Development

Use `npm run build:es:watch` for hot rebuilding on development

### Production

Build using `npm run build:es` for production